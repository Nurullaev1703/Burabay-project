import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { Organization } from './entities/organization.entity';
import { UpdateDocsDto } from './dto/update-docs.dto';
import { ROLE_TYPE } from './types/user-types';
import { Booking } from 'src/booking/entities/booking.entity';
import { Ad } from 'src/ad/entities/ad.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRep: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRep: Repository<Organization>,
    private readonly dataSource: DataSource,
    private readonly entityManager: EntityManager,
  ) {}

  /* Удаление аккаунта пользователя. При наличии, удаление организации и ее объявлений. */
  async remove(tokenData: TokenData) {
    return this.dataSource.transaction(async (manager) => {
      // Получение данных о пользователе вместе с организацией
      const user = await manager.findOne(User, {
        where: {
          id: tokenData.id,
        },
        relations: {
          organization: { address: true },
        },
      });

      // Если Бизнес, то удалить проверить на наличие броней.
      // Если нет актуальный броней, то удалить объявления, организацию и аккаунт.
      if (user.role === ROLE_TYPE.BUSINESS) {
        const bookings = await manager.find(Booking, {
          where: { ad: { organization: { id: user.organization.id } } },
        });
        if (bookings.length === 0) {
          const ads = await manager.find(Ad, {
            where: { organization: { user: { id: user.id } } },
          });
          await manager.remove(ads);
          return JSON.stringify(HttpStatus.OK);
        }
      }
      // Если Турист, то отменить брони.
      else if (user.role === ROLE_TYPE.TOURIST) {
      }

      // Удалить адрес организации, организацию и пользователя.
      manager.remove(user.organization.address);
      manager.remove(user.organization);
      manager.remove(user);
      return JSON.stringify(HttpStatus.OK);
    });
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
   *  Метод для удаления Организаций у которых не задано имя, а также для удаления Пользователя в Организации.
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

  /* Обновление полей с путями документов Организации. */
  @CatchErrors()
  async updateOrgDocumentsPath(dto: UpdateDocsDto, tokenData: TokenData) {
    const { regCouponPath, ibanDocPath, orgRulePath, iin, phoneNumber } = dto;
    const organization = await this.organizationRep.findOne({
      relations: { user: true },
      where: { user: { id: tokenData.id } },
    });
    Utils.checkEntity(organization, 'Органзиация не найдена');
    if (regCouponPath) organization.regCouponPath = regCouponPath;
    if (ibanDocPath) organization.ibanDocPath = ibanDocPath;
    if (orgRulePath) organization.orgRulePath = orgRulePath;
    if (iin) organization.bin = iin;
    if (phoneNumber) organization.user.phoneNumber = phoneNumber;
    await this.organizationRep.save(organization);
    return JSON.stringify(HttpStatus.OK);
  }
}
