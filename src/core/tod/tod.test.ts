import { describe, expect, it } from 'vitest';
import { calculateTod, rodFromAngle, todThreeToOne, TodValidationError } from './tod';

describe('calculateTod', () => {
  it('FL350→0 con 3:1 = 105 NM', () => {
    expect(todThreeToOne(35000)).toBe(105);
    const r = calculateTod({
      altNow: 35000,
      altTarget: 0,
      method: 'threeToOne',
      altUnit: 'ft',
      speedUnit: 'kt',
    });
    expect(r.distanceNM).toBe(105);
    expect(r.byThreeToOne).toBe(105);
  });

  it('GS 120 kt a 3° → ≈ 600 fpm', () => {
    const rod = rodFromAngle(120, 3);
    expect(rod).toBeCloseTo(600, 0);
  });

  it('ΔAlt 10000 ft, ROD 1000 fpm, GS 300 → 10 min, 50 NM', () => {
    const r = calculateTod({
      altNow: 10000,
      altTarget: 0,
      rod: 1000,
      gs: 300,
      method: 'rate',
      altUnit: 'ft',
      speedUnit: 'kt',
    });
    expect(r.timeMin).toBe(10);
    expect(r.distanceNM).toBe(50);
  });

  it('método ángulo 3° para 10000 ft ≈ 31.4 NM', () => {
    const r = calculateTod({
      altNow: 10000,
      altTarget: 0,
      angleDeg: 3,
      gs: 120,
      method: 'angle',
      altUnit: 'ft',
      speedUnit: 'kt',
    });
    expect(r.distanceNM).toBeCloseTo(31.4, 0);
    expect(r.recommendedRod).toBeCloseTo(600, 0);
  });

  it('error si altitud actual ≤ objetivo', () => {
    expect(() =>
      calculateTod({
        altNow: 1000,
        altTarget: 1000,
        method: 'threeToOne',
        altUnit: 'ft',
        speedUnit: 'kt',
      }),
    ).toThrow(TodValidationError);
  });

  it('error si ángulo fuera de rango', () => {
    expect(() =>
      calculateTod({
        altNow: 10000,
        altTarget: 0,
        angleDeg: 15,
        method: 'angle',
        altUnit: 'ft',
        speedUnit: 'kt',
      }),
    ).toThrow(TodValidationError);
  });
});
