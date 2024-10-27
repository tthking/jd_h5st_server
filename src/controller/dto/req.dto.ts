/**
 * File: req.dto.ts
 * Description: 请求的自定义格式
 * Author: zhx47
 */

import 'reflect-metadata';
import { IsEnum, IsJSON, IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { H5stSignParamsType, H5stVersion } from '../../services/h5st/type';
import { ContainsChar } from '../../utils/baseUtils';

/**
 * h5st 的业务信息，真正发送给京东的信息，这里只定义三个必传的字段
 */
export class H5stBusinessBody implements H5stSignParamsType {
  @Type(() => String)
  @IsNotEmpty({ message: 'functionId不能为空' })
  functionId: string;

  @Type(() => String)
  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string;

  @Transform(({ value }): string => (value && typeof value !== 'string' ? JSON.stringify(value) : decodeURIComponent(value as string)))
  @IsNotEmpty({ message: 'body不能为空' })
  @IsJSON({ message: 'body需为JSON字符串' })
  body: string;
}

/**
 * h5st 加签接口的报文
 */
export class H5stReqBody {
  @Type(() => String)
  @IsNotEmpty({ message: '版本不能为空' })
  @IsEnum(H5stVersion, { message: '版本号不正确' })
  version: H5stVersion;

  @Type(() => String)
  @ValidateIf((o: H5stReqBody) => o.version && !o.version.startsWith('xcx'))
  @IsNotEmpty({ message: '账号pin不能为空' })
  pin: string;

  @Type(() => String)
  @ValidateIf((o: H5stReqBody) => o.version && !o.version.startsWith('xcx'))
  @IsNotEmpty({ message: '用户ua不能为空' })
  ua: string;

  @ValidateNested()
  @Type(() => H5stBusinessBody)
  @IsNotEmpty({ message: '请确定body传递正确' })
  body: H5stBusinessBody;

  @Type(() => String)
  @Transform(({ value }): string => decodeURIComponent(value as string))
  // @IsNotEmpty({ message: 'h5st不能为空' })
  @ValidateIf((o: H5stReqBody) => !!o.h5st)
  @ContainsChar(';', [7, 8], { message: 'h5st非法' })
  h5st: string;

  @Type(() => String)
  @ValidateIf((o: H5stReqBody) => !o.h5st)
  @IsNotEmpty({ message: 'h5st 和 appId 不能同时为空' })
  appId: string;

  debug: boolean;
}
