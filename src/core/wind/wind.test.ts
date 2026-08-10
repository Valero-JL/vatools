import { describe, expect, it } from 'vitest';
import {
  calculateWindComponents,
  buildWindDataFromRunway,
  WindValidationError,
} from './wind';
import { ktToSpeed, oppositeRunwayNumber, speedToKt } from '../units/conversions';

describe('calculateWindComponents', () => {
  it('caso 1: pista 09, viento 090/10 → 10 kt frente, 0 crosswind', () => {
    const r = calculateWindComponents(buildWindDataFromRunway(9, 90, 10));
    expect(r.headwind).toBe(10);
    expect(r.tailwind).toBe(0);
    expect(r.crosswind).toBe(0);
    expect(r.crosswindSide).toBe('none');
  });

  it('caso 2: pista 09, viento 270/10 → 10 kt cola', () => {
    const r = calculateWindComponents(buildWindDataFromRunway(9, 270, 10));
    expect(r.tailwind).toBe(10);
    expect(r.headwind).toBe(0);
    expect(r.crosswind).toBe(0);
  });

  it('caso 3: pista 18, viento 090/20 → 20 kt cruzado izquierda', () => {
    const r = calculateWindComponents(buildWindDataFromRunway(18, 90, 20));
    expect(r.headwind).toBe(0);
    expect(r.tailwind).toBe(0);
    expect(r.crosswind).toBe(20);
    expect(r.crosswindSide).toBe('left');
  });

  it('caso 4: pista 27, viento 360/15 → 15 kt cruzado derecha', () => {
    const r = calculateWindComponents(buildWindDataFromRunway(27, 360, 15));
    expect(r.crosswind).toBe(15);
    expect(r.crosswindSide).toBe('right');
    expect(Math.abs(r.headwind)).toBe(0);
  });

  it('caso 5: con ráfaga 120/10G20 calcula sostenido y ráfaga', () => {
    const r = calculateWindComponents(
      buildWindDataFromRunway(12, 120, 10, { gust: 20 }),
    );
    expect(r.headwind).toBe(10);
    expect(r.gustHeadwind).toBe(20);
    expect(r.crosswind).toBe(0);
    expect(r.gustCrosswind).toBe(0);
  });

  it('caso 6: pista opuesta 09→27 invierte signo de HW', () => {
    const a = calculateWindComponents(buildWindDataFromRunway(9, 90, 10));
    const b = calculateWindComponents(buildWindDataFromRunway(27, 90, 10));
    expect(a.headwind).toBe(10);
    expect(b.tailwind).toBe(10);
    expect(oppositeRunwayNumber(9)).toBe(27);
  });

  it('caso 7: perpendicular 180/15 en RWY09 → 15 kt derecha', () => {
    const r = calculateWindComponents(buildWindDataFromRunway(9, 180, 15));
    expect(r.headwind).toBe(0);
    expect(r.crosswind).toBe(15);
    expect(r.crosswindSide).toBe('right');
  });

  it('caso 8: paralelo 090/15 en RWY09 → 15 frente', () => {
    const r = calculateWindComponents(buildWindDataFromRunway(9, 90, 15));
    expect(r.headwind).toBe(15);
    expect(r.crosswind).toBe(0);
  });

  it('caso 9: velocidad cero → 0/0', () => {
    const r = calculateWindComponents(buildWindDataFromRunway(9, 90, 0));
    expect(r.headwind).toBe(0);
    expect(r.tailwind).toBe(0);
    expect(r.crosswind).toBe(0);
  });

  it('caso 10: dirección inválida 400 → error', () => {
    expect(() => calculateWindComponents(buildWindDataFromRunway(9, 400, 10))).toThrow(
      WindValidationError,
    );
  });

  it('caso 11: decimales 093/12.5', () => {
    const r = calculateWindComponents(buildWindDataFromRunway(9, 93, 12.5));
    expect(r.headwind).toBeCloseTo(12.5 * Math.cos((3 * Math.PI) / 180), 1);
    expect(r.crosswind).toBeCloseTo(12.5 * Math.sin((3 * Math.PI) / 180), 1);
    expect(r.crosswindSide).toBe('right');
  });

  it('caso 12: cambio de unidad 10 kt ↔ 18.52 km/h equivalente', () => {
    const inKt = calculateWindComponents(buildWindDataFromRunway(9, 90, 10));
    const speedKmh = ktToSpeed(10, 'kmh');
    expect(speedKmh).toBeCloseTo(18.52, 5);
    const asKt = speedToKt(speedKmh, 'kmh');
    const inFromKmh = calculateWindComponents(buildWindDataFromRunway(9, 90, asKt));
    expect(inFromKmh.headwind).toBeCloseTo(inKt.headwind, 5);
  });

  it('alerta si crosswind supera límite de aeronave', () => {
    const r = calculateWindComponents(
      buildWindDataFromRunway(18, 90, 20, { aircraftCrosswindLimit: 15 }),
    );
    expect(r.exceedsLimit).toBe(true);
  });
});
