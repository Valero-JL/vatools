import { round } from '../units/conversions';
import type { FuelData, FuelResult, OperationType } from '../../models/types';

export class FuelValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FuelValidationError';
  }
}

/** Referencias internacionales (NO son valores RAC confirmados). */
export const FUEL_DEFAULTS_REF = {
  contingencyPercentOaci: 5,
  finalReserveJetMin: 30,
  vfrDayReserveMin: 45, // pendiente de validación normativa oficial RAC 91
  densityJetA1: 0.8,
  densityAvgas100LL: 0.72,
} as const;

export function phaseFuel(timeMin?: number, flowPerHour?: number, fuel?: number): number {
  if (fuel !== undefined) return fuel;
  if (timeMin !== undefined && flowPerHour !== undefined) {
    return (timeMin / 60) * flowPerHour;
  }
  return 0;
}

/**
 * Cálculo modular educativo de combustible.
 * Los mínimos normativos por defecto se etiquetan como pendientes de validación.
 */
export function calculateFuel(input: FuelData): FuelResult {
  if (!input.operation) {
    throw new FuelValidationError('Selecciona el tipo de operación');
  }
  if (input.density <= 0) {
    throw new FuelValidationError('La densidad debe ser mayor que 0');
  }

  for (const p of input.phases) {
    if ((p.timeMin !== undefined && p.timeMin < 0) || (p.flowPerHour !== undefined && p.flowPerHour < 0) || (p.fuel !== undefined && p.fuel < 0)) {
      throw new FuelValidationError('Flujos y tiempos deben ser ≥ 0');
    }
  }

  const breakdown: Record<string, number> = {};
  let trip = 0;

  for (const p of input.phases) {
    const f = round(phaseFuel(p.timeMin, p.flowPerHour, p.fuel), 2);
    breakdown[p.name] = f;
    if (p.name !== 'taxi') {
      trip += f;
    }
  }
  trip = round(trip, 2);
  const taxi = breakdown['taxi'] ?? 0;

  const contingencyPercent =
    input.contingencyPercent ?? defaultContingency(input.operation);
  const contingency = round((trip * contingencyPercent) / 100, 2);
  breakdown['contingency'] = contingency;

  const alternate = round(
    phaseFuel(
      input.alternate?.timeMin,
      input.alternate?.flowPerHour,
      input.alternate?.fuel,
    ),
    2,
  );
  breakdown['alternate'] = alternate;

  const finalReserveMin =
    input.finalReserveMin ?? defaultFinalReserveMin(input.operation, input.rules);
  const finalReserveFlow = input.finalReserveFlow ?? averageCruiseFlow(input);
  const finalReserve = round((finalReserveMin / 60) * finalReserveFlow, 2);
  breakdown['finalReserve'] = finalReserve;

  const additional = round(input.additional ?? 0, 2);
  const extra = round(input.extra ?? 0, 2);
  const margin = round(input.margin ?? 0, 2);
  breakdown['additional'] = additional;
  breakdown['extra'] = extra;
  breakdown['margin'] = margin;

  const totalRequired = round(
    taxi + trip + contingency + alternate + finalReserve + additional + extra + margin,
    2,
  );

  const fuelOnBoard = input.fuelOnBoard;
  let remaining: number | undefined;
  let deficit: number | undefined;
  let alert = false;

  if (fuelOnBoard !== undefined) {
    if (fuelOnBoard < 0) {
      throw new FuelValidationError('El combustible a bordo no puede ser negativo');
    }
    remaining = round(fuelOnBoard - (taxi + trip), 2);
    if (fuelOnBoard < totalRequired) {
      alert = true;
      deficit = round(totalRequired - fuelOnBoard, 2);
    }
  }

  return {
    breakdown,
    trip,
    totalRequired,
    fuelOnBoard,
    remaining,
    deficit,
    alert,
  };
}

function defaultContingency(op: OperationType): number {
  // Referencia OACI ≥5% trip — pendiente de validación RAC comercial
  if (op === 'COMMERCIAL_RAC121' || op === 'AIRTAXI_RAC135') {
    return FUEL_DEFAULTS_REF.contingencyPercentOaci;
  }
  return 0;
}

function defaultFinalReserveMin(op: OperationType, rules: 'VFR' | 'IFR'): number {
  if (op === 'AG_VFR' || (op === 'OTHER' && rules === 'VFR')) {
    // 45 min — pendiente de validación normativa oficial RAC 91
    return FUEL_DEFAULTS_REF.vfrDayReserveMin;
  }
  // 30 min espera — referencia OACI jet
  return FUEL_DEFAULTS_REF.finalReserveJetMin;
}

function averageCruiseFlow(input: FuelData): number {
  const cruise = input.phases.find((p) => p.name === 'cruise');
  if (cruise?.flowPerHour) return cruise.flowPerHour;
  const withFlow = input.phases.find((p) => p.flowPerHour && p.flowPerHour > 0);
  return withFlow?.flowPerHour ?? 0;
}

export function certaintyLabelForFuel(): string {
  return 'referencia — pendiente de validación normativa oficial';
}
