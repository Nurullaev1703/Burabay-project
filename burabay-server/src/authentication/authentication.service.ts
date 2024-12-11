import { HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  // регистрация нового пользователя
  private async _registerTourist(signInDto: SignInDto) {
    let user: User;
      user = new User({
        fullName: '',
        phoneNumber: '',
        role: ROLE_TYPE.TOURIST,
        email: signInDto.email,
        password: '',
        isEmailConfirmed: false
      });
      await this.entityManager.save(user);  
  }
  // регистрация новой компании
  private async _registerBusiness(signInDto: SignInDto) {
    let user: User;
      const organization = new Organization({
        name: '',
        imgUrl: '',
        address: '',
        rating: 0,
        reviewCount: 0,
        isConfirmed: false
      });
      await this.entityManager.save(organization);
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(signInDto.password, salt);
      user = new User({
        fullName: '',
        phoneNumber: '',
        role: signInDto.role,
        email: signInDto.email,
        password: hash,
        organization: organization,
        isEmailConfirmed: false
      });
      await this.entityManager.save(user);
  }
  // логин пользователя по email
  async login(signInDto: SignInDto) {
    try {
      const userExist = await this.userRepository.findOne({
        where: {
          email: signInDto.email
        },
      });
      
      // если почта уже зарегистрирована на туриста
      if (userExist && userExist.role !== signInDto.role) {
        return JSON.stringify(HttpStatus.CONFLICT);
      }

      // если пользователь зарегистрирован, но не подтвержден
      if(userExist && !userExist.isEmailConfirmed){
        await this.emailService.sendAcceptMessage(signInDto.email);
        return JSON.stringify(HttpStatus.UNAUTHORIZED)
      }

      // если пользователь найден, значит уже зарегистрирован и авторизуем его
      if (userExist) {
        return JSON.stringify(HttpStatus.OK);
      }

      // если пришел пароль, то регистрируем как организацию
      if(signInDto.password?.length){
        await this._registerBusiness(signInDto);
        await this.emailService.sendAcceptMessage(signInDto.email)
        return JSON.stringify(HttpStatus.CREATED);
      }

      await this._registerTourist(signInDto);
      await this.emailService.sendAcceptMessage(signInDto.email);
      return JSON.stringify(HttpStatus.CREATED);
    } catch {
      return JSON.stringify(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkUser(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
        role: loginDto.role,
      },
    });

    if (user.password.length) {
      const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);

      if (!isPasswordMatch) {
        throw JSON.stringify(HttpStatus.CONFLICT);
      }
      const payload: TokenData = { id: user.id };
      const token = await this.jwtService.signAsync(payload);

      return JSON.stringify(token);
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(loginDto.password, salt);

    const updatedUser = new User({ ...user, password: hash });
    await this.userRepository.save(updatedUser);

    const payload: TokenData = { id: updatedUser.id };
    const token = await this.jwtService.signAsync(payload);

    return JSON.stringify(token);
  }
}
