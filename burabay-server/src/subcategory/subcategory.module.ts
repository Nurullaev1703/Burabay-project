import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Category } from 'src/category/entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Category, Subcategory])],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
})
export class SubcategoryModule {}
