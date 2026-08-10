import { describe, expect, it } from 'vitest';
import { calculateTime, decimalHoursToDisplay, TimeValidationError } from './time';

describe('calculateTime', () => {
  it('100 NM / 120 kt = 50 min', () => {
    const r = calculateTime({
      mode: 't',
      distance: 100,
      speed: 120,
      distUnit: 'NM',
      speedUnit: 'kt',
    });
    expect(r.value).toBe(50);
    expect(r.formatted).toBe('00:50:00');
  });

  it('0.8333 h → 00:50:00', () => {
    expect(decimalHoursToDisplay(0.8333)).toBe('00:50:00');
  });

  it('distancia = v · t', () => {
    const r = calculateTime({
      mode: 'd',
      speed: 120,
      timeMin: 50,
      distUnit: 'NM',
      speedUnit: 'kt',
    });
    expect(r.value).toBe(100);
  });

  it('velocidad = d / t', () => {
    const r = calculateTime({
      mode: 'v',
      distance: 100,
      timeMin: 50,
      distUnit: 'NM',
      speedUnit: 'kt',
    });
    expect(r.value).toBe(120);
  });

  it('error división por cero (velocidad 0)', () => {
    expect(() =>
      calculateTime({
        mode: 't',
        distance: 100,
        speed: 0,
        distUnit: 'NM',
        speedUnit: 'kt',
      }),
    ).toThrow(TimeValidationError);
  });

  it('error división por cero (tiempo 0 en modo v)', () => {
    expect(() =>
      calculateTime({
        mode: 'v',
        distance: 100,
        timeMin: 0,
        distUnit: 'NM',
        speedUnit: 'kt',
      }),
    ).toThrow(TimeValidationError);
  });
});
