import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
