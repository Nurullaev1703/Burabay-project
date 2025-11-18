import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { Organization } from './entities/organization.entity';
import { UpdateDocsDto } from './dto/update-docs.dto';
import { ROLE_TYPE } from './types/user-types';
import { Booking } from 'src/booking/entities/booking.entity';
import { BookingStatus } from 'src/booking/types/booking.types';
import { Ad } from 'src/ad/entities/ad.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Organization)
    private readonly organizationRep: Repository<Organization>,
    private readonly dataSource: DataSource,
    private readonly entityManager: EntityManager,
  ) {}

  /* Удаление аккаунта пользователя. При наличии, удаление организации и ее объявлений. */
  @CatchErrors()
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

      // Если организация, то удалить ее объявления.
      if (user.role === ROLE_TYPE.BUSINESS) {
        // Проверить на наличие активных броней (где дата еще не прошла И статус не завершен).
        const activeBooking = await manager
          .createQueryBuilder(Booking, 'booking')
          .innerJoin('booking.ad', 'ad')
          .innerJoin('ad.organization', 'organization')
          .where('organization.id = :orgId', { orgId: user.organization.id })
          .andWhere('booking.dateEnd >= :currentDate', { currentDate: new Date() })
          .andWhere('booking.status NOT IN (:...statuses)', { statuses: [BookingStatus.DONE, BookingStatus.CANCELED] })
          .getOne();

        if (activeBooking) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Нельзя удалить аккаунт с активными бронированиями',
          };
        }
        const ads = await manager.find(Ad, {
          where: { organization: { id: user.organization.id } },
          relations: {
            address: true,
            bookingBanDate: true,
            schedule: true,
            breaks: true,
            usersFavorited: true,
          },
        });
        await manager.remove(ads);
        await manager.remove(user.organization);
      }
      // Если турист.
      else if (user.role === ROLE_TYPE.TOURIST) {
        // Проверить на наличие активных броней (где статус не DONE и не CANCELED).
        const activeBooking = await manager
          .createQueryBuilder(Booking, 'booking')
          .where('booking.user.id = :userId', { userId: user.id })
          .andWhere('booking.status NOT IN (:...statuses)', { statuses: [BookingStatus.DONE, BookingStatus.CANCELED] })
          .getOne();

        // Если есть активные брони, то отменить удаление.
        if (activeBooking) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Нельзя удалить аккаунт с активными бронированиями',
          };
        }
        
        // Удалить все бронирования пользователя (архивные: DONE и CANCELED)
        const bookings = await manager.find(Booking, {
          where: { user: { id: user.id } },
        });
        if (bookings.length > 0) {
          await manager.remove(bookings);
        }
        
        // Если активных броней нет, то удалить аккаунт.
        await manager.remove(user);
      }
      return {
        status: HttpStatus.OK,
        message: 'Аккаунт успешно удален',
      };
    });
  }

  /* Метод для удаления Пользователей у которых не задан пароль и которые созданы более 24 часов назад. 
     Метод используется в TasksService. */
  async deleteEmptyPasswordUsers() {
    try {
      // Вычисляем дату 24 часа назад от текущего момента
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const deleteUsers = await this.userRepository
        .createQueryBuilder()
        .delete()
        .where('(password IS NULL OR password = :password)', { password: '' })
        .andWhere('createdAt < :date', { date: twentyFourHoursAgo })
        .execute();

      console.log(`Удалено ${deleteUsers.affected} пользователей без пароля старше 24 часов`);
      return deleteUsers;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async getLangugage(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    Utils.checkEntity(user, 'Пользователь не найден');
    return user.language;
  }

  async changeLangugae(userId: string, language: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    Utils.checkEntity(user, 'Пользователь не найден');
    user.language = language;
    await this.userRepository.save(user);
    return JSON.stringify(HttpStatus.OK);
  }

  /**
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

  /** Обновление полей с путями документов Организации. */
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
