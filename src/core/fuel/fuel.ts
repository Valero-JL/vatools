import { round } from '../units/conversions';
import type { FuelData, FuelResult } from '../../models/types';

export class FuelValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FuelValidationError';
  }
}

/** Valores sugeridos / fijos de la planificación por componentes. */
export const FUEL_DEFAULTS = {
  taxiTimeMin: 10,
  tripTimeMin: 60,
  tripFlowPerHour: 40,
  contingencyPercent: 5,
  finalReserveMin: 30,
} as const;

export function getFuelLabel(key: string): string {
  const labels: Record<string, string> = {
    taxi: 'Taxi',
    trip: 'Trip',
    contingency: 'Contingencia',
    alternate: 'Alterno',
    finalReserve: 'Reserva final',
    additional: 'Adicional',
    discretionary: 'Discrecional / Extra',
  };
  return labels[key] || key;
}

/**
 * Combustible de una fase: cantidad directa, o tiempo × flujo horario.
 */
export function phaseFuel(timeMin?: number, flowPerHour?: number, fuel?: number): number {
  if (fuel !== undefined && fuel !== null && !isNaN(fuel)) return fuel;
  if (
    timeMin !== undefined &&
    timeMin !== null &&
    !isNaN(timeMin) &&
    flowPerHour !== undefined &&
    flowPerHour !== null &&
    !isNaN(flowPerHour)
  ) {
    return (timeMin / 60) * flowPerHour;
  }
  return 0;
}

function hasNumber(val?: number): val is number {
  return val !== undefined && val !== null && !isNaN(val);
}

/**
 * Planificación por componentes.
 * Total = Taxi + Trip + Contingencia + Alterno + Reserva final(30 min) + Adicional + Discrecional
 */
export function calculateFuel(input: FuelData): FuelResult {
  const check = (val: number | undefined, name: string) => {
    if (!hasNumber(val)) return;
    if (val < 0) {
      throw new FuelValidationError(`${name} no puede ser negativo`);
    }
  };

  check(input.tripFlowPerHour, 'Flujo de viaje');
  check(input.taxiTimeMin, 'Tiempo de taxi');
  check(input.taxiFuelCustom, 'Combustible de taxi');
  check(input.tripTimeMin, 'Tiempo de viaje');
  check(input.tripFuelCustom, 'Combustible de viaje');
  check(input.contingencyTimeMin, 'Tiempo de contingencia');
  check(input.contingencyFuelCustom, 'Combustible de contingencia');
  check(input.contingencyPercent, 'Porcentaje de contingencia');
  check(input.alternateTimeMin, 'Tiempo de alterno');
  check(input.alternateFuelCustom, 'Combustible de alterno');
  check(input.additionalTimeMin, 'Tiempo adicional');
  check(input.additionalFuelCustom, 'Combustible adicional');
  check(input.discretionaryTimeMin, 'Tiempo discrecional');
  check(input.discretionaryFuelCustom, 'Combustible discrecional');

  const flow = input.tripFlowPerHour;
  if (!hasNumber(flow)) {
    throw new FuelValidationError('Indica el flujo de viaje');
  }

  const tripHasCustom = hasNumber(input.tripFuelCustom);
  const tripHasTime = hasNumber(input.tripTimeMin);
  if (!tripHasCustom && !tripHasTime) {
    throw new FuelValidationError(
      'Indica tiempo de viaje o una cantidad de combustible manual para el Trip',
    );
  }

  const taxi = round(phaseFuel(input.taxiTimeMin, flow, input.taxiFuelCustom), 2);
  const trip = round(phaseFuel(input.tripTimeMin, flow, input.tripFuelCustom), 2);

  let contingency: number;
  if (hasNumber(input.contingencyFuelCustom)) {
    contingency = round(input.contingencyFuelCustom, 2);
  } else if (hasNumber(input.contingencyTimeMin)) {
    contingency = round(phaseFuel(input.contingencyTimeMin, flow), 2);
  } else {
    const percent = hasNumber(input.contingencyPercent)
      ? input.contingencyPercent
      : FUEL_DEFAULTS.contingencyPercent;
    contingency = round((trip * percent) / 100, 2);
  }

  const alternate = round(phaseFuel(input.alternateTimeMin, flow, input.alternateFuelCustom), 2);

  const finalReserveMin = FUEL_DEFAULTS.finalReserveMin;
  const finalReserve = round(phaseFuel(finalReserveMin, flow), 2);

  const additional = round(
    phaseFuel(input.additionalTimeMin, flow, input.additionalFuelCustom),
    2,
  );
  const discretionary = round(
    phaseFuel(input.discretionaryTimeMin, flow, input.discretionaryFuelCustom),
    2,
  );

  const breakdown = {
    taxi,
    trip,
    contingency,
    alternate,
    finalReserve,
    additional,
    discretionary,
  };

  const total = round(
    taxi + trip + contingency + alternate + finalReserve + additional + discretionary,
    2,
  );

  // Indicador de monitoreo: no se suma al Total Trip Fuel.
  const mdf = round(alternate + finalReserve, 2);

  return {
    unit: input.unit,
    breakdown,
    total,
    mdf,
    finalReserveMin,
  };
}
