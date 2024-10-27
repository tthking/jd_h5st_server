/**
 * File: h5st.controller.ts
 * Description: h5st算法入口
 * Author: zhx47
 */

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { H5stService } from '../services/h5st.service';
import { H5stReqBody } from './dto/req.dto';
import { H5stRes, ResBaseDto } from './dto/res.dto';

@Controller()
export class H5stController {
  constructor(private readonly h5stService: H5stService) {}

  @Post('/h5st')
  async getH5st(@Body() reqBody: H5stReqBody): Promise<ResBaseDto<H5stRes>> {
    const h5stRes: H5stRes = await this.h5stService.getH5st(reqBody);
    return new ResBaseDto<H5stRes>(h5stRes);
  }

  @Get('/h5st')
  async getH5stFromGet(@Query() reqQuery: H5stReqBody): Promise<ResBaseDto<H5stRes>> {
    const h5stRes: H5stRes = await this.h5stService.getH5st(reqQuery);
    return new ResBaseDto<H5stRes>(h5stRes);
  }
}
