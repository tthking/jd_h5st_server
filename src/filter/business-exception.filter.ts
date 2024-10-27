/**
 * File: business-exception.filter.ts
 * Description: 异常拦截器，拦截 BusinessError 自定义的业务异常
 * Author: zhx47
 */

import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ResBaseDto, ResErrorCodes } from '../controller/dto/res.dto';
import { BusinessError } from '../utils/error';

@Catch(BusinessError)
export class BusinessExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name);

  catch(exception: BusinessError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.error('出现异常', exception.stack);

    const resDto = ResBaseDto.error(ResErrorCodes.BUSINESS_ERROR, null, exception.message);
    response.status(200).json(resDto);
  }
}
