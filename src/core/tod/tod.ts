import { altitudeToFt, degToRad, round, speedToKt } from '../units/conversions';
import type { TodData, TodResult } from '../../models/types';

export class TodValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TodValidationError';
  }
}

const FT_PER_NM_FACTOR = 6076;

/** Distancia 3:1 (NM) = (ΔAlt / 1000) * 3 */
export function todThreeToOne(altToLoseFt: number): number {
  return (altToLoseFt / 1000) * 3;
}

/** ft/NM = 6076 * tan(ángulo°) */
export function ftPerNmFromAngle(angleDeg: number): number {
  return FT_PER_NM_FACTOR * Math.tan(degToRad(angleDeg));
}

/**
 * ROD recomendado (fpm).
 * Aprox. documentada: GS × ángulo × 100/60 (para 3° ≈ GS × 5).
 * Equivalencia trigonométrica alternativa: GS × 101.3 × tan(ángulo°).
 */
export function rodFromAngle(gsKt: number, angleDeg: number): number {
  return gsKt * angleDeg * (100 / 60);
}

export function calculateTod(input: TodData): TodResult {
  const altNow = altitudeToFt(input.altNow, input.altUnit);
  const altTarget = altitudeToFt(input.altTarget, input.altUnit);

  if (altNow <= altTarget) {
    throw new TodValidationError('La altitud actual debe ser mayor que la objetivo');
  }

  const altToLose = altNow - altTarget;
  const decel = input.decelDist ?? 0;
  const config = input.configDist ?? 0;
  const safety = input.safetyMargin ?? 0;
  // windComp > 0 headwind reduce distancia; < 0 tailwind la aumenta
  // Ajuste simple: distancia efectiva GS ajustada vía componente
  const windAdjNM = input.windComp !== undefined && input.gs
    ? 0 // se aplica vía GS efectiva más abajo si hay método rate
    : 0;

  const byThreeToOne = todThreeToOne(altToLose);

  let byAngle: number | undefined;
  let recommendedRod: number | undefined;
  if (input.angleDeg !== undefined) {
    if (input.angleDeg <= 0 || input.angleDeg > 10) {
      throw new TodValidationError('Ángulo fuera de rango razonable (0–10°)');
    }
    const ftPerNm = ftPerNmFromAngle(input.angleDeg);
    byAngle = altToLose / ftPerNm;
    if (input.gs !== undefined && input.gs > 0) {
      const gsKt = speedToKt(input.gs, input.speedUnit);
      recommendedRod = rodFromAngle(gsKt, input.angleDeg);
    }
  }

  let byRate: number | undefined;
  let timeMin: number | undefined;
  if (input.rod !== undefined && input.gs !== undefined) {
    if (input.rod <= 0) {
      throw new TodValidationError('La tasa de descenso debe ser mayor que 0');
    }
    if (input.gs <= 0) {
      throw new TodValidationError('Introduce una velocidad mayor que 0');
    }
    const gsKt = speedToKt(input.gs, input.speedUnit);
    // Ajuste viento: GS efectiva = GS − headwind (+ si windComp negativo = cola)
    const wind = input.windComp ?? 0;
    const gsEff = gsKt - wind;
    if (gsEff <= 0) {
      throw new TodValidationError('La groundspeed efectiva debe ser mayor que 0');
    }
    timeMin = altToLose / input.rod;
    byRate = gsEff * (timeMin / 60);
  }

  let distanceNM: number;
  switch (input.method) {
    case 'threeToOne':
      distanceNM = byThreeToOne;
      break;
    case 'angle':
    case 'custom':
      if (byAngle === undefined) {
        throw new TodValidationError('Indica un ángulo de descenso válido');
      }
      if (input.angleDeg === 0) {
        throw new TodValidationError('Ángulo fuera de rango razonable (0–10°)');
      }
      distanceNM = byAngle;
      break;
    case 'rate':
      if (byRate === undefined) {
        throw new TodValidationError('Indica tasa de descenso y groundspeed');
      }
      distanceNM = byRate;
      break;
    default:
      throw new TodValidationError('Método de TOD no reconocido');
  }

  const extraDist = decel + config + safety + windAdjNM;
  distanceNM += extraDist;

  return {
    altToLose: round(altToLose, 1),
    timeMin: timeMin !== undefined ? round(timeMin, 2) : undefined,
    distanceNM: round(distanceNM, 2),
    byRate: byRate !== undefined ? round(byRate + extraDist, 2) : undefined,
    byAngle: byAngle !== undefined ? round(byAngle + extraDist, 2) : undefined,
    byThreeToOne: round(byThreeToOne + extraDist, 2),
    recommendedRod:
      recommendedRod !== undefined ? round(recommendedRod, 1) : undefined,
    extraDist: round(extraDist, 2),
    method: input.method,
  };
}
