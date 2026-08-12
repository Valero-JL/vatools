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
import {
  calculateFuel,
  FUEL_DEFAULTS,
  FuelValidationError,
  getFuelLabel,
} from '../core/fuel/fuel';
import type { FuelResult, VolumeUnit } from '../models/types';

function parseOptional(value: string): number | undefined {
  if (value === '') return undefined;
  return Number(value);
}

const BREAKDOWN_ORDER = [
  'taxi',
  'trip',
  'contingency',
  'alternate',
  'finalReserve',
  'additional',
  'discretionary',
] as const;

export function FuelPage() {
  const [unit, setUnit] = useState<VolumeUnit>('L');
  const [tripFlow, setTripFlow] = useState(String(FUEL_DEFAULTS.tripFlowPerHour));

  const [taxiMin, setTaxiMin] = useState(String(FUEL_DEFAULTS.taxiTimeMin));
  const [taxiFuelCustom, setTaxiFuelCustom] = useState('');

  const [tripMin, setTripMin] = useState(String(FUEL_DEFAULTS.tripTimeMin));
  const [tripFuelCustom, setTripFuelCustom] = useState('');

  const [contingencyPercent, setContingencyPercent] = useState(
    String(FUEL_DEFAULTS.contingencyPercent),
  );
  const [contingencyMin, setContingencyMin] = useState('');
  const [contingencyFuelCustom, setContingencyFuelCustom] = useState('');

  const [altMin, setAltMin] = useState('');
  const [altFuelCustom, setAltFuelCustom] = useState('');

  const [additionalMin, setAdditionalMin] = useState('');
  const [additionalFuelCustom, setAdditionalFuelCustom] = useState('');

  const [discretionaryMin, setDiscretionaryMin] = useState('');
  const [discretionaryFuelCustom, setDiscretionaryFuelCustom] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FuelResult | null>(null);

  const resetDefaults = () => {
    setUnit('L');
    setTripFlow(String(FUEL_DEFAULTS.tripFlowPerHour));
    setTaxiMin(String(FUEL_DEFAULTS.taxiTimeMin));
    setTaxiFuelCustom('');
    setTripMin(String(FUEL_DEFAULTS.tripTimeMin));
    setTripFuelCustom('');
    setContingencyPercent(String(FUEL_DEFAULTS.contingencyPercent));
    setContingencyMin('');
    setContingencyFuelCustom('');
    setAltMin('');
    setAltFuelCustom('');
    setAdditionalMin('');
    setAdditionalFuelCustom('');
    setDiscretionaryMin('');
    setDiscretionaryFuelCustom('');
    setResult(null);
    setError(null);
  };

  const compute = () => {
    try {
      setError(null);
      const r = calculateFuel({
        unit,
        tripFlowPerHour: parseOptional(tripFlow),
        taxiTimeMin: parseOptional(taxiMin),
        taxiFuelCustom: parseOptional(taxiFuelCustom),
        tripTimeMin: parseOptional(tripMin),
        tripFuelCustom: parseOptional(tripFuelCustom),
        contingencyPercent: parseOptional(contingencyPercent),
        contingencyTimeMin: parseOptional(contingencyMin),
        contingencyFuelCustom: parseOptional(contingencyFuelCustom),
        alternateTimeMin: parseOptional(altMin),
        alternateFuelCustom: parseOptional(altFuelCustom),
        additionalTimeMin: parseOptional(additionalMin),
        additionalFuelCustom: parseOptional(additionalFuelCustom),
        discretionaryTimeMin: parseOptional(discretionaryMin),
        discretionaryFuelCustom: parseOptional(discretionaryFuelCustom),
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
      subtitle="Planificación por componentes: suma Taxi, Trip, Contingencia, Alterno, Reserva final, Adicional y Discrecional."
    >
      <Panel title="Unidades y flujo">
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
            label="Flujo de viaje"
            htmlFor="tripFlow"
            hint="Consumo usado para todos los componentes calculados por tiempo"
            error={error ?? undefined}
          >
            <UnitInput
              id="tripFlow"
              type="number"
              unit={`${unit}/h`}
              value={tripFlow}
              onChange={(e) => setTripFlow(e.target.value)}
            />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="Taxi">
        <FormGrid>
          <Field label="Tiempo de taxi" htmlFor="taxiMin" hint={`Sugerido: ${FUEL_DEFAULTS.taxiTimeMin} min (editable)`}>
            <UnitInput
              id="taxiMin"
              type="number"
              unit="min"
              value={taxiMin}
              onChange={(e) => setTaxiMin(e.target.value)}
            />
          </Field>
          <Field
            label="Cantidad manual"
            htmlFor="taxiFuelCustom"
            hint="Opcional: tiene prioridad sobre tiempo × flujo"
          >
            <UnitInput
              id="taxiFuelCustom"
              type="number"
              unit={unit}
              value={taxiFuelCustom}
              onChange={(e) => setTaxiFuelCustom(e.target.value)}
            />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="Trip">
        <FormGrid>
          <Field label="Tiempo de viaje" htmlFor="tripMin" hint="Tiempo total estimado en ruta">
            <UnitInput
              id="tripMin"
              type="number"
              unit="min"
              value={tripMin}
              onChange={(e) => setTripMin(e.target.value)}
            />
          </Field>
          <Field
            label="Cantidad manual"
            htmlFor="tripFuelCustom"
            hint="Opcional: tiene prioridad sobre tiempo × flujo"
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
      </Panel>

      <Panel title="Contingencia">
        <FormGrid>
          <Field
            label="Porcentaje sugerido"
            htmlFor="contPercent"
            hint={`Sugerido: ${FUEL_DEFAULTS.contingencyPercent}% del Trip (editable). Se usa si no hay tiempo ni cantidad.`}
          >
            <UnitInput
              id="contPercent"
              type="number"
              unit="%"
              value={contingencyPercent}
              onChange={(e) => setContingencyPercent(e.target.value)}
            />
          </Field>
          <Field label="Tiempo" htmlFor="contMin" hint="Opcional: tiempo × flujo (prioridad sobre %)">
            <UnitInput
              id="contMin"
              type="number"
              unit="min"
              value={contingencyMin}
              onChange={(e) => setContingencyMin(e.target.value)}
            />
          </Field>
          <Field
            label="Cantidad manual"
            htmlFor="contFuelCustom"
            hint="Opcional: tiene prioridad sobre tiempo y %"
          >
            <UnitInput
              id="contFuelCustom"
              type="number"
              unit={unit}
              value={contingencyFuelCustom}
              onChange={(e) => setContingencyFuelCustom(e.target.value)}
            />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="Alterno">
        <FormGrid>
          <Field label="Tiempo al alterno" htmlFor="altMin" hint="Tiempo estimado al aeropuerto alterno">
            <UnitInput
              id="altMin"
              type="number"
              unit="min"
              value={altMin}
              onChange={(e) => setAltMin(e.target.value)}
            />
          </Field>
          <Field
            label="Cantidad manual"
            htmlFor="altFuelCustom"
            hint="Opcional: tiene prioridad sobre tiempo × flujo"
          >
            <UnitInput
              id="altFuelCustom"
              type="number"
              unit={unit}
              value={altFuelCustom}
              onChange={(e) => setAltFuelCustom(e.target.value)}
            />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="Reserva final">
        <FormGrid>
          <Field
            label="Tiempo de reserva final"
            htmlFor="finalMin"
            hint="Fijo: 30 min. Campo bloqueado; siempre se suma (tiempo × flujo)."
          >
            <UnitInput
              id="finalMin"
              type="number"
              unit="min"
              value={FUEL_DEFAULTS.finalReserveMin}
              disabled
              readOnly
            />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="Adicional (opcional)">
        <FormGrid>
          <Field label="Tiempo adicional" htmlFor="addMin" hint="Vacío = 0">
            <UnitInput
              id="addMin"
              type="number"
              unit="min"
              value={additionalMin}
              onChange={(e) => setAdditionalMin(e.target.value)}
            />
          </Field>
          <Field
            label="Cantidad manual"
            htmlFor="addFuelCustom"
            hint="Vacío = 0. Si hay cantidad, tiene prioridad"
          >
            <UnitInput
              id="addFuelCustom"
              type="number"
              unit={unit}
              value={additionalFuelCustom}
              onChange={(e) => setAdditionalFuelCustom(e.target.value)}
            />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="Discrecional / Extra (opcional)">
        <FormGrid>
          <Field label="Tiempo discrecional" htmlFor="discMin" hint="Vacío = 0">
            <UnitInput
              id="discMin"
              type="number"
              unit="min"
              value={discretionaryMin}
              onChange={(e) => setDiscretionaryMin(e.target.value)}
            />
          </Field>
          <Field
            label="Cantidad manual"
            htmlFor="discFuelCustom"
            hint="Vacío = 0. Si hay cantidad, tiene prioridad"
          >
            <UnitInput
              id="discFuelCustom"
              type="number"
              unit={unit}
              value={discretionaryFuelCustom}
              onChange={(e) => setDiscretionaryFuelCustom(e.target.value)}
            />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="Acciones">
        <Actions>
          <PrimaryButton onClick={compute}>Calcular</PrimaryButton>
          <SecondaryButton onClick={resetDefaults}>Restablecer</SecondaryButton>
        </Actions>
      </Panel>

      {result && (
        <Panel title="Resultados">
          <ResultGrid>
            <Stat label="Total Trip Fuel" value={`${result.total} ${result.unit}`} />
          </ResultGrid>
          <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Componente</th>
                  <th align="right">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {BREAKDOWN_ORDER.map((key) => (
                  <tr key={key}>
                    <td>{getFuelLabel(key)}</td>
                    <td align="right" className="mono">
                      {result.breakdown[key]} {result.unit}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Total Trip Fuel</strong>
                  </td>
                  <td align="right" className="mono">
                    <strong>
                      {result.total} {result.unit}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ResultMeta formula={getFormula('fuel')} />
        </Panel>
      )}
    </ModulePage>
  );
}
