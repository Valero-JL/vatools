import { describe, expect, it } from 'vitest';
import { calculateFuel, FuelValidationError, phaseFuel } from './fuel';

describe('phaseFuel', () => {
  it('prioriza cantidad manual sobre tiempo × flujo', () => {
    expect(phaseFuel(60, 40, 55)).toBe(55);
  });

  it('calcula tiempo × flujo', () => {
    expect(phaseFuel(90, 40)).toBeCloseTo(60, 5);
  });
});

describe('calculateFuel', () => {
  it('calcula trip fuel = tiempo × flujo', () => {
    const r = calculateFuel({
      unit: 'L',
      tripTimeMin: 60,
      tripFlowPerHour: 40,
    });
    expect(r.trip).toBeCloseTo(40, 1);
    expect(r.unit).toBe('L');
  });

  it('usa cantidad manual si se indica', () => {
    const r = calculateFuel({
      unit: 'usgal',
      tripTimeMin: 60,
      tripFlowPerHour: 40,
      tripFuelCustom: 25,
    });
    expect(r.trip).toBe(25);
  });

  it('rechaza valores negativos', () => {
    expect(() =>
      calculateFuel({
        unit: 'L',
        tripTimeMin: -10,
        tripFlowPerHour: 40,
      }),
    ).toThrow(FuelValidationError);
  });

  it('exige tiempo+flujo o cantidad manual', () => {
    expect(() => calculateFuel({ unit: 'L' })).toThrow(FuelValidationError);
  });
});
