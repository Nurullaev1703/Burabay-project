import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Organization } from 'src/users/entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}