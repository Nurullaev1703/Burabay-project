import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Category } from 'src/category/entities/category.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ad, Category, Subcategory, Organization])],
  providers: [SeederService],
})
export class SeederModule {
  constructor(private readonly seederService: SeederService) {}

  onModuleInit() {
    this.seederService.seed();
  }
}
