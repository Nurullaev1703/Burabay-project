import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdModule } from './ad/ad.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { EmailModule } from './authentication/email.module';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './database/database.module';
import { ImagesModule } from './images/images.module';
import { MainPageModule } from './main-page/main-page.module';
import { ProfileModule } from './profile/profile.module';
import { SeederModule } from './seeder/seeder.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/user.module';
import { ScheduleModule } from './schedule/schedule.module';
import { BreaksModule } from './breaks/breaks.module';
import { AddressModule } from './address/address.module';
import { BookingBanDateModule } from './booking-ban-date/booking-ban-date.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    MainPageModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 20,
      },
    ]),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    ProfileModule,
    EmailModule,
    ImagesModule,
    AdModule,
    CategoryModule,
    SubcategoryModule,
    TasksModule,
    SeederModule,
    ScheduleModule,
    BreaksModule,
    AddressModule,
    BookingBanDateModule,
    FeedbackModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
