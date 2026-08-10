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
  const [taxiMin, setTaxiMin] = useState('10');
  const [taxiFlow, setTaxiFlow] = useState('30');
  const [climbMin, setClimbMin] = useState('12');
  const [climbFlow, setClimbFlow] = useState('60');
  const [cruiseMin, setCruiseMin] = useState('60');
  const [cruiseFlow, setCruiseFlow] = useState('40');
  const [descentMin, setDescentMin] = useState('15');
  const [descentFlow, setDescentFlow] = useState('25');
  const [approachMin, setApproachMin] = useState('10');
  const [approachFlow, setApproachFlow] = useState('35');
  const [altMin, setAltMin] = useState('0');
  const [altFlow, setAltFlow] = useState('40');
  const [contingency, setContingency] = useState('');
  const [finalMin, setFinalMin] = useState('');
  const [additional, setAdditional] = useState('0');
  const [extra, setExtra] = useState('0');
  const [fob, setFob] = useState('120');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FuelResult | null>(null);

  const compute = () => {
    try {
      setError(null);
      const r = calculateFuel({
        operation,
        rules,
        density,
        unit,
        phases: [
          { name: 'taxi', timeMin: Number(taxiMin), flowPerHour: Number(taxiFlow) },
          { name: 'climb', timeMin: Number(climbMin), flowPerHour: Number(climbFlow) },
          { name: 'cruise', timeMin: Number(cruiseMin), flowPerHour: Number(cruiseFlow) },
          { name: 'descent', timeMin: Number(descentMin), flowPerHour: Number(descentFlow) },
          { name: 'approach', timeMin: Number(approachMin), flowPerHour: Number(approachFlow) },
        ],
        alternate: {
          timeMin: Number(altMin) || 0,
          flowPerHour: Number(altFlow) || 0,
        },
        contingencyPercent: contingency === '' ? undefined : Number(contingency),
        finalReserveMin: finalMin === '' ? undefined : Number(finalMin),
        finalReserveFlow: Number(cruiseFlow) || 0,
        additional: Number(additional) || 0,
        extra: Number(extra) || 0,
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
      subtitle="Desglose modular por fases y tipo de operación. Separa cálculo, norma, performance y decisión operacional."
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

      <Panel title="Fases (performance / cálculo)">
        <FormGrid>
          <Field label="Taxi — tiempo" htmlFor="taxiMin"><UnitInput id="taxiMin" type="number" unit="min" value={taxiMin} onChange={(e) => setTaxiMin(e.target.value)} /></Field>
          <Field label="Taxi — flujo" htmlFor="taxiFlow"><UnitInput id="taxiFlow" type="number" unit={`${unit}/h`} value={taxiFlow} onChange={(e) => setTaxiFlow(e.target.value)} /></Field>
          <Field label="Ascenso — tiempo" htmlFor="clMin"><UnitInput id="clMin" type="number" unit="min" value={climbMin} onChange={(e) => setClimbMin(e.target.value)} /></Field>
          <Field label="Ascenso — flujo" htmlFor="clFlow"><UnitInput id="clFlow" type="number" unit={`${unit}/h`} value={climbFlow} onChange={(e) => setClimbFlow(e.target.value)} /></Field>
          <Field label="Crucero — tiempo" htmlFor="crMin"><UnitInput id="crMin" type="number" unit="min" value={cruiseMin} onChange={(e) => setCruiseMin(e.target.value)} /></Field>
          <Field label="Crucero — flujo" htmlFor="crFlow"><UnitInput id="crFlow" type="number" unit={`${unit}/h`} value={cruiseFlow} onChange={(e) => setCruiseFlow(e.target.value)} /></Field>
          <Field label="Descenso — tiempo" htmlFor="deMin"><UnitInput id="deMin" type="number" unit="min" value={descentMin} onChange={(e) => setDescentMin(e.target.value)} /></Field>
          <Field label="Descenso — flujo" htmlFor="deFlow"><UnitInput id="deFlow" type="number" unit={`${unit}/h`} value={descentFlow} onChange={(e) => setDescentFlow(e.target.value)} /></Field>
          <Field label="Aprox. — tiempo" htmlFor="apMin"><UnitInput id="apMin" type="number" unit="min" value={approachMin} onChange={(e) => setApproachMin(e.target.value)} /></Field>
          <Field label="Aprox. — flujo" htmlFor="apFlow"><UnitInput id="apFlow" type="number" unit={`${unit}/h`} value={approachFlow} onChange={(e) => setApproachFlow(e.target.value)} /></Field>
        </FormGrid>
      </Panel>

      <Panel title="Reservas, norma y decisión operacional">
        <FormGrid>
          <Field label="Alterno — tiempo" htmlFor="altMin" hint="Cálculo / performance">
            <UnitInput id="altMin" type="number" unit="min" value={altMin} onChange={(e) => setAltMin(e.target.value)} />
          </Field>
          <Field label="Alterno — flujo" htmlFor="altFlow">
            <UnitInput id="altFlow" type="number" unit={`${unit}/h`} value={altFlow} onChange={(e) => setAltFlow(e.target.value)} />
          </Field>
          <Field label="Contingencia %" htmlFor="cont" hint="Norma (dejar vacío = default referencial)">
            <UnitInput id="cont" type="number" unit="%" value={contingency} onChange={(e) => setContingency(e.target.value)} />
          </Field>
          <Field label="Reserva final" htmlFor="fin" hint="Norma (min; vacío = default referencial)">
            <UnitInput id="fin" type="number" unit="min" value={finalMin} onChange={(e) => setFinalMin(e.target.value)} />
          </Field>
          <Field label="Additional" htmlFor="add" hint="Escenario / norma específica">
            <UnitInput id="add" type="number" unit={unit} value={additional} onChange={(e) => setAdditional(e.target.value)} />
          </Field>
          <Field label="Extra" htmlFor="extra" hint="Decisión del comandante">
            <UnitInput id="extra" type="number" unit={unit} value={extra} onChange={(e) => setExtra(e.target.value)} />
          </Field>
          <Field label="Combustible a bordo (FOB)" htmlFor="fob">
            <UnitInput id="fob" type="number" unit={unit} value={fob} onChange={(e) => setFob(e.target.value)} />
          </Field>
        </FormGrid>
        <Actions>
          <PrimaryButton onClick={compute}>Calcular</PrimaryButton>
          <SecondaryButton onClick={() => setResult(null)}>Limpiar resultado</SecondaryButton>
        </Actions>
      </Panel>

      {result && (
        <Panel title="Resultados">
          {result.alert && <WarningBanner warning={getWarning('fuel-deficit')!} />}
          <ResultGrid>
            <Stat label="Trip fuel" value={`${result.trip} ${unit}`} />
            <Stat label="Total requerido" value={`${result.totalRequired} ${unit}`} />
            {result.fuelOnBoard !== undefined && <Stat label="FOB" value={`${result.fuelOnBoard} ${unit}`} />}
            {result.remaining !== undefined && <Stat label="Remanente tras trip" value={`${result.remaining} ${unit}`} />}
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
                    <td>{k}</td>
                    <td align="right" className="mono">
                      {v} {unit}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {['contingency', 'finalReserve'].includes(k)
                        ? 'norma (pendiente validación)'
                        : ['additional', 'extra', 'margin'].includes(k)
                          ? 'decisión / margen'
                          : 'cálculo / performance'}
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
