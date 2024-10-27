/**
 * File: none-cache.service.ts
 * Description: 空缓存模拟
 * Author: zhx47
 */

import { Injectable } from '@nestjs/common';
import { KeyvStoreAdapter } from 'keyv';

@Injectable()
export class NoneCacheProvider implements KeyvStoreAdapter {
  opts: any;

  clear() {
    return null;
  }

  delete(_key: string) {
    return null;
  }

  get(_key: string) {
    return null;
  }

  on(_event: string, _listener: (...arguments_: any[]) => void) {
    return null;
  }

  set(_key: string, _value: any, _ttl?: number) {
    return null;
  }
}
