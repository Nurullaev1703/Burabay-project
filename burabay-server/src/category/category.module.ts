import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Category, Subcategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
