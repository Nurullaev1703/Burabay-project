import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Utils } from 'src/utilities';
import { CreateUserDTO } from './dto/test-create-user.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRep: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRep: Repository<Organization>,
    private readonly dataSource: DataSource,
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

  /* Метод для удаления Пользователей у которых не задан пароль. Метод испольузется в TasksService. */
  async deleteEmptyPasswordUsers() {
    try {
      const deleteUsers = await this.userRep
        .createQueryBuilder()
        .delete()
        .where('password IS NULL OR password = :password', { password: '' })
        .execute();
      return deleteUsers;
      // return await this.userRep.remove(deleteUser);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /*
   * Метод для удаления Организаций у которых не задано имя, а также для удаления Пользователя в Организации.
   * Метод испольузется в TasksService.
   */
  async deleteOrganizationsAndUsers() {
    await this.dataSource.transaction(async (manager) => {
      // Найти организации с пустым или null именем
      const organizations = await manager
        .createQueryBuilder()
        .select('id')
        .from('organization', 'organization')
        .where('name IS NULL OR name = :name', { name: '' })
        .getRawMany();

      const orgIds = organizations.map((org) => org.id);

      if (orgIds.length > 0) {
        // Удалить пользователей, связанных с найденными организациями
        await manager
          .createQueryBuilder()
          .delete()
          .from('user')
          .where('organization_id IN (:...orgIds)', { orgIds })
          .execute();

        // Удалить сами организации
        return await manager
          .createQueryBuilder()
          .delete()
          .from('organization')
          .where('id IN (:...orgIds)', { orgIds })
          .execute();
      }
    });
  }
}
