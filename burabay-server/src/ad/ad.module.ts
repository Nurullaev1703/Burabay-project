import { Module } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Organization } from 'src/users/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Subcategory, Organization])],
  controllers: [AdController],
  providers: [AdService],
})
export class AdModule {}
