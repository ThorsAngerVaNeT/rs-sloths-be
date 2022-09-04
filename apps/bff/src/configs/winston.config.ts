import { WinstonModuleOptions, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const LOG_LEVEL_ARRAY = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

export const winstonOptions: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
      level: LOG_LEVEL_ARRAY[Number(process.env.LOG_LEVEL) || 0],
    }),
    new winston.transports.File({
      format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
      filename: 'logs/logs.log',
      level: LOG_LEVEL_ARRAY[Number(process.env.LOG_LEVEL) || 0],
    }),
    new winston.transports.File({
      format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
      filename: 'logs/error.log',
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
};
