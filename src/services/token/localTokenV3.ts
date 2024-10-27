/**
 * File: localTokenV3.ts
 * Description: localToken v3 算法
 * Author: zhx47
 */

import { ClsService } from 'nestjs-cls';
import { Injectable, Logger } from '@nestjs/common';
import { fromBase64 } from '../../utils/baseUtils';
import { TokenType } from '../h5st/type';
import * as ADLER32 from 'adler-32';
import { BaseLocalToken } from './baseLocalToken';
import { CustomAlgorithm } from '../h5st/customAlgorithm';

@Injectable()
export class LocalTokenV3 extends BaseLocalToken {
  protected readonly logger = new Logger(LocalTokenV3.name);

  constructor(
    protected readonly clsService: ClsService,
    protected readonly algos: CustomAlgorithm,
  ) {
    super(clsService, algos);
  }

  /**
   * 加密 Token Cipher
   * @param tokenCipherPlain Token Cipher 明文
   * @returns Token Cipher密文
   */
  tokenCipherEncrypt(tokenCipherPlain: string): string {
    const secret2 = this.clsService.get('h5stConfig.genLocalTK.cipher.secret2');
    const b = this.algos.AES.encrypt(this.algos.enc.Hex.parse(tokenCipherPlain), this.algos.enc.Utf8.parse(secret2), {
      iv: this.algos.enc.Utf8.parse('0102030405060708'),
    });
    return fromBase64(this.algos.enc.Base64.stringify(b.ciphertext));
  }

  /**
   * 生成 token adler32
   * @param tokenData
   */
  generateTokenAdler32(tokenData: TokenType) {
    const checksum = ADLER32.str(tokenData.magic + tokenData.version + tokenData.platform + tokenData.expires + tokenData.producer + tokenData.expr + tokenData.cipher) >>> 0;
    return ('00000000' + checksum.toString(16)).slice(-8);
  }

  /**
   * 生成校验码
   * @param combinedBytes 原始数据
   * @returns 校验码
   */
  generateChecksum(combinedBytes: Uint8Array): string {
    let checksumValue = ADLER32.buf(combinedBytes);
    checksumValue >>>= 0;
    const checksumHex = '00000000' + checksumValue.toString(16);
    return checksumHex.slice(-8);
  }
}
