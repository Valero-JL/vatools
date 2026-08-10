import { describe, expect, it } from 'vitest';
import {
  circularDifference,
  ktToSpeed,
  oppositeRunwayNumber,
  runwayNumberToHeading,
  speedToKt,
} from './conversions';

describe('conversions', () => {
  it('1 kt = 1.852 km/h', () => {
    expect(ktToSpeed(10, 'kmh')).toBeCloseTo(18.52, 5);
    expect(speedToKt(18.52, 'kmh')).toBeCloseTo(10, 5);
  });

  it('pista 09 → rumbo 90; opuesta 27', () => {
    expect(runwayNumberToHeading(9)).toBe(90);
    expect(oppositeRunwayNumber(9)).toBe(27);
  });

  it('diferencia circular normaliza a −180…+180', () => {
    expect(circularDifference(350, 10)).toBe(20);
    expect(circularDifference(10, 350)).toBe(-20);
  });
});
