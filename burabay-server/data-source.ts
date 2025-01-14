import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Ad } from 'src/ad/entities/ad.entity';
import { Address } from 'src/address/entities/address.entity';
import { BookingBanDate } from 'src/booking-ban-date/entities/booking-ban-date.entity';
import { Break } from 'src/breaks/entities/break.entity';
import { Category } from 'src/category/entities/category.entity';
import { Review } from 'src/review/entities/review.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';

// Загружаем переменные окружения
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'my_database',
  entities: [
    Ad,
    Address,
    BookingBanDate,
    Break,
    Category,
    Feedback,
    Organization,
    Review,
    Schedule,
    Subcategory,
    User,
  ],
  migrations: ['dist/migrations/*.js'], // Путь к миграциям
  migrationsTableName: 'migrations', // Таблица для отслеживания миграций
  synchronize: false, // Должно быть отключено в продакшене
  logging: true,
});

module.exports = dataSource;
