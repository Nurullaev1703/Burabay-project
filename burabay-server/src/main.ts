import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Utils } from './utilities';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Burabay')
    .setDescription('server configuration')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const adminJSModule = await Utils.dynamicImport('adminjs');
  const adminJSTypeORM = await Utils.dynamicImport('@adminjs/typeorm');
  const AdminJS = adminJSModule.default;
  AdminJS.registerAdapter({
    Resource: adminJSTypeORM.Resource,
    Database: adminJSTypeORM.Database, // Change with whatever adapter you want to use
  });

  app.useStaticAssets(join(__dirname, '..', 'images'), { prefix: '/images' });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
