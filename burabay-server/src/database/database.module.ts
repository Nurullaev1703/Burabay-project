import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Ad } from 'src/ad/entities/ad.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST') || 'postgres',
        port: configService.getOrThrow('POSTGRES_PORT'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: configService.getOrThrow('POSTGRES_DB'),
        autoLoadEntities: true,
        entities: [Ad],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
