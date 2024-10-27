/**
 * File: global.d.ts
 * Description: 扩展定义模块内的默认类型
 * Author: zhx47
 */

import 'nestjs-cls';
import { H5stAlgoConfigType, H5stAlgoContextType } from '../src/services/h5st/type';

/**
 * 重新定义默认的上下文对象的类型
 */
declare module 'nestjs-cls' {
  interface ClsStore {
    h5stConfig?: H5stAlgoConfigType;
    h5stContext?: H5stAlgoContextType;
  }
}
