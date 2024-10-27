/**
 * File: h5st.factory.ts
 * Description: h5st 算法工厂
 * Author: zhx47
 */

import { Inject, Injectable } from '@nestjs/common';
import { BaseH5st } from '../services/h5st/baseH5st';
import { H5st420 } from '../services/h5st/h5st4.2.0';
import { H5st431 } from '../services/h5st/h5st4.3.1';
import { H5st433 } from '../services/h5st/h5st4.3.3';
import { H5st440 } from '../services/h5st/h5st4.4.0';
import { H5st471 } from '../services/h5st/h5st4.7.1';
import { H5st472 } from '../services/h5st/h5st4.7.2';
import { H5st473 } from '../services/h5st/h5st4.7.3';
import { H5st474 } from '../services/h5st/h5st4.7.4';
import { H5st481 } from '../services/h5st/h5st4.8.1';
import { H5st482 } from '../services/h5st/h5st4.8.2';
import { H5st491 } from '../services/h5st/h5st4.9.1';
import { Xcx310 } from '../services/h5st/xcx3.1.0';
import { Xcx420 } from '../services/h5st/xcx4.2.0';
import { Xcx471 } from '../services/h5st/xcx4.7.1';
import { Xcx491 } from '../services/h5st/xcx4.9.1';
import { H5stVersion } from '../services/h5st/type';

@Injectable()
export class H5stFactory {
  private instances = new Map<H5stVersion, BaseH5st>();

  constructor(
    @Inject(H5st420) private readonly h5st420: H5st420,
    @Inject(H5st431) private readonly h5st431: H5st431,
    @Inject(H5st433) private readonly h5st433: H5st433,
    @Inject(H5st440) private readonly h5st440: H5st440,
    @Inject(H5st471) private readonly h5st471: H5st471,
    @Inject(H5st472) private readonly h5st472: H5st472,
    @Inject(H5st473) private readonly h5st473: H5st473,
    @Inject(H5st474) private readonly h5st474: H5st474,
    @Inject(H5st481) private readonly h5st481: H5st481,
    @Inject(H5st482) private readonly h5st482: H5st482,
    @Inject(H5st491) private readonly h5st491: H5st491,
    @Inject(Xcx310) private readonly xcx310: Xcx310,
    @Inject(Xcx420) private readonly xcx420: Xcx420,
    @Inject(Xcx471) private readonly xcx471: Xcx471,
    @Inject(Xcx491) private readonly xcx491: Xcx491,
  ) {
    this.instances.set(H5stVersion['4.2.0'], this.h5st420);
    this.instances.set(H5stVersion['4.3.1'], this.h5st431);
    this.instances.set(H5stVersion['4.3.3'], this.h5st433);
    this.instances.set(H5stVersion['4.4.0'], this.h5st440);
    this.instances.set(H5stVersion['4.7.1'], this.h5st471);
    this.instances.set(H5stVersion['4.7.2'], this.h5st472);
    this.instances.set(H5stVersion['4.7.3'], this.h5st473);
    this.instances.set(H5stVersion['4.7.4'], this.h5st474);
    this.instances.set(H5stVersion['4.8.1'], this.h5st481);
    this.instances.set(H5stVersion['4.8.2'], this.h5st482);
    this.instances.set(H5stVersion['4.9.1'], this.h5st491);
    this.instances.set(H5stVersion['xcx3.1.0'], this.xcx310);
    this.instances.set(H5stVersion['xcx4.2.0'], this.xcx420);
    this.instances.set(H5stVersion['xcx4.7.1'], this.xcx471);
    this.instances.set(H5stVersion['xcx4.9.1'], this.xcx491);
  }

  getInstance(key: H5stVersion): BaseH5st | undefined {
    return this.instances.get(key);
  }
}
