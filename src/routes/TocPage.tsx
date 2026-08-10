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
import { ProfileChart } from '../components/charts/ProfileChart';
import { getFormula } from '../core/formulas/registry';
import { calculateToc, TocValidationError } from '../core/toc/toc';
import type { SpeedUnit, TocResult } from '../models/types';
import { getWarning } from '../data/warnings';

export function TocPage() {
  const [altStart, setAltStart] = useState(2000);
  const [altTarget, setAltTarget] = useState(8000);
  const [roc, setRoc] = useState(500);
  const [gs, setGs] = useState('100');
  const [tas, setTas] = useState('');
  const [windComp, setWindComp] = useState('0');
  const [fromOrigin, setFromOrigin] = useState('');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kt');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TocResult | null>(null);

  const compute = () => {
    try {
      setError(null);
      const r = calculateToc({
        altStart,
        altTarget,
        roc,
        gs: gs === '' ? undefined : Number(gs),
        tas: tas === '' ? undefined : Number(tas),
        windComp: windComp === '' ? undefined : Number(windComp),
        distanceFromOriginNM: fromOrigin === '' ? undefined : Number(fromOrigin),
        altUnit: 'ft',
        speedUnit,
      });
      setResult(r);
    } catch (e) {
      setResult(null);
      setError(e instanceof TocValidationError ? e.message : 'Error de cálculo');
    }
  };

  return (
    <ModulePage
      title="Top of Climb (TOC)"
      subtitle="Estima tiempo y distancia de ascenso con ROC y velocidad constantes (TOC teórico)."
    >
      <WarningBanner warning={getWarning('toc-theoretical')!} compact />
      <Panel title="Datos de entrada">
        <FormGrid>
          <Field label="Altitud inicial" htmlFor="alt0">
            <UnitInput id="alt0" type="number" unit="ft" value={altStart} onChange={(e) => setAltStart(Number(e.target.value))} />
          </Field>
          <Field label="Altitud objetivo" htmlFor="alt1" error={error ?? undefined}>
            <UnitInput id="alt1" type="number" unit="ft" value={altTarget} onChange={(e) => setAltTarget(Number(e.target.value))} />
          </Field>
          <Field label="Tasa de ascenso (ROC)" htmlFor="roc">
            <UnitInput id="roc" type="number" unit="fpm" value={roc} onChange={(e) => setRoc(Number(e.target.value))} />
          </Field>
          <Field label="Groundspeed (GS)" htmlFor="gs" hint="Prioritaria si se indica">
            <UnitInput id="gs" type="number" unit={speedUnit} value={gs} onChange={(e) => setGs(e.target.value)} />
          </Field>
          <Field label="TAS (si no hay GS)" htmlFor="tas">
            <UnitInput id="tas" type="number" unit={speedUnit} value={tas} onChange={(e) => setTas(e.target.value)} />
          </Field>
          <Field label="Componente viento (+ frente / − cola)" htmlFor="wind">
            <UnitInput id="wind" type="number" unit="kt" value={windComp} onChange={(e) => setWindComp(e.target.value)} />
          </Field>
          <Field label="Distancia desde salida (opcional)" htmlFor="origin">
            <UnitInput id="origin" type="number" unit="NM" value={fromOrigin} onChange={(e) => setFromOrigin(e.target.value)} />
          </Field>
          <Field label="Unidad de velocidad" htmlFor="su">
            <SelectInput id="su" value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value as SpeedUnit)}>
              <option value="kt">kt</option>
              <option value="kmh">km/h</option>
              <option value="ms">m/s</option>
            </SelectInput>
          </Field>
        </FormGrid>
        <Actions>
          <PrimaryButton onClick={compute}>Calcular</PrimaryButton>
          <SecondaryButton
            onClick={() => {
              setAltStart(2000);
              setAltTarget(8000);
              setRoc(500);
              setGs('100');
              setTas('');
              setWindComp('0');
              setFromOrigin('');
              setResult(null);
              setError(null);
            }}
          >
            Limpiar / ejemplo
          </SecondaryButton>
        </Actions>
      </Panel>

      {result && (
        <Panel title="Resultados">
          <ResultGrid>
            <Stat label="Altitud a ganar" value={`${result.altToGain} ft`} />
            <Stat label="Tiempo de ascenso" value={`${result.timeMin} min`} />
            <Stat label="Distancia horizontal" value={`${result.distanceNM} NM`} />
            <Stat label="GS usada" value={`${result.gsUsed} kt`} hint={result.method} />
            {result.tocPointNM !== undefined && (
              <Stat label="Punto TOC desde origen" value={`${result.tocPointNM} NM`} />
            )}
          </ResultGrid>
          <div style={{ marginTop: '1rem' }}>
            <ProfileChart altStart={altStart} altEnd={altTarget} distanceNM={result.distanceNM} mode="climb" />
          </div>
          <ResultMeta formula={getFormula('toc')} />
        </Panel>
      )}
    </ModulePage>
  );
}
