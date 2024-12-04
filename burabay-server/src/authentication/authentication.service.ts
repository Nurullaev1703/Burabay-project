import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Address } from 'src/users/entities/address.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { POSITION_TYPE } from 'src/users/types/user-types';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  private async _login(authPoint: string, user: User) {

    const payload: TokenData = { id: user.id };
    const token = await this.jwtService.signAsync(payload);

    return JSON.stringify(token);
  }

  async register(signInDto: SignInDto) {
    const organization = new Organization({
      type: null,
      identityNumber: '',
      name: '',
      imgUrl: '',
    });
    await this.entityManager.save(organization);

    const address = new Address({
      region: '',
      city: '',
      street: '',
    });
    await this.entityManager.save(address);

    const user = new User({
      phoneNumber: signInDto.phoneNumber,
      role: signInDto.role,
      position: POSITION_TYPE.LEADER,
      iin: '',
      fullName: '',
      email: '',
      permissions: {
        createOrders: true,
        signContracts: true,
        editProducts: true,
        editEmployees: true,
      },
    });
    await this.entityManager.save(user);

    return user;
  }

  async auth(signInDto: SignInDto) {
    const userExist = await this.userRepository.findOne({
      where: {
        phoneNumber: signInDto.phoneNumber,
        role: signInDto.role,
      }
    });
    // если пользователь найден, значит уже зарегистрирован и авторизуем его
    if (userExist) {
      const token = await this._login(signInDto.authPoint, userExist);
      return token;
    }

    const user = await this.register(signInDto);

    const token = await this._login(signInDto.authPoint, user);

    return token;
  }

  async authByIin(userIin: string) {
    const user = await this.userRepository.findOne({
      where: {
        iin: userIin,
      },
    });
    if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    const payload: TokenData = { id: user.id };
    const token = await this.jwtService.signAsync(payload);

    return JSON.stringify(token);
  }
}
