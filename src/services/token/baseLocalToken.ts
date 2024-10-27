/**
 * File: baseLocalToken.ts
 * Description: LocalToken 通用父类
 * Author: zhx47
 */

import { fromBase64, getRandomIDPro, stringToHex, toHexString, toUint8ArrayFromNumber } from '../../utils/baseUtils';
import { LocalTokenType, TokenType } from '../h5st/type';
import { ClsService } from 'nestjs-cls';
import { CustomAlgorithm } from '../h5st/customAlgorithm';

export class BaseLocalToken implements LocalTokenType {
  constructor(
    protected readonly clsService: ClsService,
    protected readonly algos: CustomAlgorithm,
  ) {}

  /**
   * 本地生成 token
   */
  genLocalTK(fp: string): string {
    const h5stConfig = this.clsService.get('h5stConfig.genLocalTK.baseInfo');
    const tokenData = {
      ...h5stConfig,
    };

    tokenData.expr = this.generateTokenExpr();
    tokenData.cipher = this.generateTokenCipher(fp);
    tokenData.adler32 = this.generateTokenAdler32(tokenData);
    return this.formatToken(tokenData);
  }

  /**
   * 生成 token expr
   */
  generateTokenExpr() {
    const randomChars = () => getRandomIDPro({ size: 32, dictType: 'max' });
    const numbers = ['1', '2', '3'];
    const operators = ['+', 'x'];
    const length = 2 + Math.floor(4 * Math.random());
    let expression = '';

    for (let i = 0; i < length; i++) {
      expression += numbers[Math.floor(Math.random() * 3)];
      if (i < length - 1) {
        expression += operators[Math.floor(Math.random() * 2)];
      }
    }

    if (expression.length < 9) {
      expression += randomChars().slice(0, 9 - expression.length);
    }

    const utf8Encoded = this.algos.enc.Utf8.parse(expression);
    return fromBase64(this.algos.enc.Base64.stringify(utf8Encoded));
  }

  /**
   * 生成 token cipher
   */
  generateTokenCipher(fp: string): string {
    const secret1 = this.clsService.get('h5stConfig.genLocalTK.cipher.secret1'),
      prefix = this.clsService.get('h5stConfig.genLocalTK.cipher.prefix');

    let tokenCipherPlain = '';
    const now = Date.now(),
      v = this.generateChecksumFromParameters(fp, now, prefix, secret1);
    tokenCipherPlain += stringToHex(v);
    tokenCipherPlain += stringToHex(prefix);
    tokenCipherPlain += stringToHex(secret1);
    tokenCipherPlain += toHexString(toUint8ArrayFromNumber(now));
    tokenCipherPlain += stringToHex(fp);

    return this.tokenCipherEncrypt(tokenCipherPlain);
  }

  /**
   * 生成 token adler32
   */
  generateTokenAdler32(_: TokenType): string {
    throw new Error('请实现');
  }

  /**
   * 组装 token
   */
  formatToken(tokenData: TokenType): string {
    return tokenData.magic + tokenData.version + tokenData.platform + tokenData.adler32 + tokenData.expires + tokenData.producer + tokenData.expr + tokenData.cipher;
  }

  /**
   * 通过参数生成校验码
   * @param fp fingerprint 指纹
   * @param now 当前时间戳
   * @param prefix 密文1
   * @param secret1 密文2
   * @returns 校验码
   */
  generateChecksumFromParameters(fp: string, now: number, prefix: string, secret1: string): string {
    const fingerprintBytes = new Uint8Array(16),
      timeBytes = toUint8ArrayFromNumber(now),
      prefixBytes = new Uint8Array(2),
      secret1Bytes = new Uint8Array(12),
      combinedBytes = new Uint8Array(38);

    fingerprintBytes.forEach((_, index) => {
      fingerprintBytes[index] = fp.charCodeAt(index);
    });

    prefixBytes.forEach((_, index) => {
      prefixBytes[index] = prefix.charCodeAt(index);
    });

    secret1Bytes.forEach((_, index) => {
      secret1Bytes[index] = secret1.charCodeAt(index);
    });

    combinedBytes.set(prefixBytes);
    combinedBytes.set(secret1Bytes, 2);
    combinedBytes.set(timeBytes, 14);
    combinedBytes.set(fingerprintBytes, 22);

    return this.generateChecksum(combinedBytes);
  }

  /**
   * 加密 Token Cipher
   * @param _ Token Cipher 明文
   * @returns Token Cipher密文
   */
  tokenCipherEncrypt(_: string): string {
    throw new Error('请实现');
  }

  /**
   * 生成校验码
   * @param _ 原始数据
   * @returns 校验码
   */
  generateChecksum(_: Uint8Array): string {
    throw new Error('请实现');
  }
}
