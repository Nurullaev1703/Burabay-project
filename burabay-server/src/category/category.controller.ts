import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/constants';

@ApiTags('Категории')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
