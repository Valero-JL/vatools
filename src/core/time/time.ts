import {
  distanceToNM,
  formatHMS,
  minutesToFormatted,
  nmToDistance,
  round,
  speedToKt,
  ktToSpeed,
} from '../units/conversions';
import type { TimeData, TimeResult } from '../../models/types';

export class TimeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeValidationError';
  }
}

/**
 * Modos: t = d/v, d = v·t, v = d/t (siempre con GS en kt y distancia en NM internamente).
 */
export function calculateTime(input: TimeData): TimeResult {
  switch (input.mode) {
    case 't': {
      if (input.distance === undefined || input.speed === undefined) {
        throw new TimeValidationError('Introduce distancia y velocidad');
      }
      if (input.speed <= 0) {
        throw new TimeValidationError('Introduce una velocidad mayor que 0');
      }
      if (input.distance < 0) {
        throw new TimeValidationError('La distancia no puede ser negativa');
      }
      const dNM = distanceToNM(input.distance, input.distUnit);
      const vKt = speedToKt(input.speed, input.speedUnit);
      if (vKt === 0) {
        throw new TimeValidationError('No es posible dividir por cero');
      }
      const hours = dNM / vKt;
      const minutes = hours * 60;
      return {
        value: round(minutes, 2),
        formatted: minutesToFormatted(minutes),
        unitLabel: 'min',
      };
    }
    case 'd': {
      if (input.speed === undefined || input.timeMin === undefined) {
        throw new TimeValidationError('Introduce velocidad y tiempo');
      }
      if (input.speed <= 0) {
        throw new TimeValidationError('Introduce una velocidad mayor que 0');
      }
      if (input.timeMin < 0) {
        throw new TimeValidationError('El tiempo no puede ser negativo');
      }
      const vKt = speedToKt(input.speed, input.speedUnit);
      const hours = input.timeMin / 60;
      const dNM = vKt * hours;
      const value = nmToDistance(dNM, input.distUnit);
      return {
        value: round(value, 2),
        formatted: `${round(value, 2)} ${input.distUnit}`,
        unitLabel: input.distUnit,
      };
    }
    case 'v': {
      if (input.distance === undefined || input.timeMin === undefined) {
        throw new TimeValidationError('Introduce distancia y tiempo');
      }
      if (input.timeMin <= 0) {
        throw new TimeValidationError('No es posible dividir por cero');
      }
      if (input.distance < 0) {
        throw new TimeValidationError('La distancia no puede ser negativa');
      }
      const dNM = distanceToNM(input.distance, input.distUnit);
      const hours = input.timeMin / 60;
      const vKt = dNM / hours;
      const value = ktToSpeed(vKt, input.speedUnit);
      return {
        value: round(value, 2),
        formatted: `${round(value, 2)} ${input.speedUnit}`,
        unitLabel: input.speedUnit,
      };
    }
  }
}

export function decimalHoursToDisplay(hours: number): string {
  return formatHMS(hours);
}
