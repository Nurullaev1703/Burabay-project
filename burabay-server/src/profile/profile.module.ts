import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Organization } from 'src/users/entities/organization.entity';
import { Address } from 'src/users/entities/address.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Organization, Address])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
