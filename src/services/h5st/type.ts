/**
 * File: type.ts
 * Description: h5st 加签算法通用类型
 * Author: zhx47
 */

/**
 * h5st 加签结果枚举
 */
export enum ErrCodes {
  // 参数错误
  UNSIGNABLE_PARAMS = 1,
  // 缺少验签ID
  APPID_ABSENT = 2,
}

export interface H5stAlgoContextType {
  /* 以下是每个线程的私有定义 */
  _debug: boolean;
  _isNormal: boolean;
  __genKey: (token: string, fingerprint: string, dateStrExtend: string, appId: string, algo: typeof CryptoJS) => string;
  _storageTokenKey: string;
  _storageAlgoKey: string;
  _storageFpKey: string;
  _defaultAlgorithm: defaultAlgorithmType;
  _version: string;
  _appId: string;
  _fingerprint: string;
  _token: string;
  _defaultToken: string;
  envExtend?: EnvCollectType;
  userAgent: string;
  pt_pin: string;
  subVersion: string;
}

export interface defaultAlgorithmType {
  local_key_1: typeof CryptoJS.MD5;
  local_key_2: typeof CryptoJS.SHA256;
  local_key_3: typeof CryptoJS.HmacSHA256;
}

/**
 * h5st 算法参数类型
 */
export interface H5stAlgoConfigType {
  genSignDefault?: boolean;
  version: string;
  env: {
    secret?: string;
    bu1?: string;
    fv?: string;
    randomLength: number;
  };
  visitKey: {
    seed: string;
    selectLength: number;
    randomLength: number;
    convertLength: number;
  };
  defaultKey: {
    extend: string;
  };
  makeSign: {
    extendDateStr: string;
  };
  genLocalTK: {
    baseInfo: TokenType;
    cipher: {
      secret1: string;
      prefix: string;
      secret2?: string;
    };
  };
  customAlgorithm?: {
    salt?: string;
    map?: string;
    keyReverse?: boolean;
    convertIndex?: {
      hmac?: number;
      hex?: number;
    };
  };
}

/**
 * h5st token 类型
 */
export interface TokenType {
  magic: string;
  version: string;
  platform: string;
  expires: string;
  producer: string;
  expr: string;
  cipher: string;
  adler32: string;
}

/**
 * h5st env 类型
 */
export interface EnvCollectType {
  pp?: EnvPpType;
  extend?: EnvExtendType;
  random: string;
  sua?: string;
  v?: string;
  fp?: string;
  wc?: string | number;
  wd?: string | number;
  l?: string | number;
  ls?: string | number;
  ml?: string | number;
  pl?: string | number;
  av?: string | number;
  ua?: string | number;
  w?: string | number;
  h?: string | number;
  ow?: string | number;
  oh?: string | number;
  url?: string | number;
  og?: string | number;
  pf?: string | number;
  bu2?: string | number;
  canvas?: string;
  canvas1?: string;
  webglFp?: string;
  webglFp1?: string;
  ccn?: string | number;
  ai?: string | number;
  pr?: string | number;
  re?: string | number;
  referer?: string | number;
  pp1?: string | number;
}

export interface EnvPpType {
  p1?: string;
  p2?: string;
}

/**
 * h5st env extend 类型
 */
export interface EnvExtendType {
  bu1?: string | number;
  bu2?: string | number;
  bu3?: string | number;
  bu4?: string | number;
  bu5?: string | number;
  bu6?: string | number;
  bu7?: string | number;
  bu8?: string | number;
  l?: string | number;
  ls?: string | number;
  wd?: string | number;
  wk?: string | number;
  pm?: string | number;
}

/**
 * 目前支持的算法版本枚举
 */
export enum H5stVersion {
  '4.2.0' = '4.2.0',
  '4.3.1' = '4.3.1',
  '4.3.3' = '4.3.3',
  '4.4.0' = '4.4.0',
  '4.7.1' = '4.7.1',
  '4.7.2' = '4.7.2',
  '4.7.3' = '4.7.3',
  '4.7.4' = '4.7.4',
  '4.8.1' = '4.8.1',
  '4.8.2' = '4.8.2',
  '4.9.1' = '4.9.1',
  'xcx3.1.0' = 'xcx3.1.0',
  'xcx4.2.0' = 'xcx4.2.0',
  'xcx4.7.1' = 'xcx4.7.1',
  'xcx4.9.1' = 'xcx4.9.1',
}

export enum LocalTokenVersion {
  '03' = '03',
  '04' = '04',
}

/**
 * h5st 参与加签的业务参数
 */
export interface H5stSignParamsType {
  functionId: string;
  appid: string;
  client?: string;
  body: string;
  clientVersion?: string;
  sign?: string;
  t?: string;
  jsonp?: string;
}

/**
 * 一个 K-V 的类型
 */
export interface KVType {
  key: string;
  value?: string;
}

export interface H5stSignResultType {
  _stk?: string;
  _ste?: number;
  h5st?: string;
}

export interface LocalTokenType {
  genLocalTK: (fp: string) => string;
}
