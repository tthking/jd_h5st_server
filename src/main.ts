/**
 * File: main.ts
 * Description: nestjs 程序入口
 * Author: zhx47
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './filter/validation-exception.filter';
import { AppClusterService } from './app_cluster.service';
import { BusinessExceptionFilter } from './filter/business-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 启用自带的格式校验管道，并且自动进行格式转换
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // 添加一个过滤器，调整格式校验失败返回格式
  app.useGlobalFilters(new ValidationExceptionFilter(), new BusinessExceptionFilter());

  // 开启跨域
  app.enableCors();

  await app.listen(3001);
}

// bootstrap();
AppClusterService.clusterize(bootstrap);
