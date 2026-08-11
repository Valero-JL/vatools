import { useState } from 'react';
import {
  Actions,
  FormGrid,
  ModulePage,
  Panel,
  PrimaryButton,
  ResultGrid,
  SecondaryButton,
  Stat,
} from '../components/ModulePage';
import { Field, SelectInput, UnitInput } from '../components/Field';
import { ResultMeta } from '../components/ResultMeta';
import { getFormula } from '../core/formulas/registry';
import { calculateFuel, FuelValidationError } from '../core/fuel/fuel';
import type { FuelResult, VolumeUnit } from '../models/types';

export function FuelPage() {
  const [unit, setUnit] = useState<VolumeUnit>('L');
  const [tripMin, setTripMin] = useState('60');
  const [tripFlow, setTripFlow] = useState('40');
  const [tripFuelCustom, setTripFuelCustom] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FuelResult | null>(null);

  const compute = () => {
    try {
      setError(null);
      const r = calculateFuel({
        unit,
        tripTimeMin: tripMin === '' ? undefined : Number(tripMin),
        tripFlowPerHour: tripFlow === '' ? undefined : Number(tripFlow),
        tripFuelCustom: tripFuelCustom === '' ? undefined : Number(tripFuelCustom),
      });
      setResult(r);
    } catch (e) {
      setResult(null);
      setError(e instanceof FuelValidationError ? e.message : 'Error de cálculo');
    }
  };

  return (
    <ModulePage
      title="Combustible"
      subtitle="Cálculo básico de trip fuel: tiempo de viaje × flujo de consumo."
    >
      <Panel title="Datos de entrada">
        <FormGrid>
          <Field label="Unidad" htmlFor="unit">
            <SelectInput id="unit" value={unit} onChange={(e) => setUnit(e.target.value as VolumeUnit)}>
              <option value="L">Litros</option>
              <option value="usgal">Galón US</option>
              <option value="impgal">Galón imperial</option>
              <option value="kg">kg</option>
            </SelectInput>
          </Field>
          <Field
            label="Tiempo de viaje"
            htmlFor="tripMin"
            hint="Tiempo total estimado en ruta"
            error={error ?? undefined}
          >
            <UnitInput
              id="tripMin"
              type="number"
              unit="min"
              value={tripMin}
              onChange={(e) => setTripMin(e.target.value)}
            />
          </Field>
          <Field label="Flujo de viaje" htmlFor="tripFlow" hint="Consumo de combustible en ruta por hora">
            <UnitInput
              id="tripFlow"
              type="number"
              unit={`${unit}/h`}
              value={tripFlow}
              onChange={(e) => setTripFlow(e.target.value)}
            />
          </Field>
          <Field
            label="Viaje manual"
            htmlFor="tripFuelCustom"
            hint="Opcional: cantidad directa (tiene prioridad sobre tiempo × flujo)"
          >
            <UnitInput
              id="tripFuelCustom"
              type="number"
              unit={unit}
              value={tripFuelCustom}
              onChange={(e) => setTripFuelCustom(e.target.value)}
            />
          </Field>
        </FormGrid>
        <Actions>
          <PrimaryButton onClick={compute}>Calcular</PrimaryButton>
          <SecondaryButton
            onClick={() => {
              setUnit('L');
              setTripMin('60');
              setTripFlow('40');
              setTripFuelCustom('');
              setResult(null);
              setError(null);
            }}
          >
            Restablecer
          </SecondaryButton>
        </Actions>
      </Panel>

      {result && (
        <Panel title="Resultados">
          <ResultGrid>
            <Stat label="Trip fuel" value={`${result.trip} ${result.unit}`} />
          </ResultGrid>
          <ResultMeta formula={getFormula('fuel')} />
        </Panel>
      )}
    </ModulePage>
  );
}
