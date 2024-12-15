import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdModule } from './ad/ad.module';
import { AdminPanelModule } from './admin-panel/admin-panel.module';
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
    AdminPanelModule,
    SeederModule,
    ScheduleModule,
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
