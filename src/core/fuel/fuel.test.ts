import { describe, expect, it } from 'vitest';
import { calculateFuel, certaintyLabelForFuel, FuelValidationError } from './fuel';

describe('calculateFuel', () => {
  it('desglose simplificado calcula trip fuel y minimum diversion fuel correctamente', () => {
    const r = calculateFuel({
      operation: 'AG_VFR',
      rules: 'VFR',
      density: 0.72,
      unit: 'L',
      taxiTimeMin: 10,
      taxiFlowPerHour: 30,
      tripTimeMin: 60,
      tripFlowPerHour: 40,
      alternateTimeMin: 30,
      alternateFlowPerHour: 40,
      contingencyPercent: 5,
      finalReserveMin: 45,
      finalReserveFlow: 40,
      additional: 10,
      extra: 5,
      margin: 2,
    });

    expect(r.taxi).toBeCloseTo(5, 1);
    expect(r.trip).toBeCloseTo(40, 1);
    expect(r.breakdown.contingency).toBeCloseTo(2, 1);
    expect(r.alternate).toBeCloseTo(20, 1);
    expect(r.finalReserve).toBeCloseTo(30, 1);
    expect(r.minDiversion).toBeCloseTo(50, 1);
    expect(r.totalRequired).toBeCloseTo(
      5 + 40 + 2 + 20 + 30 + 10 + 5 + 2,
      2,
    );
  });

  it('alerta si FOB < total requerido', () => {
    const r = calculateFuel({
      operation: 'AG_VFR',
      rules: 'VFR',
      density: 0.72,
      unit: 'L',
      tripTimeMin: 60,
      tripFlowPerHour: 40,
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
      tripTimeMin: 60,
      tripFlowPerHour: 100,
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
      }),
    ).toThrow(FuelValidationError);
  });
});
