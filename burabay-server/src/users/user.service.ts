import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { POSITION_TYPE } from './types/user-types';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRep: Repository<User>,
  ) {}

  async create(tokenData: TokenData, createEmployeeDto: CreateEmployeeDto) {
    const user = await this.userRep.findOne({
      where: {
        id: tokenData.id,
        position: POSITION_TYPE.LEADER,
      }
    });
    if (!user) {
      throw new HttpException('Сотрудников может добавлять только директор', HttpStatus.CONFLICT);
    }
    // регистрация сотрудника
    const newUser = new User({
      phoneNumber: createEmployeeDto.phoneNumber,
      position: createEmployeeDto.position,
      fullName: createEmployeeDto.fullName,
      email: createEmployeeDto.email,
      iin: null,
      permissions: createEmployeeDto.permissions,
      role: user.role,
    });
    await this.userRep.save(newUser);
    return JSON.stringify('Сотрудник создан');
  }

  async findAll(tokenData: TokenData, filialId: string) {
    const user = await this.userRep.findOne({
        where:{
            id: tokenData.id
        }
    })
    return JSON.stringify("");
  }

  async findOne(employeeId: string) {
    const employee = await this.userRep.findOne({
      where: {
        id: employeeId,
      },
    });

    return JSON.stringify(employee);
  }

  async update(employeeId: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.userRep.update(employeeId, updateEmployeeDto);
    return JSON.stringify('Данные сотрудника обновлены');
  }

  async remove(employeeId: string) {
    await this.userRep.delete(employeeId);

    return JSON.stringify('Сотрудник удален');
  }
}
