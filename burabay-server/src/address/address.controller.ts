import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('address')
@ApiBearerAuth()
@ApiTags('Адреса')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto, @Request() req: AuthRequest) {
    return this.addressService.create(createAddressDto, req.user);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto, @Request() req: AuthRequest) {
    return this.addressService.update(id, updateAddressDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.addressService.remove(id, req.user);
  }
}
