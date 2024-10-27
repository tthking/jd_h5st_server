/**
 * File: app.controller.ts
 * Description: 健康检测
 * Author: zhx47
 */

import { Controller, Get } from '@nestjs/common';
import { ResBaseDto } from './dto/res.dto';

@Controller()
export class AppController {
  @Get('/health')
  getHello(): ResBaseDto<string> {
    return new ResBaseDto<string>('OK');
  }
}
