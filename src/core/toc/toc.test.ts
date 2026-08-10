import { describe, expect, it } from 'vitest';
import { calculateToc, TocValidationError } from './toc';

describe('calculateToc', () => {
  it('caso verificado: 2000→8000 ft, 500 fpm, GS 100 → 12 min, 20 NM', () => {
    const r = calculateToc({
      altStart: 2000,
      altTarget: 8000,
      roc: 500,
      gs: 100,
      altUnit: 'ft',
      speedUnit: 'kt',
    });
    expect(r.altToGain).toBe(6000);
    expect(r.timeMin).toBe(12);
    expect(r.distanceNM).toBe(20);
  });

  it('incluye punto TOC desde distancia de origen', () => {
    const r = calculateToc({
      altStart: 2000,
      altTarget: 8000,
      roc: 500,
      gs: 100,
      distanceFromOriginNM: 5,
      altUnit: 'ft',
      speedUnit: 'kt',
    });
    expect(r.tocPointNM).toBe(25);
  });

  it('GS desde TAS y headwind', () => {
    const r = calculateToc({
      altStart: 0,
      altTarget: 3000,
      roc: 500,
      tas: 110,
      windComp: 10,
      altUnit: 'ft',
      speedUnit: 'kt',
    });
    expect(r.gsUsed).toBe(100);
    expect(r.timeMin).toBe(6);
    expect(r.distanceNM).toBe(10);
  });

  it('error si objetivo ≤ inicial', () => {
    expect(() =>
      calculateToc({
        altStart: 5000,
        altTarget: 5000,
        roc: 500,
        gs: 100,
        altUnit: 'ft',
        speedUnit: 'kt',
      }),
    ).toThrow(TocValidationError);
  });

  it('error si ROC ≤ 0', () => {
    expect(() =>
      calculateToc({
        altStart: 0,
        altTarget: 1000,
        roc: 0,
        gs: 100,
        altUnit: 'ft',
        speedUnit: 'kt',
      }),
    ).toThrow(TocValidationError);
  });
});
