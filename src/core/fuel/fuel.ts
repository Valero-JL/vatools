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
  if (fuel !== undefined && fuel !== null && !isNaN(fuel)) return fuel;
  if (timeMin !== undefined && timeMin !== null && !isNaN(timeMin) &&
      flowPerHour !== undefined && flowPerHour !== null && !isNaN(flowPerHour)) {
    return (timeMin / 60) * flowPerHour;
  }
  return 0;
}

export function getFuelLabel(key: string): string {
  const labels: Record<string, string> = {
    taxi: 'Rodaje (Taxi)',
    trip: 'Viaje (Trip fuel)',
    contingency: 'Contingencia',
    alternate: 'Alterno (Desvío)',
    finalReserve: 'Reserva final',
    additional: 'Adicional',
    extra: 'Extra',
    margin: 'Margen',
  };
  return labels[key] || key;
}

/**
 * Cálculo modular educativo de combustible simplificado.
 * Los mínimos normativos por defecto se etiquetan como pendientes de validación.
 */
export function calculateFuel(input: FuelData): FuelResult {
  if (!input.operation) {
    throw new FuelValidationError('Selecciona el tipo de operación');
  }
  if (input.density <= 0) {
    throw new FuelValidationError('La densidad debe ser mayor que 0');
  }

  // Validaciones de valores no negativos
  const checkNonNegative = (val?: number, name?: string) => {
    if (val !== undefined && val !== null && !isNaN(val) && val < 0) {
      throw new FuelValidationError(`${name || 'El valor'} no puede ser negativo`);
    }
  };

  checkNonNegative(input.taxiTimeMin, 'Tiempo de taxi');
  checkNonNegative(input.taxiFlowPerHour, 'Flujo de taxi');
  checkNonNegative(input.taxiFuelCustom, 'Combustible de taxi');
  checkNonNegative(input.tripTimeMin, 'Tiempo de viaje');
  checkNonNegative(input.tripFlowPerHour, 'Flujo de viaje');
  checkNonNegative(input.tripFuelCustom, 'Combustible de viaje');
  checkNonNegative(input.alternateTimeMin, 'Tiempo de alterno');
  checkNonNegative(input.alternateFlowPerHour, 'Flujo de alterno');
  checkNonNegative(input.alternateFuelCustom, 'Combustible de alterno');
  checkNonNegative(input.finalReserveMin, 'Tiempo de reserva');
  checkNonNegative(input.finalReserveFlow, 'Flujo de reserva');
  checkNonNegative(input.finalReserveFuelCustom, 'Combustible de reserva');
  checkNonNegative(input.additional, 'Adicional');
  checkNonNegative(input.extra, 'Extra');
  checkNonNegative(input.margin, 'Margen');
  checkNonNegative(input.fuelOnBoard, 'Combustible a bordo');

  // 1. Taxi
  const taxi = round(phaseFuel(input.taxiTimeMin, input.taxiFlowPerHour, input.taxiFuelCustom), 2);

  // 2. Trip
  const trip = round(phaseFuel(input.tripTimeMin, input.tripFlowPerHour, input.tripFuelCustom), 2);

  // 3. Contingency
  const contingencyPercent = input.contingencyPercent ?? defaultContingency(input.operation);
  const contingency = round((trip * contingencyPercent) / 100, 2);

  // 4. Alternate
  const alternate = round(phaseFuel(input.alternateTimeMin, input.alternateFlowPerHour, input.alternateFuelCustom), 2);

  // 5. Final Reserve
  const finalReserveMin = input.finalReserveMin ?? defaultFinalReserveMin(input.operation, input.rules);
  const finalReserveFlow = input.finalReserveFlow ?? input.tripFlowPerHour ?? 0;
  const finalReserve = round(phaseFuel(finalReserveMin, finalReserveFlow, input.finalReserveFuelCustom), 2);

  // Minimum Diversion Fuel = Alternate + Final Reserve
  const minDiversion = round(alternate + finalReserve, 2);

  // Otros
  const additional = round(input.additional ?? 0, 2);
  const extra = round(input.extra ?? 0, 2);
  const margin = round(input.margin ?? 0, 2);

  const breakdown: Record<string, number> = {
    taxi,
    trip,
    contingency,
    alternate,
    finalReserve,
    additional,
    extra,
    margin,
  };

  const totalRequired = round(
    taxi + trip + contingency + alternate + finalReserve + additional + extra + margin,
    2,
  );

  const fuelOnBoard = input.fuelOnBoard;
  let remaining: number | undefined;
  let deficit: number | undefined;
  let alert = false;

  if (fuelOnBoard !== undefined && fuelOnBoard !== null && !isNaN(fuelOnBoard)) {
    remaining = round(fuelOnBoard - (taxi + trip), 2);
    if (fuelOnBoard < totalRequired) {
      alert = true;
      deficit = round(totalRequired - fuelOnBoard, 2);
    }
  }

  return {
    breakdown,
    trip,
    taxi,
    contingency,
    alternate,
    finalReserve,
    minDiversion,
    totalRequired,
    fuelOnBoard,
    remaining,
    deficit,
    alert,
  };
}

function defaultContingency(op: OperationType): number {
  if (op === 'COMMERCIAL_RAC121' || op === 'AIRTAXI_RAC135') {
    return FUEL_DEFAULTS_REF.contingencyPercentOaci;
  }
  return 0;
}

function defaultFinalReserveMin(op: OperationType, rules: 'VFR' | 'IFR'): number {
  if (op === 'AG_VFR' || (op === 'OTHER' && rules === 'VFR')) {
    return FUEL_DEFAULTS_REF.vfrDayReserveMin;
  }
  return FUEL_DEFAULTS_REF.finalReserveJetMin;
}

export function certaintyLabelForFuel(): string {
  return 'referencia — pendiente de validación normativa oficial';
}
