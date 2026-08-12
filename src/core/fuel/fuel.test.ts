import { describe, expect, it } from 'vitest';
import { calculateFuel, FUEL_DEFAULTS, FuelValidationError, phaseFuel } from './fuel';

describe('phaseFuel', () => {
  it('prioriza cantidad manual sobre tiempo × flujo', () => {
    expect(phaseFuel(60, 40, 55)).toBe(55);
  });

  it('calcula tiempo × flujo', () => {
    expect(phaseFuel(90, 40)).toBeCloseTo(60, 5);
  });
});

describe('calculateFuel', () => {
  it('suma todos los componentes al Total Trip Fuel', () => {
    const r = calculateFuel({
      unit: 'L',
      tripFlowPerHour: 40,
      taxiTimeMin: 10,
      tripTimeMin: 60,
      contingencyPercent: 5,
      alternateTimeMin: 30,
      additionalFuelCustom: 10,
      discretionaryTimeMin: 15,
    });

    // taxi 10/60*40 = 6.67; trip = 40; cont = 2; alt = 20; final = 20; add = 10; disc = 10
    expect(r.breakdown.taxi).toBeCloseTo(6.67, 1);
    expect(r.breakdown.trip).toBeCloseTo(40, 1);
    expect(r.breakdown.contingency).toBeCloseTo(2, 1);
    expect(r.breakdown.alternate).toBeCloseTo(20, 1);
    expect(r.breakdown.finalReserve).toBeCloseTo(20, 1);
    expect(r.finalReserveMin).toBe(30);
    expect(r.breakdown.additional).toBe(10);
    expect(r.breakdown.discretionary).toBeCloseTo(10, 1);
    expect(r.total).toBeCloseTo(
      r.breakdown.taxi +
        r.breakdown.trip +
        r.breakdown.contingency +
        r.breakdown.alternate +
        r.breakdown.finalReserve +
        r.breakdown.additional +
        r.breakdown.discretionary,
      2,
    );
    expect(r.mdf).toBeCloseTo(r.breakdown.alternate + r.breakdown.finalReserve, 2);
    // MDF es indicador: no altera el total
    expect(r.total).not.toBe(r.mdf);
  });

  it('MDF = Alterno + Reserva final', () => {
    const r = calculateFuel({
      unit: 'L',
      tripFlowPerHour: 40,
      tripTimeMin: 60,
      alternateTimeMin: 45,
    });
    expect(r.breakdown.alternate).toBeCloseTo(30, 1);
    expect(r.breakdown.finalReserve).toBeCloseTo(20, 1);
    expect(r.mdf).toBeCloseTo(50, 1);
  });

  it('usa 5% del trip como contingencia por defecto', () => {
    const r = calculateFuel({
      unit: 'L',
      tripFlowPerHour: 100,
      tripTimeMin: 60,
    });
    expect(r.breakdown.trip).toBe(100);
    expect(r.breakdown.contingency).toBe(5);
  });

  it('prioriza cantidad manual de contingencia sobre % y tiempo', () => {
    const r = calculateFuel({
      unit: 'L',
      tripFlowPerHour: 40,
      tripTimeMin: 60,
      contingencyTimeMin: 30,
      contingencyFuelCustom: 7,
      contingencyPercent: 5,
    });
    expect(r.breakdown.contingency).toBe(7);
  });

  it('prioriza tiempo de contingencia sobre el % del trip', () => {
    const r = calculateFuel({
      unit: 'L',
      tripFlowPerHour: 40,
      tripTimeMin: 60,
      contingencyTimeMin: 30,
    });
    expect(r.breakdown.contingency).toBeCloseTo(20, 1);
  });

  it('reserva final siempre 30 min × flujo', () => {
    const r = calculateFuel({
      unit: 'L',
      tripFlowPerHour: 60,
      tripFuelCustom: 50,
    });
    expect(r.finalReserveMin).toBe(FUEL_DEFAULTS.finalReserveMin);
    expect(r.breakdown.finalReserve).toBe(30);
  });

  it('opcionales vacíos suman 0', () => {
    const r = calculateFuel({
      unit: 'L',
      tripFlowPerHour: 40,
      tripTimeMin: 60,
      taxiTimeMin: 0,
    });
    expect(r.breakdown.additional).toBe(0);
    expect(r.breakdown.discretionary).toBe(0);
  });

  it('rechaza valores negativos', () => {
    expect(() =>
      calculateFuel({
        unit: 'L',
        tripFlowPerHour: 40,
        tripTimeMin: -10,
      }),
    ).toThrow(FuelValidationError);
  });

  it('exige flujo y trip', () => {
    expect(() => calculateFuel({ unit: 'L' })).toThrow(FuelValidationError);
    expect(() => calculateFuel({ unit: 'L', tripFlowPerHour: 40 })).toThrow(FuelValidationError);
  });
});
