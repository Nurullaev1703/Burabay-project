import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

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

  // app.useStaticAssets(join(__dirname, '..', 'public', 'images'), { prefix: '/images' });
  // app.useStaticAssets(join(__dirname, '..', 'public', 'icons'), { prefix: '/icons' });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.engine('hbs', engine);
  app.setViewEngine('hbs');

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
