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
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly entityManager: EntityManager,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
  ) {
    this.createAdminAccount({
      email: 'burabai.travel@gmail.com',
      role: ROLE_TYPE.ADMIN,
      password: 'burAdmin2025',
    });
  }

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
        relations: {
          organization: true,
        },
      });

      // Проверка конфликта ролей
      if (signInDto.role && userExist) {
        // Если роли не совпадают
        if (userExist.role !== signInDto.role) {
          // Если пользователь турист с паролем - конфликт (409)
          if (userExist.role === ROLE_TYPE.TOURIST && userExist.password?.length > 0) {
            return JSON.stringify(HttpStatus.CONFLICT);
          }
          
          // Если пользователь турист без пароля - предупреждение (410 GONE)
          // Фронт должен показать сообщение о том, что аккаунт будет удален через 24 часа
          if (userExist.role === ROLE_TYPE.TOURIST && (!userExist.password || userExist.password.length === 0)) {
            return JSON.stringify(HttpStatus.GONE); // 410 - аккаунт скоро будет удален
          }
          
          // Для других случаев - обычный конфликт
          return JSON.stringify(HttpStatus.CONFLICT);
        }
      }

      // Проверка блокировки пользователя или организации
      if (
        userExist &&
        (userExist.isBanned || (userExist.organization && userExist.organization.isBanned))
      ) {
        // Возвращаем объект с кодом и сообщением чтобы фронт мог показать локализованный hint
        if (userExist.isBanned) {
          return { message: 'Ваш аккаунт заблокирован', statusCode: 401 };
        }
        if (userExist.organization && userExist.organization.isBanned) {
          return { message: 'Ваша организация заблокирована', statusCode: 401 };
        }
        return JSON.stringify(HttpStatus.FORBIDDEN);
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
      if (signInDto.password?.length && signInDto.role == ROLE_TYPE.BUSINESS) {
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
        relations: {
          organization: true,
        },
      });

      // если пользователь существует, отправляем на авторизацию
      if (userExist) {
        // Проверка блокировки пользователя или организации
        if (userExist.isBanned || (userExist.organization && userExist.organization.isBanned)) {
          // Возвращаем статус Forbidden для заблокированных
          return JSON.stringify(HttpStatus.FORBIDDEN);
        }

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
        relations: {
          organization: true,
        },
      });
      // если пользователь существует, отправляем на авторизацию
      if (userExist) {
        // Проверка блокировки пользователя или организации
        if (userExist.isBanned || (userExist.organization && userExist.organization.isBanned)) {
          // Возвращаем статус Forbidden для заблокированных
          return JSON.stringify(HttpStatus.FORBIDDEN);
        }

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
      relations: {
        organization: true,
      },
    });

    // Проверка блокировки пользователя или организации
    if (user.isBanned || (user.organization && user.organization.isBanned)) {
      return JSON.stringify(HttpStatus.FORBIDDEN);
    }

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
    await this.userRepository.update(user.id, {
      ...user,
      isEmailConfirmed: true,
    });
    await this.organizationRepository.update(user.organization.id, {
      ...user.organization,
      name: updateDto.orgName,
      description: updateDto.description,
      siteUrl: updateDto.siteUrl || user.organization.siteUrl,
    });

    const payload: TokenData = { id: user.id };
    const token = await this.jwtService.signAsync(payload);
    return JSON.stringify(token);
  }

  async changePassword(tokenData: TokenData, changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: tokenData.id,
        },
      });

      if (!user) {
        // user not found
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw new Error('USER_NOT_FOUND');
      }

      if (!user.password) {
        // no existing password set
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw new Error('NO_PASSWORD_SET');
      }

      const isPasswordMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);

      if (!isPasswordMatch) {
        // old password doesn't match
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw new Error('PASSWORD_MISMATCH');
      }

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(changePasswordDto.newPassword, salt);
      const newUser = new User({
        ...user,
        password: hash,
      });
      await this.entityManager.save(newUser);

      return { statusCode: HttpStatus.OK };
    } catch (err: any) {
      // Log unexpected error for debugging
      // eslint-disable-next-line no-console

      const msg = String(err?.message || err || '');
      if (msg === 'USER_NOT_FOUND') {
        // throw http exception so controller responds with correct status
        throw new (require('@nestjs/common').HttpException)('User not found', HttpStatus.CONFLICT);
      }
      if (msg === 'NO_PASSWORD_SET') {
        throw new (require('@nestjs/common').HttpException)(
          'No password set for this account',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (msg === 'PASSWORD_MISMATCH') {
        throw new (require('@nestjs/common').HttpException)(
          'Old password is incorrect',
          HttpStatus.CONFLICT,
        );
      }

      throw new (require('@nestjs/common').HttpException)(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserEmail(tokenData: TokenData, updateEmailDto: UpdateEmailDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: tokenData.id,
      },
    });
    if (!user) {
      return JSON.stringify(HttpStatus.CONFLICT);
    }

    const updatedUser = new User({
      ...user,
      email: updateEmailDto.email,
    });
    await this.entityManager.save(updatedUser);
    return JSON.stringify(HttpStatus.OK);
  }

  async adminAuth(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: signInDto.email,
        role: ROLE_TYPE.ADMIN,
      },
    });

    // если пользователь не найден
    if (!user) {
      return JSON.stringify(HttpStatus.NOT_FOUND);
    }

    const isPasswordMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isPasswordMatch) {
      return JSON.stringify(HttpStatus.CONFLICT);
    }
    const payload: TokenData = { id: user.id };
    const token = await this.jwtService.signAsync(payload);

    return JSON.stringify(token);
  }

  private async createAdminAccount(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: signInDto.email,
      },
    });
    if (user) {
      return JSON.stringify(HttpStatus.CONFLICT);
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(signInDto.password, salt);
    const newUser = new User({
      fullName: '',
      phoneNumber: '',
      role: ROLE_TYPE.ADMIN,
      email: signInDto.email,
      password: hash,
      isEmailConfirmed: true,
      picture: '',
    });
    await this.entityManager.save(newUser);
    return JSON.stringify(HttpStatus.CREATED);
  }
}
