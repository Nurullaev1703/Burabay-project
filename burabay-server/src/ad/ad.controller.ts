import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Public } from 'src/constants';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Объявления')
@ApiBearerAuth()
@Public() // TODO Удалить после тестирования.
@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Post()
  @ApiBody({ schema: { example: AdController.adExample } })
  create(@Body() createAdDto: CreateAdDto) {
    return this.adService.create(createAdDto);
  }

  @Get()
  findAll() {
    return this.adService.findAll();
  }

  @Get('by-org/:orgId')
  findAllByOrg(@Param('orgId') orgId: string) {
    return this.adService.findAllByOrg(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return this.adService.update(id, updateAdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adService.remove(id);
  }

  private static adExample = {
    'subcategoryId': 'string',
    'organizationId': 'string',
    'title': 'string',
    'description': 'string',
    'price': 0,
    'images': ['string'],
    'youtubeLink': 'string',
    'address': 'string',
    'details': {
      type: 'rent',
      bicycles: true,
      electricScooters: true,
      campingEquipment: true,
      carRentalWithDriver: true,
    },
    'phoneNumber': '+77077046669',
  };
}
