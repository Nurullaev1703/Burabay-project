import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Utils } from 'src/utilities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ad]),
    Utils.dynamicImport('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [],
          },
          auth: {
            authenticate: async (email: string, password: string) => {
              const adminEmail = configService.get<string>('ADMIN_EMAIL');
              const adminPassword = configService.get<string>('ADMIN_PASSWORD');

              if (email === adminEmail && password === adminPassword) {
                return Promise.resolve({ email: adminEmail });
              }
              return null;
            },
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
export class AdminPanelModule implements OnModuleInit {
  async onModuleInit() {
    const adminJSModule = await Utils.dynamicImport('adminjs');
    const adminJSTypeORM = await Utils.dynamicImport('@adminjs/typeorm');
    const AdminJS = adminJSModule.default;
    AdminJS.registerAdapter({
      Resource: adminJSTypeORM.Resource,
      Database: adminJSTypeORM.Database,
    });
  }
}
