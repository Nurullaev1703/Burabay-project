import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Utils } from 'src/utilities';

/* Модуль для подключения и настройки AdminJS. */

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    TypeOrmModule.forFeature([Ad]),
    Utils.dynamicImport('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        }),
      }),
    ),
  ],
})
export class AdminPanelModule {}
