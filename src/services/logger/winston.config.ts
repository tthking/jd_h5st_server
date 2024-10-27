import { WinstonModuleOptions, WinstonModuleOptionsFactory } from 'nest-winston';
import { ClsService } from 'nestjs-cls';
import * as winston from 'winston';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(protected readonly clsService: ClsService) {}

  createWinstonModuleOptions(): Promise<WinstonModuleOptions> | WinstonModuleOptions {
    return {
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format((info) => {
              info.level = info.level.toUpperCase().padStart(5);
              return info;
            })(),
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.colorize(),
            winston.format.printf((info) => {
              const traceId = this.clsService?.getId() || '',
                pid = String(process.pid).padStart(5);

              let context = String(info?.context || '');
              if (context.length > 20) {
                context = context.slice(-25);
              } else {
                context = context.padEnd(25, ' ');
              }

              if (traceId) {
                return `${info.timestamp} ${info.level} ${pid} -- [${traceId}] - ${context}: ${info.message} ${info?.stack || ''}`;
              } else {
                return `${info.timestamp} ${info.level} ${pid} --- ${context}: ${info.message} ${info?.stack || ''}`;
              }
            }),
          ),
        }),
      ],
    };
  }
}
