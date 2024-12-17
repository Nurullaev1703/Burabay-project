import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Address } from './entities/address.entity';
import { Organization } from 'src/users/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Address, Organization])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
