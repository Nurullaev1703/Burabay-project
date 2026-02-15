import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, Req } from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AdFilter } from './types/ad-filter.type';
// import { Throttle } from '@nestjs/throttler';

@ApiTags('Объявления')
@ApiBearerAuth()
@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Post()
  @ApiBody({ schema: { example: AdController.adExample } })
  create(@Body() createAdDto: CreateAdDto, @Request() req: AuthRequest) {
    return this.adService.create(createAdDto, req.user);
  }

  @Get()
  findAll(@Query() filter: AdFilter, @Request() req: AuthRequest) {
    return this.adService.findAll(req.user, filter);
  }

  @Get('by-org/:orgId')
  findAllByOrg(@Param('orgId') orgId: string, @Query() filters: AdFilter) {
    return this.adService.findAllByOrg(orgId, filters);
  }

  @Get('org/:orgId')
  findAllByOrgId(@Param('orgId') orgId: string, @Request() req: AuthRequest) {
    return this.adService.getAdsFromOrg(orgId, req.user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID of the ad' })
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.adService.findOne(id, req.user);
  }

  @Get('check-dates/:adId')
  // @Throttle({ default: { limit: 24, ttl: 1800000 } })
  checkDates(@Param('adId') adId: string) {
    return this.adService.checkDates(adId);
  }

  @Get('has-active-bookings/:adId')
  hasActiveBookings(@Param('adId') adId: string) {
    return this.adService.hasActiveBookings(adId);
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
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto, @Request() req: AuthRequest) {
    return this.adService.update(id, updateAdDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.adService.remove(id, req.user);
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
