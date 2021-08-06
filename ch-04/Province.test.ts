'use-strict';

import { Province, ProvinceData, sampleProvinceData } from './Province';

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

  it('change production', () => {
    asia.producers[0].production = 20;
    expect(asia.shortfall).toBe(-6);
    expect(asia.profit).toBe(292);
  });

  describe('no producers', () => {
    let noProducers: Province;

    beforeEach(() => {
      noProducers = new Province(new ProvinceData('No producers', [], 30, 20));
    });

    it('shortfall', () => {
      expect(noProducers.shortfall).toBe(30);
    });

    it('profit', () => {
      expect(noProducers.profit).toBe(0);
    });

    it('zero demand', () => {
      asia.demand = 0;
      expect(asia.shortfall).toBe(-25);
      expect(asia.profit).toBe(0);
    });

    it('negative demand', () => {
      asia.demand = -1;
      expect(asia.shortfall).toBe(-26);
      expect(asia.profit).toBe(-10);
    });

    it('empty string demand', () => {
      asia.demand = '';
      expect(asia.shortfall).toBeNaN();
      expect(asia.profit).toBeNaN();
    });

    it('타입 오류 테스트', () => {
      try {
        new Province(
          // 잘못된 타입 값 설정을 위해 any 타입 캐스팅 사용
          new ProvinceData('String producers', '' as any, 30, 20),
        );
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('doc.producers.forEach is not a function');
      }
    });
  });
});
