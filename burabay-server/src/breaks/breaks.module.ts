import { Module } from '@nestjs/common';
import { BreaksService } from './breaks.service';
import { BreaksController } from './breaks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Break } from './entities/break.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Break])],
  controllers: [BreaksController],
  providers: [BreaksService],
})
export class BreaksModule {}
