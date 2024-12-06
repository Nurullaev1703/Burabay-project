import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRep: Repository<User>,
  ) {}

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

  async update(employeeId: string, updateEmployeeDto: any) {
    await this.userRep.update(employeeId, updateEmployeeDto);
    return JSON.stringify('Данные сотрудника обновлены');
  }

  async remove(employeeId: string) {
    await this.userRep.delete(employeeId);

    return JSON.stringify('Сотрудник удален');
  }
}
