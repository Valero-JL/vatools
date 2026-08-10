import type { SpeedUnit, DistanceUnit, AltitudeUnit, VolumeUnit } from '../../models/types';

/** 1 kt = 1.852 km/h = 0.514444 m/s */
export const KT_TO_KMH = 1.852;
export const KT_TO_MS = 0.514444;
export const NM_TO_KM = 1.852;
export const FT_TO_M = 0.3048;
export const USGAL_TO_L = 3.78541;
export const IMPGAL_TO_L = 4.54609;

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Normaliza ángulo a [0, 360). */
export function normalizeHeading(deg: number): number {
  const n = deg % 360;
  return n < 0 ? n + 360 : n;
}

/**
 * Diferencia circular normalizada a [-180, +180].
 * θ = ((WD - RH + 180) mod 360) - 180
 */
export function circularDifference(fromDeg: number, toDeg: number): number {
  return ((toDeg - fromDeg + 180) % 360 + 360) % 360 - 180;
}

export function speedToKt(value: number, unit: SpeedUnit): number {
  switch (unit) {
    case 'kt':
      return value;
    case 'kmh':
      return value / KT_TO_KMH;
    case 'ms':
      return value / KT_TO_MS;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function ktToSpeed(valueKt: number, unit: SpeedUnit): number {
  switch (unit) {
    case 'kt':
      return valueKt;
    case 'kmh':
      return valueKt * KT_TO_KMH;
    case 'ms':
      return valueKt * KT_TO_MS;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function distanceToNM(value: number, unit: DistanceUnit): number {
  return unit === 'NM' ? value : value / NM_TO_KM;
}

export function nmToDistance(valueNM: number, unit: DistanceUnit): number {
  return unit === 'NM' ? valueNM : valueNM * NM_TO_KM;
}

export function altitudeToFt(value: number, unit: AltitudeUnit): number {
  return unit === 'ft' ? value : value / FT_TO_M;
}

export function ftToAltitude(valueFt: number, unit: AltitudeUnit): number {
  return unit === 'ft' ? valueFt : valueFt * FT_TO_M;
}

/** Convierte volumen/masa a litros (si unit=kg, usa densidad kg/L). */
export function toLiters(value: number, unit: VolumeUnit, densityKgPerL: number): number {
  switch (unit) {
    case 'L':
      return value;
    case 'usgal':
      return value * USGAL_TO_L;
    case 'impgal':
      return value * IMPGAL_TO_L;
    case 'kg':
      if (densityKgPerL <= 0) throw new Error('La densidad debe ser mayor que 0');
      return value / densityKgPerL;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function fromLiters(valueL: number, unit: VolumeUnit, densityKgPerL: number): number {
  switch (unit) {
    case 'L':
      return valueL;
    case 'usgal':
      return valueL / USGAL_TO_L;
    case 'impgal':
      return valueL / IMPGAL_TO_L;
    case 'kg':
      if (densityKgPerL <= 0) throw new Error('La densidad debe ser mayor que 0');
      return valueL * densityKgPerL;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

/** Horas decimales → {h, m, s} */
export function decimalHoursToHMS(hours: number): { h: number; m: number; s: number } {
  const totalSec = Math.round(Math.abs(hours) * 3600);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { h, m, s };
}

export function formatHMS(hours: number): string {
  const { h, m, s } = decimalHoursToHMS(hours);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function minutesToFormatted(min: number): string {
  return formatHMS(min / 60);
}

export function runwayNumberToHeading(runwayNumber: number): number {
  return normalizeHeading(runwayNumber * 10);
}

/** Pista opuesta: (n + 18 - 1) mod 36 + 1 */
export function oppositeRunwayNumber(runwayNumber: number): number {
  return ((runwayNumber + 18 - 1) % 36) + 1;
}

export function round(value: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}
