/**
 * File: error.ts
 * Description: 自定义异常
 * Author: zhx47
 */

/**
 * 自定义业务异常
 */
export class BusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessError';
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}
