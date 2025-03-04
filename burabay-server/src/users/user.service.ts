import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { Organization } from './entities/organization.entity';
import { UpdateDocsDto } from './dto/update-docs.dto';

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

  async remove(tokenData: TokenData) {
    const user = await this.userRep.findOne({
      where: {
        id: tokenData.id,
      },
    });
    await this.entityManager.remove(user);

    return JSON.stringify(HttpStatus.OK);
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
