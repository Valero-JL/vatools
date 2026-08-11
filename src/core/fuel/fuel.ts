import { round } from '../units/conversions';
import type { FuelData, FuelResult } from '../../models/types';

export class FuelValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FuelValidationError';
  }
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

/**
 * Trip fuel básico: tiempo de viaje × flujo, o cantidad manual.
 */
export function calculateFuel(input: FuelData): FuelResult {
  const checkNonNegative = (val?: number, name?: string) => {
    if (val !== undefined && val !== null && !isNaN(val) && val < 0) {
      throw new FuelValidationError(`${name || 'El valor'} no puede ser negativo`);
    }
  };

  checkNonNegative(input.tripTimeMin, 'Tiempo de viaje');
  checkNonNegative(input.tripFlowPerHour, 'Flujo de viaje');
  checkNonNegative(input.tripFuelCustom, 'Combustible de viaje');

  const hasCustom =
    input.tripFuelCustom !== undefined &&
    input.tripFuelCustom !== null &&
    !isNaN(input.tripFuelCustom);
  const hasTimeFlow =
    input.tripTimeMin !== undefined &&
    input.tripTimeMin !== null &&
    !isNaN(input.tripTimeMin) &&
    input.tripFlowPerHour !== undefined &&
    input.tripFlowPerHour !== null &&
    !isNaN(input.tripFlowPerHour);

  if (!hasCustom && !hasTimeFlow) {
    throw new FuelValidationError(
      'Indica tiempo y flujo de viaje, o una cantidad de combustible manual',
    );
  }

  const trip = round(phaseFuel(input.tripTimeMin, input.tripFlowPerHour, input.tripFuelCustom), 2);

  return {
    trip,
    unit: input.unit,
  };
}
