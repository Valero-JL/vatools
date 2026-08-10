import { altitudeToFt, round, speedToKt } from '../units/conversions';
import type { TocData, TocResult } from '../../models/types';

export class TocValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TocValidationError';
  }
}

/**
 * TOC teórico (modelo simplificado):
 * ΔAlt = AltObj − AltIni
 * t_climb = ΔAlt / ROC
 * d_climb = GS · (t_climb / 60)
 */
export function calculateToc(input: TocData): TocResult {
  const altStart = altitudeToFt(input.altStart, input.altUnit);
  const altTarget = altitudeToFt(input.altTarget, input.altUnit);

  if (altTarget <= altStart) {
    throw new TocValidationError('La altitud objetivo debe ser mayor que la inicial');
  }
  if (input.roc <= 0) {
    throw new TocValidationError('La tasa de ascenso debe ser mayor que 0');
  }

  let gsKt: number | undefined;
  let method = 'GS explícita';

  if (input.gs !== undefined && input.gs > 0) {
    gsKt = speedToKt(input.gs, input.speedUnit);
    method = 'Groundspeed (GS)';
  } else if (input.tas !== undefined && input.tas > 0) {
    const tasKt = speedToKt(input.tas, input.speedUnit);
    const wind = input.windComp ?? 0;
    // windComp > 0 = headwind (reduce GS); < 0 = tailwind
    gsKt = tasKt - wind;
    method = 'TAS ± componente de viento';
  }

  if (gsKt === undefined || gsKt <= 0) {
    throw new TocValidationError('Introduce una velocidad (GS o TAS) mayor que 0');
  }

  const altToGain = altTarget - altStart;
  const timeMin = altToGain / input.roc;
  const distanceNM = gsKt * (timeMin / 60);
  const tocPointNM =
    input.distanceFromOriginNM !== undefined
      ? input.distanceFromOriginNM + distanceNM
      : undefined;

  return {
    altToGain: round(altToGain, 1),
    timeMin: round(timeMin, 2),
    distanceNM: round(distanceNM, 2),
    tocPointNM: tocPointNM !== undefined ? round(tocPointNM, 2) : undefined,
    gsUsed: round(gsKt, 2),
    method,
  };
}
