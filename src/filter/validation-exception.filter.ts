/**
 * File: validation-exception.filter.ts
 * Description: 异常拦截器，这里主要是将 nestjs 的 ValidationPipe 异常响应与整个项目进行对齐
 * Author: zhx47
 */

import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ResBaseDto, ResErrorCodes } from '../controller/dto/res.dto';

interface ExceptionResponse {
  message: string | string[]; // 根据实际返回结构调整
  error?: string;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse() as ExceptionResponse;
    this.logger.error('参数校验出现异常', exceptionResponse.message);

    const resDto = ResBaseDto.error(ResErrorCodes.PARAM_ERROR, exceptionResponse.message);
    response.status(200).json(resDto);
  }
}
