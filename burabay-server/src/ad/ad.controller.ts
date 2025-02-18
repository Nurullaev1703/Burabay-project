import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  Req,
} from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AdFilter } from './types/ad.filter';

@ApiTags('Объявления')
@ApiBearerAuth()
@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Post()
  @ApiBody({ schema: { example: AdController.adExample } })
  create(@Body() createAdDto: CreateAdDto) {
    return this.adService.create(createAdDto);
  }

  @Get()
  findAll(@Query() filter: AdFilter) {
    return this.adService.findAll(filter);
  }

  @Get('by-org/:orgId')
  findAllByOrg(@Param('orgId') orgId: string, @Query() filters: AdFilter) {
    return this.adService.findAllByOrg(orgId, filters);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID of the ad' })
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.adService.findOne(id, req.user);
  }

  @Get('favorite/list')
  findAllFavorite(@Request() req: AuthRequest) {
    return this.adService.findAllFavorite(req.user);
  }

  @Get('favorite/:id')
  addToFavorite(@Request() req: AuthRequest, @Param('id') adId: string) {
    return this.adService.addToFavorites(req.user, adId);
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
