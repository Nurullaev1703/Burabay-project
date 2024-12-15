import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';

@Controller('subcategory')
@ApiTags('Подкатегории')
@ApiBearerAuth()
@Public()
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('ads') ads: string = 'false') {
    const withAds = ads === 'true';
    return this.subcategoryService.findOne(id, withAds);
  }

  // XXX Нужна ли апишка для получения всех подкатегорий у определенной организации?
}
