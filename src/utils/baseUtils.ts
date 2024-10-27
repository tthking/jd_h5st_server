/**
 * File: baseUtils.ts
 * Description: 基础的工具类
 * Author: zhx47
 */

import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 将字符串进行 URL 安全的 Base64 解码
 * @param encodedString
 */
export function decodeBase64URL(encodedString: string): string {
  return (encodedString + '===')
    .slice(0, encodedString.length + 3 - ((encodedString.length + 3) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/');
}

/**
 * 随机生成字符串定义
 */
export class RandomIDProConfig {
  size = 10;
  dictType?: string = 'number';
  customDict?: string;
}

/**
 * 获取随机字符串
 * @param size 字符串长度
 * @param dictType 字符串字典模板，默认纯数字 alphabet：大小写字母 max：数字+大小写字母+_-
 * @param customDict 自定义字符串字典
 */
export function getRandomIDPro({ size, dictType, customDict }: RandomIDProConfig): string {
  let random = '';
  if (!customDict) {
    switch (dictType) {
      case 'alphabet':
        customDict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'max':
        customDict = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
        break;
      default:
        customDict = '0123456789';
    }
  }
  for (; size--; ) random += customDict[(Math.random() * customDict.length) | 0];
  return random;
}

/**
 * 将一个标准的 Base64 编码的字符串转换成 URL 安全的 Base64 编码
 * @param str
 */
export function fromBase64(str: string): string {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * 是否为一个普通的 JavaScript 对象（Plain Object）
 * @param params
 */
export function isPlainObject(params: object): boolean {
  return '[object Object]' === Object.prototype.toString.call(params);
}

/**
 * 判断一个对象是否为空
 * @param params
 */
export function isEmpty(params: object): boolean {
  return isPlainObject(params) && !Object.keys(params).length;
}

/**
 * 判断参数是否包含 ['h5st', '_stk', '_ste']
 * @param params
 */
export function containsReservedParamName(params: object): boolean {
  const reservedParams = ['h5st', '_stk', '_ste'];
  const paramKeys = Object.keys(params);

  for (const key of paramKeys) {
    if (reservedParams.includes(key)) {
      return true;
    }
  }

  return false;
}

/**
 * 判断参数是否安全：数值型且不为空、字符串、布尔型
 * @param obj
 */
export function isSafeParamValue(obj: any) {
  const type = typeof obj;
  return (type === 'number' && !isNaN(obj as number)) || type === 'string' || type === 'boolean';
}

/**
 * 格式化日期
 * @param timestamp 时间戳
 * @param pattern 日志模板
 */
export function formatDate(timestamp: number = Date.now(), pattern = 'yyyy-MM-dd'): string {
  const date = new Date(timestamp);
  const map: Record<string, number> = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'D+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'w+': date.getDay(), // 星期
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S+': date.getMilliseconds(), // 毫秒
  };

  // 年份处理
  if (/(y+)/i.test(pattern)) {
    pattern = pattern.replace(/(y+)/i, (match) => {
      return (date.getFullYear() + '').slice(4 - match.length);
    });
  }

  // 其他部分处理
  for (const key in map) {
    if (new RegExp(`(${key})`).test(pattern)) {
      pattern = pattern.replace(new RegExp(`(${key})`), (match) => {
        const value = map[key];
        return match.length === 1 ? value.toString() : ('000' + value).slice(-match.length);
      });
    }
  }

  return pattern;
}

/**
 * 从源数组中随机选择指定数量的元素。
 * @param {string} sourceArray 源数组。
 * @param {number} requiredCount 需要选择的元素数量。
 * @returns {string} 返回一个包含随机选中元素的字符串。
 */
export function selectRandomElements(sourceArray: string, requiredCount: number): string {
  requiredCount = Math.min(requiredCount, sourceArray.length);

  let remainingElements = sourceArray.length;
  const selectedElements: string[] = [],
    iterator = sourceArray.split('');
  for (const element of iterator) {
    if (Math.random() * remainingElements < requiredCount) {
      selectedElements.push(element);
      if (--requiredCount === 0) {
        break;
      }
    }
    remainingElements--;
  }
  let result = '';
  for (let index = 0; index < selectedElements.length; index++) {
    const P: number = (Math.random() * (selectedElements.length - index)) | 0;
    result += selectedElements[P];
    selectedElements[P] = selectedElements[selectedElements.length - index - 1];
  }
  return result;
}

/**
 * 生成一个0到9之间的随机整数。
 * @returns {number} 返回一个随机整数。
 */
export function getRandomInt10(): number {
  return (10 * Math.random()) | 0;
}

/**
 * 从字符串中过滤掉指定的字符。
 * @param {string} originalStr 原始字符串。
 * @param {string} charactersToRemove 需要移除的字符数组。
 * @returns {string} 返回过滤后的字符串。
 */
export function filterCharactersFromString(originalStr: string, charactersToRemove: string): string {
  for (const characters of charactersToRemove) {
    if (originalStr.includes(characters)) {
      originalStr = originalStr.replace(characters, '');
    }
  }
  return originalStr;
}

@ValidatorConstraint({ async: false })
export class ContainsCharConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const [char, num] = args.constraints as [string, number[]];
    const count = text.split(char).length - 1;
    return num.includes(count);
  }

  defaultMessage(args: ValidationArguments) {
    const [char] = args.constraints as [string];
    return `Text must contain exactly 7 occurrences of '${char}'`;
  }
}

export function ContainsChar(char: string, num: number[], validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [char, num],
      validator: ContainsCharConstraint,
    });
  };
}

export function strictBoolean(str: string): boolean {
  return str === 'true';
}

/**
 * Uint8Array 转换为一个十六进制字符串表示
 * @param {Uint8Array} byteArray 需要转换的数据
 * @return {string} 转换后的十六进制字符串
 */
export function toHexString(byteArray: Uint8Array): string {
  return Array.from(byteArray)
    .map((byte) => {
      const hex = '00' + (255 & byte).toString(16);
      return hex.slice(-2);
    })
    .join('');
}

/**
 * 将一个字符串转换为十六进制字符串
 * @param {string} str 需要转换的数据
 * @return {string} 转换后的十六进制字符串
 */
export function stringToHex(str: string): string {
  const byteArray = new Uint8Array(str.length);
  byteArray.forEach((_, index) => {
    byteArray[index] = str.charCodeAt(index);
  });
  return toHexString(byteArray);
}

/**
 * 整数转换为一个 Uint8Array
 * @param {number} num 需要转换的数据
 * @return {Uint8Array} 转换后的Uint8Array
 */
export function toUint8ArrayFromNumber(num: number): Uint8Array {
  const isLittleEndian = (function () {
    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return 256 === new Int16Array(buffer)[0];
  })();
  const high = Math.floor(num / Math.pow(2, 32));
  const low = num % Math.pow(2, 32);
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);
  if (isLittleEndian) {
    dataView.setUint32(0, low, isLittleEndian);
    dataView.setUint32(4, high, isLittleEndian);
  } else {
    dataView.setUint32(0, high, isLittleEndian);
    dataView.setUint32(4, low, isLittleEndian);
  }
  return new Uint8Array(buffer);
}
