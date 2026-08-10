import { describe, expect, it } from 'vitest';
import { calculateFuel, certaintyLabelForFuel, FuelValidationError } from './fuel';

describe('calculateFuel', () => {
  it('desglose por fase suma el total requerido', () => {
    const r = calculateFuel({
      operation: 'AG_VFR',
      rules: 'VFR',
      density: 0.72,
      unit: 'L',
      phases: [
        { name: 'taxi', timeMin: 10, flowPerHour: 30 },
        { name: 'climb', timeMin: 12, flowPerHour: 60 },
        { name: 'cruise', timeMin: 60, flowPerHour: 40 },
        { name: 'descent', timeMin: 15, flowPerHour: 25 },
        { name: 'approach', timeMin: 10, flowPerHour: 35 },
      ],
      contingencyPercent: 0,
      finalReserveMin: 45,
      finalReserveFlow: 40,
      additional: 0,
      extra: 0,
    });

    const taxi = 5;
    expect(r.breakdown.taxi).toBeCloseTo(taxi, 1);
    expect(r.trip).toBeCloseTo(12 + 40 + 6.25 + 5.83, 1);
    expect(r.breakdown.finalReserve).toBeCloseTo(30, 1);
    expect(r.totalRequired).toBeCloseTo(
      r.breakdown.taxi +
        r.trip +
        r.breakdown.contingency +
        r.breakdown.alternate +
        r.breakdown.finalReserve +
        r.breakdown.additional +
        r.breakdown.extra +
        r.breakdown.margin,
      2,
    );
  });

  it('alerta si FOB < total requerido', () => {
    const r = calculateFuel({
      operation: 'AG_VFR',
      rules: 'VFR',
      density: 0.72,
      unit: 'L',
      phases: [{ name: 'cruise', timeMin: 60, flowPerHour: 40 }],
      contingencyPercent: 0,
      finalReserveMin: 45,
      finalReserveFlow: 40,
      fuelOnBoard: 20,
    });
    expect(r.alert).toBe(true);
    expect(r.deficit).toBeGreaterThan(0);
  });

  it('contingencia 5% para comercial (referencia OACI)', () => {
    const r = calculateFuel({
      operation: 'COMMERCIAL_RAC121',
      rules: 'IFR',
      density: 0.8,
      unit: 'L',
      phases: [{ name: 'cruise', timeMin: 60, flowPerHour: 100 }],
      finalReserveMin: 30,
      finalReserveFlow: 80,
    });
    expect(r.breakdown.contingency).toBe(5);
  });

  it('etiqueta normativa pendiente', () => {
    expect(certaintyLabelForFuel()).toMatch(/pendiente de validación normativa/i);
  });

  it('error si densidad ≤ 0', () => {
    expect(() =>
      calculateFuel({
        operation: 'AG_VFR',
        rules: 'VFR',
        density: 0,
        unit: 'L',
        phases: [],
      }),
    ).toThrow(FuelValidationError);
  });
});
