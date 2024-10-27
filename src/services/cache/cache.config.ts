/**
 * File: cache.config.ts
 * Description: 获取redis配置
 * Author: zhx47
 */
import { strictBoolean } from '../../utils/baseUtils';
import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('cache', () => ({
  memory: strictBoolean(process.env.MEMORY_CACHE),
  redis: strictBoolean(process.env.REDIS_CACHE),
  options: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: encodeURIComponent(process.env.REDIS_PASSWORD),
    database: parseInt(process.env.REDIS_DB) || 0,
  },
}));
