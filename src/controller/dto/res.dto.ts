/**
 * File: res.dto.ts
 * Description: 响应自定义格式
 * Author: zhx47
 */

import { H5stSignParamsType, H5stSignResultType } from '../../services/h5st/type';
import { stringify } from 'qs';

/**
 * 定义响应中的 code
 */
export enum ResErrorCodes {
  SUCCESS = 200,
  PARAM_ERROR = -1,
  BUSINESS_ERROR = 400,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * 响应中 code 对应的 message，在中间件中进行自动填充
 */
export const ResErrorMessages: Record<ResErrorCodes, string> = {
  [ResErrorCodes.SUCCESS]: '成功',
  [ResErrorCodes.PARAM_ERROR]: '参数异常',
  [ResErrorCodes.BUSINESS_ERROR]: '业务异常',
  [ResErrorCodes.INTERNAL_SERVER_ERROR]: '程序出现异常了',
};

export class ResBaseDto<T> {
  constructor(body: T) {
    this.body = body;
    this.code = ResErrorCodes.SUCCESS;
    this.message = ResErrorMessages[ResErrorCodes.SUCCESS];
  }

  code: ResErrorCodes = ResErrorCodes.SUCCESS;
  body?: T;
  message?: string;

  static error<T>(code: ResErrorCodes, body?: T, extendMessage?: string): ResBaseDto<T> {
    const dto = new ResBaseDto(body);
    dto.code = code;
    dto.message = extendMessage ? `${ResErrorMessages[code]} - ${extendMessage}` : ResErrorMessages[code];
    return dto;
  }
}

export class H5stRes {
  constructor(h5st: H5stSignParamsType & H5stSignResultType, body: H5stSignParamsType & { h5st: string }) {
    this.h5st = h5st;
    this.body = body;
    this.qs = stringify(body);
  }

  h5st: H5stSignParamsType & H5stSignResultType;

  body: H5stSignParamsType & { h5st: string };

  qs: string;
}
