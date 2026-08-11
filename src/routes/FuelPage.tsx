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
import { WarningBanner } from '../components/WarningBanner';
import { FuelCharts } from '../components/charts/FuelCharts';
import { getFormula } from '../core/formulas/registry';
import {
  calculateFuel,
  certaintyLabelForFuel,
  FUEL_DEFAULTS_REF,
  FuelValidationError,
  getFuelLabel,
} from '../core/fuel/fuel';
import type { FuelResult, OperationType, VolumeUnit } from '../models/types';
import { getWarning } from '../data/warnings';

const OPS: { value: OperationType; label: string }[] = [
  { value: 'AG_VFR', label: 'Aviación general VFR' },
  { value: 'AG_IFR', label: 'Aviación general IFR' },
  { value: 'COMMERCIAL_RAC121', label: 'Comercial RAC 121' },
  { value: 'AIRTAXI_RAC135', label: 'Taxi aéreo RAC 135' },
  { value: 'OTHER', label: 'Otro' },
];

export function FuelPage() {
  const [operation, setOperation] = useState<OperationType>('AG_VFR');
  const [rules, setRules] = useState<'VFR' | 'IFR'>('VFR');
  const [unit, setUnit] = useState<VolumeUnit>('L');
  const [density, setDensity] = useState<number>(FUEL_DEFAULTS_REF.densityAvgas100LL);

  // Taxi
  const [taxiMin, setTaxiMin] = useState('10');
  const [taxiFlow, setTaxiFlow] = useState('30');
  const [taxiFuelCustom, setTaxiFuelCustom] = useState('');

  // Trip
  const [tripMin, setTripMin] = useState('60');
  const [tripFlow, setTripFlow] = useState('40');
  const [tripFuelCustom, setTripFuelCustom] = useState('');

  // Alternate
  const [altMin, setAltMin] = useState('0');
  const [altFlow, setAltFlow] = useState('40');
  const [altFuelCustom, setAltFuelCustom] = useState('');

  // Final Reserve
  const [finalMin, setFinalMin] = useState('');
  const [finalFlow, setFinalFlow] = useState('');
  const [finalFuelCustom, setFinalFuelCustom] = useState('');

  // Decisions
  const [contingency, setContingency] = useState('');
  const [additional, setAdditional] = useState('0');
  const [extra, setExtra] = useState('0');
  const [margin, setMargin] = useState('0');
  const [fob, setFob] = useState('120');

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FuelResult | null>(null);

  const handleReset = () => {
    setResult(null);
  };

  const compute = () => {
    try {
      setError(null);
      const r = calculateFuel({
        operation,
        rules,
        density,
        unit,
        taxiTimeMin: taxiMin === '' ? undefined : Number(taxiMin),
        taxiFlowPerHour: taxiFlow === '' ? undefined : Number(taxiFlow),
        taxiFuelCustom: taxiFuelCustom === '' ? undefined : Number(taxiFuelCustom),
        tripTimeMin: tripMin === '' ? undefined : Number(tripMin),
        tripFlowPerHour: tripFlow === '' ? undefined : Number(tripFlow),
        tripFuelCustom: tripFuelCustom === '' ? undefined : Number(tripFuelCustom),
        alternateTimeMin: altMin === '' ? undefined : Number(altMin),
        alternateFlowPerHour: altFlow === '' ? undefined : Number(altFlow),
        alternateFuelCustom: altFuelCustom === '' ? undefined : Number(altFuelCustom),
        finalReserveMin: finalMin === '' ? undefined : Number(finalMin),
        finalReserveFlow: finalFlow === '' ? undefined : Number(finalFlow),
        finalReserveFuelCustom: finalFuelCustom === '' ? undefined : Number(finalFuelCustom),
        contingencyPercent: contingency === '' ? undefined : Number(contingency),
        additional: additional === '' ? undefined : Number(additional),
        extra: extra === '' ? undefined : Number(extra),
        margin: margin === '' ? undefined : Number(margin),
        fuelOnBoard: fob === '' ? undefined : Number(fob),
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
      subtitle="Cálculo simplificado de combustible de viaje (Trip fuel), combustible mínimo de desvío y total requerido."
    >
      <WarningBanner warning={getWarning('fuel-pending-rac')!} />

      <Panel title="Tipo de operación y unidades">
        <FormGrid>
          <Field label="Tipo de operación" htmlFor="op">
            <SelectInput id="op" value={operation} onChange={(e) => setOperation(e.target.value as OperationType)}>
              {OPS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Reglas de vuelo" htmlFor="rules">
            <SelectInput id="rules" value={rules} onChange={(e) => setRules(e.target.value as 'VFR' | 'IFR')}>
              <option value="VFR">VFR</option>
              <option value="IFR">IFR</option>
            </SelectInput>
          </Field>
          <Field label="Unidad" htmlFor="unit">
            <SelectInput id="unit" value={unit} onChange={(e) => setUnit(e.target.value as VolumeUnit)}>
              <option value="L">Litros</option>
              <option value="usgal">Galón US</option>
              <option value="impgal">Galón imperial</option>
              <option value="kg">kg</option>
            </SelectInput>
          </Field>
          <Field label="Densidad" htmlFor="dens" hint="Jet A-1 ≈ 0.80 · Avgas ≈ 0.72 kg/L [REF. INTERNACIONAL]" error={error ?? undefined}>
            <UnitInput id="dens" type="number" step="0.01" unit="kg/L" value={density} onChange={(e) => setDensity(Number(e.target.value))} />
          </Field>
        </FormGrid>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Valores normativos por defecto: <strong>{certaintyLabelForFuel()}</strong>
        </p>
      </Panel>

      <Panel title="Cálculo del Trayecto (Trip Fuel) y Rodaje (Taxi)">
        <FormGrid>
          <Field label="Tiempo de viaje" htmlFor="tripMin" hint="Tiempo total estimado en ruta">
            <UnitInput id="tripMin" type="number" unit="min" value={tripMin} onChange={(e) => setTripMin(e.target.value)} />
          </Field>
          <Field label="Flujo de viaje" htmlFor="tripFlow" hint="Consumo de combustible en ruta por hora">
            <UnitInput id="tripFlow" type="number" unit={`${unit}/h`} value={tripFlow} onChange={(e) => setTripFlow(e.target.value)} />
          </Field>
          <Field label="Viaje manual" htmlFor="tripFuelCustom" hint="Opcional: introduce una cantidad directa de viaje">
            <UnitInput id="tripFuelCustom" type="number" unit={unit} value={tripFuelCustom} onChange={(e) => setTripFuelCustom(e.target.value)} />
          </Field>
          <Field label="Tiempo de taxi" htmlFor="taxiMin" hint="Tiempo de rodaje antes del despegue">
            <UnitInput id="taxiMin" type="number" unit="min" value={taxiMin} onChange={(e) => setTaxiMin(e.target.value)} />
          </Field>
          <Field label="Flujo de taxi" htmlFor="taxiFlow" hint="Consumo durante el rodaje por hora">
            <UnitInput id="taxiFlow" type="number" unit={`${unit}/h`} value={taxiFlow} onChange={(e) => setTaxiFlow(e.target.value)} />
          </Field>
          <Field label="Taxi manual" htmlFor="taxiFuelCustom" hint="Opcional: introduce una cantidad directa de taxi">
            <UnitInput id="taxiFuelCustom" type="number" unit={unit} value={taxiFuelCustom} onChange={(e) => setTaxiFuelCustom(e.target.value)} />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="Combustible de Desvío (Alterno y Reserva Final)">
        <FormGrid>
          <Field label="Tiempo al alterno" htmlFor="altMin" hint="Tiempo estimado al aeropuerto alterno">
            <UnitInput id="altMin" type="number" unit="min" value={altMin} onChange={(e) => setAltMin(e.target.value)} />
          </Field>
          <Field label="Flujo al alterno" htmlFor="altFlow" hint="Consumo estimado al alterno por hora">
            <UnitInput id="altFlow" type="number" unit={`${unit}/h`} value={altFlow} onChange={(e) => setAltFlow(e.target.value)} />
          </Field>
          <Field label="Alterno manual" htmlFor="altFuelCustom" hint="Opcional: introduce una cantidad directa para el alterno">
            <UnitInput id="altFuelCustom" type="number" unit={unit} value={altFuelCustom} onChange={(e) => setAltFuelCustom(e.target.value)} />
          </Field>
          <Field label="Tiempo de reserva final" htmlFor="finalMin" hint="Vacío = por defecto (45 min VFR / 30 min IFR)">
            <UnitInput id="finalMin" type="number" unit="min" value={finalMin} onChange={(e) => setFinalMin(e.target.value)} />
          </Field>
          <Field label="Flujo de reserva final" htmlFor="finalFlow" hint="Vacío = usa el flujo de viaje">
            <UnitInput id="finalFlow" type="number" unit={`${unit}/h`} value={finalFlow} onChange={(e) => setFinalFlow(e.target.value)} />
          </Field>
          <Field label="Reserva manual" htmlFor="finalFuelCustom" hint="Opcional: introduce una cantidad directa para reserva final">
            <UnitInput id="finalFuelCustom" type="number" unit={unit} value={finalFuelCustom} onChange={(e) => setFinalFuelCustom(e.target.value)} />
          </Field>
        </FormGrid>
      </Panel>

      <Panel title="Decisión operacional y Combustible a bordo">
        <FormGrid>
          <Field label="Contingencia %" htmlFor="cont" hint="Norma (vacío = default por tipo de operación)">
            <UnitInput id="cont" type="number" unit="%" value={contingency} onChange={(e) => setContingency(e.target.value)} />
          </Field>
          <Field label="Combustible adicional" htmlFor="add" hint="Escenario / norma específica">
            <UnitInput id="add" type="number" unit={unit} value={additional} onChange={(e) => setAdditional(e.target.value)} />
          </Field>
          <Field label="Combustible extra" htmlFor="extra" hint="Decisión del comandante">
            <UnitInput id="extra" type="number" unit={unit} value={extra} onChange={(e) => setExtra(e.target.value)} />
          </Field>
          <Field label="Margen" htmlFor="margin" hint="Margen operacional">
            <UnitInput id="margin" type="number" unit={unit} value={margin} onChange={(e) => setMargin(e.target.value)} />
          </Field>
          <Field label="Combustible a bordo (FOB)" htmlFor="fob" hint="Combustible total disponible al despegue">
            <UnitInput id="fob" type="number" unit={unit} value={fob} onChange={(e) => setFob(e.target.value)} />
          </Field>
        </FormGrid>
        <Actions>
          <PrimaryButton onClick={compute}>Calcular</PrimaryButton>
          <SecondaryButton onClick={handleReset}>Limpiar resultado</SecondaryButton>
        </Actions>
      </Panel>

      {result && (
        <Panel title="Resultados">
          {result.alert && <WarningBanner warning={getWarning('fuel-deficit')!} />}
          <ResultGrid>
            <Stat label="Combustible de Viaje (Trip Fuel)" value={`${result.trip} ${unit}`} />
            <Stat label="Mínimo Desvío (MDF)" value={`${result.minDiversion} ${unit}`} hint="Alterno + Reserva final" />
            <Stat label="Total Requerido (Block Fuel)" value={`${result.totalRequired} ${unit}`} />
            {result.fuelOnBoard !== undefined && <Stat label="A bordo (FOB)" value={`${result.fuelOnBoard} ${unit}`} />}
            {result.remaining !== undefined && <Stat label="Remanente tras viaje" value={`${result.remaining} ${unit}`} hint="FOB - (Taxi + Trip)" />}
            {result.deficit !== undefined && <Stat label="Déficit" value={`${result.deficit} ${unit}`} />}
          </ResultGrid>
          <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Concepto</th>
                  <th align="right">Cantidad</th>
                  <th align="left">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.breakdown).map(([k, v]) => (
                  <tr key={k}>
                    <td>{getFuelLabel(k)}</td>
                    <td align="right" className="mono">
                      {v} {unit}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {['contingency', 'finalReserve'].includes(k)
                        ? 'Normativa (pendiente validación)'
                        : ['additional', 'extra', 'margin'].includes(k)
                          ? 'Decisión / Margen'
                          : 'Cálculo / Performance'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <FuelCharts breakdown={result.breakdown} />
          </div>
          <ResultMeta
            formula={getFormula('fuel')}
            extraAssumptions={[`Etiqueta activa: ${certaintyLabelForFuel()}`]}
          />
        </Panel>
      )}
    </ModulePage>
  );
}
