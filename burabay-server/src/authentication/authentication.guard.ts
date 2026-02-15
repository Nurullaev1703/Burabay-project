import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);

      // Проверяем, не заблокирован ли пользователь
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
        relations: { organization: true },
      });

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      // Проверка блокировки для туриста
      if (user.isBanned) {
        throw new UnauthorizedException('Ваш аккаунт заблокирован');
      }

      // Проверка блокировки для организации
      if (user.organization && user.organization.isBanned) {
        throw new UnauthorizedException('Ваша организация заблокирована');
      }

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Ошибка авторизации');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
