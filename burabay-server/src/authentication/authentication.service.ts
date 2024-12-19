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
import { GoogleAccessToken, GoogleAuthType } from './model/GoogleAuth';
import { FacebookAuthData } from './model/FacebookAuth';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

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
      isEmailConfirmed: false,
      picture: '',
    });
    await this.entityManager.save(user);
  }
  // регистрация новой компании
  private async _registerBusiness(signInDto: SignInDto) {
    let user: User;
    const organization = new Organization({
      name: '',
      imgUrl: '',
      description: '',
      siteUrl: '',
      rating: 0,
      reviewCount: 0,
      isConfirmed: false,
    });
    await this.entityManager.save(organization);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(signInDto.password, salt);
    user = new User({
      fullName: '',
      phoneNumber: '',
      role: signInDto.role || ROLE_TYPE.BUSINESS,
      email: signInDto.email,
      password: hash,
      organization: organization,
      isEmailConfirmed: false,
      picture: '',
    });
    await this.entityManager.save(user);
  }
  // логин пользователя по email
  async login(signInDto: SignInDto) {
    try {
      const userExist = await this.userRepository.findOne({
        where: {
          email: signInDto.email,
        },
      });

      // если почта уже зарегистрирована на туриста
      if (signInDto.role) {
        if (userExist && userExist.role !== signInDto?.role) {
          return JSON.stringify(HttpStatus.CONFLICT);
        }
      }

      // если пользователь зарегистрирован, но не подтвержден
      if (userExist && !userExist.isEmailConfirmed) {
        await this.emailService.sendAcceptMessage(signInDto.email);
        return JSON.stringify(HttpStatus.UNAUTHORIZED);
      }

      // если пользователь найден, значит уже зарегистрирован и авторизуем его
      if (userExist) {
        return JSON.stringify(HttpStatus.OK);
      }

      // если пришел пароль, то регистрируем как организацию
      if (signInDto.password?.length) {
        await this._registerBusiness(signInDto);
        await this.emailService.sendAcceptMessage(signInDto.email);
        return JSON.stringify(HttpStatus.CREATED);
      }

      await this._registerTourist(signInDto);
      await this.emailService.sendAcceptMessage(signInDto.email);
      return JSON.stringify(HttpStatus.CREATED);
    } catch {
      return JSON.stringify(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // обработка Google авторизации
  async googleLogin(userInfo: GoogleAuthType) {
    try {
      const userExist = await this.userRepository.findOne({
        where: {
          email: userInfo.email,
        },
      });

      // если пользователь существует, отправляем на авторизацию
      if (userExist) {
        // если пользователь есть, но без пароля
        if (!userExist.password.length) {
          return JSON.stringify(HttpStatus.CREATED);
        }
        return JSON.stringify(HttpStatus.OK);
      }

      // регистрируем нового пользователя
      const user = new User({
        fullName: userInfo.name || '',
        phoneNumber: '',
        role: ROLE_TYPE.TOURIST,
        email: userInfo.email,
        password: '',
        isEmailConfirmed: false,
        picture: userInfo.picture || '',
      });
      await this.entityManager.save(user);
      return JSON.stringify(HttpStatus.CREATED);
    } catch {
      return JSON.stringify(HttpStatus.CONFLICT);
    }
  }
  // обработка Facebook авторизации
  async facebookLogin(userInfo: FacebookAuthData) {
    try {
      const userExist = await this.userRepository.findOne({
        where: {
          email: userInfo.email,
        },
      });
      // если пользователь существует, отправляем на авторизацию
      if (userExist) {
        // если пользователь есть, но без пароля
        if (!userExist.password?.length) {
          return JSON.stringify(HttpStatus.CREATED);
        }
        return JSON.stringify(HttpStatus.OK);
      }

      // регистрируем нового пользователя
      const user = new User({
        fullName: userInfo.name || '',
        phoneNumber: '',
        role: ROLE_TYPE.TOURIST,
        email: userInfo.email,
        password: '',
        isEmailConfirmed: false,
        picture: userInfo?.picture?.data?.url || '',
      });
      await this.entityManager.save(user);
      return JSON.stringify(HttpStatus.CREATED);
    } catch {
      return JSON.stringify(HttpStatus.CONFLICT);
    }
  }

  async checkUser(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    // если у пользователя есть пароль, то проверяем
    if (user.password.length) {
      const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);

      if (!isPasswordMatch) {
        return JSON.stringify(HttpStatus.CONFLICT);
      }
      const payload: TokenData = { id: user.id };
      const token = await this.jwtService.signAsync(payload);

      return JSON.stringify(token);
    }

    // если пароля не было, то создаем и отправляем токен
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(loginDto.password, salt);

    const updatedUser = new User({ ...user, isEmailConfirmed: true, password: hash });
    await this.userRepository.save(updatedUser);

    const payload: TokenData = { id: updatedUser.id };
    const token = await this.jwtService.signAsync(payload);

    return JSON.stringify(token);
  }
  async resetPassword(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(loginDto.password, salt);

    const updatedUser = new User({ ...user, password: hash });
    await this.userRepository.save(updatedUser);

    const payload: TokenData = { id: updatedUser.id };
    const token = await this.jwtService.signAsync(payload);

    return JSON.stringify(token);
  }
  async updateOrganizationInfo(updateDto: UpdateOrganizationDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: updateDto.email,
      },
      relations: {
        organization: true,
      },
    });

    if (!user) {
      return JSON.stringify(HttpStatus.CONFLICT);
    }

    const organization = new Organization({
      ...user.organization,
      name: updateDto.orgName,
      description: updateDto.description,
      siteUrl: updateDto.siteUrl || user.organization.siteUrl,
    });
    await this.entityManager.save(organization);
    const updatedUser = new User({
      ...user,
      isEmailConfirmed: true,
    });
    await this.entityManager.save(updatedUser);

    const payload: TokenData = { id: updatedUser.id };
    const token = await this.jwtService.signAsync(payload);
    return JSON.stringify(token);
  }

  async changePassword(tokenData: TokenData, changePasswordDto: ChangePasswordDto ){
      const user = await this.userRepository.findOne({
        where:{
          id: tokenData.id
        }
      })

      if(!user){
        return JSON.stringify(HttpStatus.CONFLICT)
      }

      const isPasswordMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);

      if (!isPasswordMatch) {
        throw JSON.stringify(HttpStatus.CONFLICT);
      }
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(changePasswordDto.newPassword, salt);
      const newUser = new User({
        ...user,
        password: hash
      })
      await this.entityManager.save(newUser)
      return JSON.stringify(HttpStatus.OK)
  }

  async updateUserEmail(tokenData: TokenData, updateEmailDto:UpdateEmailDto){
    const user = await this.userRepository.findOne({
      where:{
        id:tokenData.id
      }
    })
    if(!user){
      return JSON.stringify(HttpStatus.CONFLICT)
    }

    const updatedUser = new User({
      ...user,
      email: updateEmailDto.email
    })
    await this.entityManager.save(updatedUser);
    return JSON.stringify(HttpStatus.OK)
  }
}
