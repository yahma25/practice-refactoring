'use-strict';

import { Province, sampleProvinceData } from './Province';

describe('province', () => {
  it('shortfall', () => {
    const asia: Province = new Province(sampleProvinceData());
    expect(asia.shortfall).toBe(5);
  });
});
