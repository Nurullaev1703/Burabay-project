import { Controller, Get, Param, Patch, Query, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MainPageFilter } from 'src/main-page/types/main-page-filters.type';

@ApiTags('Категории')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Patch('/favorite/:categoryId')
  async updateFavoriteCategory(@Param('categoryId') categoryId: string, @Request() auth: AuthRequest) {
    return await this.categoryService.addOrDeleteFavoritedCategory(auth.user.id, categoryId);
  }

  @Get('/favorite/list')
  async getFavoriteCategories(@Request() auth: AuthRequest) {
    return await this.categoryService.getFavoritedCategories(auth.user.id);
  }

  @Get('/favorite/ads')
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Смещение для пагинации',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество объявлений на странице',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Поиск по названию объявления',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Минимальная цена',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Максимальная цена',
  })
  @ApiQuery({
    name: 'isHighRating',
    required: false,
    type: Boolean,
    description: 'Фильтр по высокому рейтингу (> 4.5)',
  })
  async getAdsFromFavoriteCateogries(@Request() auth: AuthRequest, @Query() filter?: MainPageFilter) {
    return await this.categoryService.getAdsFromFavoritedCategories(auth.user.id, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
