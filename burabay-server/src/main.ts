import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { winstonLoggerOptions } from './logger'; // путь к logger.ts
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  // Создаём Winston-логгер отдельно
  const winstonLogger = WinstonModule.createLogger(winstonLoggerOptions);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: winstonLogger,
  });

  // Используем winstonLogger для перенаправления console.*
  console.log = (...args: any[]) => winstonLogger.log('info', args.join(' '));
  console.error = (...args: any[]) => winstonLogger.error(args.join(' '));
  console.warn = (...args: any[]) => winstonLogger.warn(args.join(' '));
  console.info = (...args: any[]) => winstonLogger.log('info', args.join(' '));
  console.debug = (...args: any[]) => winstonLogger.debug(args.join(' '));

  const config = new DocumentBuilder()
    .setTitle('Burabay')
    .setDescription('server configuration')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  // Включение CORS
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://burabay-damu.kz',
        'https://burabay-damu.kz',
        'http://localhost:3000',
        'http://91.215.139.89:5173',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    credentials: true, // Для передачи cookie или авторизационных данных
  });

  // Установка заголовков COOP/COEP
  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
  });

  await app.listen(3000);
}
bootstrap();
