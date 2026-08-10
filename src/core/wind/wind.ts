import {
  circularDifference,
  degToRad,
  oppositeRunwayNumber,
  runwayNumberToHeading,
  round,
} from '../units/conversions';
import type { WindData, WindResult } from '../../models/types';

export class WindValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WindValidationError';
  }
}

export function validateWindInput(data: {
  runwayNumber?: number;
  heading?: number;
  windDir: number;
  windSpeed: number;
  gust?: number;
}): void {
  if (data.windDir < 0 || data.windDir > 360) {
    throw new WindValidationError('La dirección debe estar entre 0 y 360°');
  }
  if (data.windSpeed < 0) {
    throw new WindValidationError('La velocidad no puede ser negativa');
  }
  if (data.runwayNumber !== undefined) {
    if (data.runwayNumber < 1 || data.runwayNumber > 36 || !Number.isInteger(data.runwayNumber)) {
      throw new WindValidationError('Número de pista inválido (01–36)');
    }
  }
  if (data.gust !== undefined) {
    if (data.gust < 0) {
      throw new WindValidationError('La ráfaga no puede ser negativa');
    }
    if (data.gust < data.windSpeed) {
      throw new WindValidationError('La ráfaga no puede ser menor que el viento sostenido');
    }
  }
}

function componentsFrom(heading: number, windDir: number, windSpeed: number) {
  const angle = circularDifference(heading, windDir);
  const thetaRad = degToRad(angle);
  const hwSigned = windSpeed * Math.cos(thetaRad);
  const xwSigned = windSpeed * Math.sin(thetaRad);
  const headwind = hwSigned > 0 ? hwSigned : 0;
  const tailwind = hwSigned < 0 ? -hwSigned : 0;
  const crosswind = Math.abs(xwSigned);
  let crosswindSide: 'left' | 'right' | 'none' = 'none';
  if (xwSigned > 1e-9) crosswindSide = 'right';
  else if (xwSigned < -1e-9) crosswindSide = 'left';
  return { angle, hwSigned, xwSigned, headwind, tailwind, crosswind, crosswindSide };
}

/**
 * Calcula componentes de viento respecto a la pista.
 * HW > 0 frente; HW < 0 cola. XW > 0 derecha; XW < 0 izquierda.
 */
export function calculateWindComponents(input: WindData): WindResult {
  validateWindInput({
    runwayNumber: input.runway.number,
    windDir: input.windDir,
    windSpeed: input.windSpeed,
    gust: input.gust,
  });

  const heading =
    input.runway.heading !== undefined && !Number.isNaN(input.runway.heading)
      ? input.runway.heading
      : runwayNumberToHeading(input.runway.number);

  const sustained = componentsFrom(heading, input.windDir, input.windSpeed);

  let gustHeadwind: number | undefined;
  let gustTailwind: number | undefined;
  let gustCrosswind: number | undefined;
  let gustCrosswindSide: 'left' | 'right' | 'none' | undefined;

  if (input.gust !== undefined) {
    const gust = componentsFrom(heading, input.windDir, input.gust);
    gustHeadwind = gust.headwind;
    gustTailwind = gust.tailwind;
    gustCrosswind = gust.crosswind;
    gustCrosswindSide = gust.crosswindSide;
  }

  const xwForLimit = gustCrosswind ?? sustained.crosswind;
  const exceedsLimit =
    input.aircraftCrosswindLimit !== undefined &&
    xwForLimit > input.aircraftCrosswindLimit;

  return {
    angle: round(sustained.angle, 2),
    headwind: round(sustained.headwind, 2),
    tailwind: round(sustained.tailwind, 2),
    crosswind: round(sustained.crosswind, 2),
    crosswindSide: sustained.crosswindSide,
    hwSigned: round(sustained.hwSigned, 2),
    xwSigned: round(sustained.xwSigned, 2),
    gustHeadwind: gustHeadwind !== undefined ? round(gustHeadwind, 2) : undefined,
    gustTailwind: gustTailwind !== undefined ? round(gustTailwind, 2) : undefined,
    gustCrosswind: gustCrosswind !== undefined ? round(gustCrosswind, 2) : undefined,
    gustCrosswindSide,
    exceedsLimit,
    oppositeRunway: oppositeRunwayNumber(input.runway.number),
  };
}

export function buildWindDataFromRunway(
  runwayNumber: number,
  windDir: number,
  windSpeed: number,
  extras: Partial<Omit<WindData, 'runway' | 'windDir' | 'windSpeed'>> = {},
): WindData {
  return {
    runway: { number: runwayNumber, heading: runwayNumberToHeading(runwayNumber) },
    windDir,
    windSpeed,
    unit: extras.unit ?? 'kt',
    reference: extras.reference ?? 'magnetic',
    gust: extras.gust,
    aircraftCrosswindLimit: extras.aircraftCrosswindLimit,
  };
}
