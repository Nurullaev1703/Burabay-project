import { Controller, Get, Param, Patch, Query, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

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
  async updateFavoriteCategory(
    @Param('categoryId') categoryId: string,
    @Request() auth: AuthRequest,
  ) {
    return await this.categoryService.addOrDeleteFavoritedCategory(auth.user.id, categoryId);
  }

  @Get('/favorite/list')
  async getFavoriteCategories(@Request() auth: AuthRequest) {
    return await this.categoryService.getFavoritedCategories(auth.user.id);
  }

  @Get('/favorite/ads')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы с объявлениями. На 1 странице по 10 объявлений',
  })
  async getAdsFromFavoriteCateogries(@Request() auth: AuthRequest, @Query('page') page: number) {
    return await this.categoryService.getAdsFromFavoritedCategories(auth.user.id, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
