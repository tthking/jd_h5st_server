/**
 * File: xcx3.1.0.ts
 * Description: 小程序h5st3.1.0 算法
 * Author: zhx47
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseH5st } from './baseH5st';
import { H5stVersion, KVType, LocalTokenVersion } from './type';
import { H5stAlgoConfigCollection, H5stInitConfig } from './h5stAlgoConfig';
import { ClsService } from 'nestjs-cls';
import { Cache, CACHE_MANAGER } from 'nestjs-cache-manager-v6';
import { getRandomIDPro } from '../../utils/baseUtils';
import { TokenFactory } from '../../factory/token.factory';
import { CustomAlgorithm } from './customAlgorithm';

@Injectable()
export class Xcx310 extends BaseH5st {
  protected readonly logger = new Logger(Xcx310.name);
  constructor(
    protected readonly clsService: ClsService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    protected readonly tokenFactory: TokenFactory,
    protected readonly customAlgorithm: CustomAlgorithm,
  ) {
    super(clsService, cacheManager, tokenFactory.getInstance(LocalTokenVersion['03']), customAlgorithm);
  }

  init(h5stInitConfig: H5stInitConfig) {
    super.init(h5stInitConfig, H5stAlgoConfigCollection[H5stVersion['xcx3.1.0']]);

    // 3.1 localTk中的参数是变化量，未写死
    const randomIDPro = getRandomIDPro({ size: 32, dictType: 'max' });
    const prefix = randomIDPro.slice(0, 2);
    const secret1 = randomIDPro.slice(0, 12);
    this.clsService.set('h5stConfig.genLocalTK.cipher.prefix', prefix);
    this.clsService.set('h5stConfig.genLocalTK.cipher.secret1', secret1);
  }

  __genSign(key: string, body: KVType[]): string {
    const paramsStr = super.__genSign(key, body);
    const signedStr = this.algos.HmacSHA256(paramsStr, key).toString(this.algos.enc.Hex);
    this._log(`__genSign, paramsStr:${paramsStr}, signedStr:${signedStr}`);
    return signedStr;
  }

  convertVisitKey(combinedString: string): string {
    const charArray = combinedString.split('');
    const finalArray = [];
    for (; charArray.length > 0; ) finalArray.push(9 - parseInt(charArray.pop()));
    return finalArray.join('');
  }
}
