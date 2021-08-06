'use-strict';

import { Province, sampleProvinceData } from './Province';

describe('province', () => {
  let asia: Province;

  beforeEach(() => {
    asia = new Province(sampleProvinceData());
  });

  it('shortfall', () => {
    expect(asia.shortfall).toBe(5);
  });

  it('profit', () => {
    expect(asia.profit).toBe(230);
  });
});
