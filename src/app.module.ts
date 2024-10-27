/**
 * File: app.module.ts
 * Description: nestjs 注入
 * Author: zhx47
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClsModule, ClsService } from 'nestjs-cls';
import { AppController } from './controller/app.controller';
import { H5stService } from './services/h5st.service';
import { H5stController } from './controller/h5st.controller';
import { H5stFactory } from './factory/h5st.factory';
import { H5st420 } from './services/h5st/h5st4.2.0';
import { H5st431 } from './services/h5st/h5st4.3.1';
import { H5st433 } from './services/h5st/h5st4.3.3';
import { H5st440 } from './services/h5st/h5st4.4.0';
import { H5st471 } from './services/h5st/h5st4.7.1';
import { H5st472 } from './services/h5st/h5st4.7.2';
import { H5st473 } from './services/h5st/h5st4.7.3';
import { H5st474 } from './services/h5st/h5st4.7.4';
import { H5st481 } from './services/h5st/h5st4.8.1';
import { H5st482 } from './services/h5st/h5st4.8.2';
import { H5st491 } from './services/h5st/h5st4.9.1';
import { Xcx310 } from './services/h5st/xcx3.1.0';
import { Xcx420 } from './services/h5st/xcx4.2.0';
import { Xcx471 } from './services/h5st/xcx4.7.1';
import { Xcx491 } from './services/h5st/xcx4.9.1';
import { TokenFactory } from './factory/token.factory';
import { LocalTokenV3 } from './services/token/localTokenV3';
import { LocalTokenV4 } from './services/token/localTokenV4';
import { CacheModule } from 'nestjs-cache-manager-v6';
import { WinstonModule } from 'nest-winston';
import { CacheConfigService } from './services/cache/cache.service';
import cacheConfig from './services/cache/cache.config';
import { WinstonConfigService } from './services/logger/winston.config';
import { v4 } from 'uuid';
import { Request } from 'express';
import { CustomAlgorithm } from './services/h5st/customAlgorithm';

@Module({
  imports: [
    // 在 中间件 初始化上下文对象
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.header('cf-ray') ?? v4(),
      },
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [cacheConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService,
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
      inject: [ClsService],
    }),
  ],
  controllers: [AppController, H5stController],
  providers: [
    CustomAlgorithm,
    H5stService,
    H5stFactory,
    H5st420,
    H5st431,
    H5st433,
    H5st440,
    H5st471,
    H5st472,
    H5st473,
    H5st474,
    H5st481,
    H5st482,
    H5st491,
    Xcx310,
    Xcx420,
    Xcx471,
    Xcx491,
    TokenFactory,
    LocalTokenV3,
    LocalTokenV4,
  ],
})
export class AppModule {}
