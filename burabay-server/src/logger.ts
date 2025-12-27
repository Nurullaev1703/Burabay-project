import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const winstonLoggerOptions: winston.LoggerOptions = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(), // или `winston.format.simple()` для txt-стиля
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/app.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }),
    new winston.transports.Console({
      format: nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }),
    }),
  ],
};
