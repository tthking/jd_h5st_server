/**
 * File: h5st.service.ts
 * Description: h5st 算法业务层，用于具体算法初始化和生成
 * Author: zhx47
 */

import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { H5stReqBody } from '../controller/dto/req.dto';
import { H5stFactory } from '../factory/h5st.factory';
import { H5stRes } from '../controller/dto/res.dto';

@Injectable()
export class H5stService {
  constructor(
    private readonly cls: ClsService,
    private readonly h5stFactory: H5stFactory,
  ) {}

  async getH5st(reqBody: H5stReqBody): Promise<H5stRes> {
    this.cls.set('h5stContext.userAgent', reqBody.ua);
    this.cls.set('h5stContext.pt_pin', reqBody.pin);
    this.cls.set('h5stContext.subVersion', reqBody.version);

    const instance = this.h5stFactory.getInstance(reqBody.version);

    const h5st = reqBody.h5st;
    if (h5st) {
      const h5stVar = h5st.split(';');

      instance.init({
        appId: h5stVar[2],
        debug: reqBody.debug,
      });
      instance.envDecrypt(h5stVar[7]);
    } else {
      instance.init({
        appId: reqBody.appId,
        debug: reqBody.debug,
      });
    }

    const body = reqBody.body;

    const signResult = await instance.sign(body);
    return new H5stRes(signResult, Object.assign(body, { h5st: signResult.h5st }));
  }
}
