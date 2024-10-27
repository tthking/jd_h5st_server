/**
 * File: token.factory.ts
 * Description: localToken 算法工厂
 * Author: zhx47
 */

import { Inject, Injectable } from '@nestjs/common';
import { LocalTokenVersion } from '../services/h5st/type';
import { BaseLocalToken } from '../services/token/baseLocalToken';
import { LocalTokenV3 } from '../services/token/localTokenV3';
import { LocalTokenV4 } from '../services/token/localTokenV4';

@Injectable()
export class TokenFactory {
  private instances = new Map<LocalTokenVersion, BaseLocalToken>();

  constructor(
    @Inject(LocalTokenV3) private readonly localTokenV3: LocalTokenV3,
    @Inject(LocalTokenV4) private readonly localTokenV4: LocalTokenV4,
  ) {
    this.instances.set(LocalTokenVersion['03'], this.localTokenV3);
    this.instances.set(LocalTokenVersion['04'], this.localTokenV4);
  }

  getInstance(key: LocalTokenVersion): BaseLocalToken | undefined {
    return this.instances.get(key);
  }
}
