import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Utils } from 'src/utilities';
import { CreateUserDTO } from './dto/test-create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRep: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    try {
      const newUser = this.userRep.create({
        fullName: createUserDto.full_name,
        phoneNumber: createUserDto.phone_number,
        role: createUserDto.role,
        email: createUserDto.email,
        password: createUserDto.password,
      });

      return await this.userRep.save(newUser);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findAll(tokenData: TokenData, filialId: string) {
    const user = await this.userRep.findOne({
      where: {
        id: tokenData.id,
      },
    });
    return JSON.stringify('');
  }

  async findOne(employeeId: string) {
    const employee = await this.userRep.findOne({
      where: {
        id: employeeId,
      },
    });

    return JSON.stringify(employee);
  }

  async update(employeeId: string, updateEmployeeDto: any) {
    await this.userRep.update(employeeId, updateEmployeeDto);
    return JSON.stringify('Данные сотрудника обновлены');
  }

  async remove(employeeId: string) {
    await this.userRep.delete(employeeId);

    return JSON.stringify('Сотрудник удален');
  }
}
