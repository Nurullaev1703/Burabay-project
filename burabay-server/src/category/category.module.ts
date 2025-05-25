import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Category } from './entities/category.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Category, Subcategory, User, Subcategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
