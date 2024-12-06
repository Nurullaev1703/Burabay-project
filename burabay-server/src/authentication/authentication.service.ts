import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  // регистрация нового пользователя
  private async _register(signInDto: SignInDto) {
    let user: User;
    if(signInDto.role == ROLE_TYPE.BUSINESS){
      const organization = new Organization({
        name: '',
        imgUrl: '',
        address: "",
        rating: 0,
        reviewCount: 0,
      });
      await this.entityManager.save(organization);
  
      user = new User({
        fullName: '',
        phoneNumber: "",
        role: signInDto.role,
        email: signInDto.email,
        password: "",
        organization: organization
      });
      await this.entityManager.save(user);
    }
    else{
      user = new User({
        fullName: '',
        phoneNumber: '',
        role: signInDto.role,
        email: signInDto.email,
        password: ''
      });
      await this.entityManager.save(user);
    }
  }
  // логин пользователя по email и роли в проекте
  async login(signInDto: SignInDto) {
    try{
      const userExist = await this.userRepository.findOne({
        where: {
          email: signInDto.email,
          role: signInDto.role,
        }
      });
  
      // если пользователь найден, значит уже зарегистрирован и авторизуем его
      if (userExist) {
        return JSON.stringify(HttpStatus.OK)
      }
      await this._register(signInDto);
      return JSON.stringify(HttpStatus.OK);
    }
    catch{
      return JSON.stringify(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkUser(loginDto: LoginDto){
    const user = await this.userRepository.findOne({
      where:{
        email: loginDto.email,
        role: loginDto.role
      }
    })

    if(user.password.length){
        const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
        
        if(!isPasswordMatch){
          throw JSON.stringify(HttpStatus.CONFLICT);
        }
        const payload:TokenData = { id: user.id}
        const token = await this.jwtService.signAsync(payload);

        return JSON.stringify(token)
    }
    
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(loginDto.password, salt);

    const updatedUser = new User({...user, password: hash })
    await  this.userRepository.save(updatedUser)

    const payload: TokenData = { id: updatedUser.id };
    const token = await this.jwtService.signAsync(payload);

    return JSON.stringify(token);
  }
}
