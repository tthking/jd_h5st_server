import { NoneCacheProvider } from './none-cache.service';
import { Injectable, Logger } from '@nestjs/common';
import { CacheOptions, CacheOptionsFactory } from 'nestjs-cache-manager-v6';
import KeyvRedis from '@keyv/redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  private readonly logger = new Logger(CacheConfigService.name);

  constructor(private configService: ConfigService) {}

  createCacheOptions(): Promise<CacheOptions> | CacheOptions {
    const redisCache = this.configService.get<string>('cache.redis');
    if (redisCache) {
      const host = this.configService.get<string>('cache.options.host');
      if (host) {
        this.logger.debug('使用 Redis 缓存');
        const port = this.configService.get<string>('cache.options.port'),
          password = this.configService.get<string>('cache.options.password'),
          database = this.configService.get<string>('cache.options.database');
        const authInfo = password ? `:${password}@` : '';
        return {
          stores: new KeyvRedis(`redis://${authInfo}${host}:${port}/${database}`),
          namespace: 'jd_server',
        };
      }
    }
    const memoryCache = this.configService.get<string>('cache.memory');
    if (memoryCache) {
      this.logger.debug('使用内存缓存');
      return {};
    }
    this.logger.debug('不使用缓存');
    return {
      stores: new NoneCacheProvider(),
    };
  }
}
