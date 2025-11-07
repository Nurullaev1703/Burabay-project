import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { UsersModule } from 'src/users/user.module';
import { AdminPanelModule } from 'src/admin-panel/admin-panel.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization]), UsersModule, AdminPanelModule],
  providers: [TasksService],
})
export class TasksModule {}
