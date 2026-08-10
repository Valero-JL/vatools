import { useMemo, useState } from 'react';
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
import { RunwayDiagram } from '../components/charts/RunwayDiagram';
import { WindRose } from '../components/charts/WindRose';
import { getFormula } from '../core/formulas/registry';
import { ktToSpeed, runwayNumberToHeading, speedToKt } from '../core/units/conversions';
import {
  buildWindDataFromRunway,
  calculateWindComponents,
  WindValidationError,
} from '../core/wind/wind';
import type { SpeedUnit, WindReference, WindResult } from '../models/types';
import { getWarning } from '../data/warnings';

const UNIT_LABEL: Record<SpeedUnit, string> = { kt: 'kt', kmh: 'km/h', ms: 'm/s' };

export function WindPage() {
  const [runway, setRunway] = useState(9);
  const [windDir, setWindDir] = useState(90);
  const [windSpeed, setWindSpeed] = useState(10);
  const [gust, setGust] = useState<string>('');
  const [unit, setUnit] = useState<SpeedUnit>('kt');
  const [reference, setReference] = useState<WindReference>('magnetic');
  const [limit, setLimit] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WindResult | null>(null);

  const displayUnit = UNIT_LABEL[unit];

  const compute = (runwayNumber = runway) => {
    try {
      setError(null);
      const speedKt = speedToKt(windSpeed, unit);
      const gustKt = gust === '' ? undefined : speedToKt(Number(gust), unit);
      const limitKt = limit === '' ? undefined : speedToKt(Number(limit), unit);
      const data = buildWindDataFromRunway(runwayNumber, windDir, speedKt, {
        unit: 'kt',
        reference,
        gust: gustKt,
        aircraftCrosswindLimit: limitKt,
      });
      setResult(calculateWindComponents(data));
      setRunway(runwayNumber);
    } catch (e) {
      setResult(null);
      setError(e instanceof WindValidationError ? e.message : 'Error de cálculo');
    }
  };

  const sideLabel = useMemo(() => {
    if (!result) return '—';
    if (result.crosswindSide === 'none') return 'ninguno';
    return result.crosswindSide === 'right' ? 'derecha' : 'izquierda';
  }, [result]);

  const clear = () => {
    setRunway(9);
    setWindDir(90);
    setWindSpeed(10);
    setGust('');
    setLimit('');
    setUnit('kt');
    setReference('magnetic');
    setResult(null);
    setError(null);
  };

  const copy = async () => {
    if (!result) return;
    const text = `Pista ${String(runway).padStart(2, '0')} · HW ${result.headwind} / TW ${result.tailwind} · XW ${result.crosswind} ${sideLabel} ${displayUnit}`;
    await navigator.clipboard.writeText(text);
  };

  const toDisplay = (kt: number) => ktToSpeed(kt, unit);

  return (
    <ModulePage
      title="Componente de viento"
      subtitle="Calcula headwind/tailwind y crosswind respecto a la pista. La dirección del viento es de dónde viene."
    >
      <WarningBanner warning={getWarning('wind-direction-convention')!} compact />
      <WarningBanner warning={getWarning('wind-mag-true')!} compact />

      <Panel title="Datos de entrada">
        <FormGrid>
          <Field label="Número de pista (01–36)" htmlFor="rwy">
            <UnitInput
              id="rwy"
              type="number"
              min={1}
              max={36}
              value={runway}
              onChange={(e) => setRunway(Number(e.target.value))}
            />
          </Field>
          <Field label="Dirección del viento" htmlFor="wd" hint="0–360°, de dónde viene">
            <UnitInput
              id="wd"
              type="number"
              min={0}
              max={360}
              step="any"
              unit="°"
              value={windDir}
              onChange={(e) => setWindDir(Number(e.target.value))}
            />
          </Field>
          <Field label="Velocidad sostenida" htmlFor="ws" error={error ?? undefined}>
            <UnitInput
              id="ws"
              type="number"
              min={0}
              step="any"
              unit={displayUnit}
              value={windSpeed}
              onChange={(e) => setWindSpeed(Number(e.target.value))}
            />
          </Field>
          <Field label="Ráfaga (opcional)" htmlFor="gust">
            <UnitInput
              id="gust"
              type="number"
              min={0}
              step="any"
              unit={displayUnit}
              value={gust}
              onChange={(e) => setGust(e.target.value)}
            />
          </Field>
          <Field label="Unidad" htmlFor="unit">
            <SelectInput id="unit" value={unit} onChange={(e) => setUnit(e.target.value as SpeedUnit)}>
              <option value="kt">kt</option>
              <option value="kmh">km/h</option>
              <option value="ms">m/s</option>
            </SelectInput>
          </Field>
          <Field label="Referencia" htmlFor="ref">
            <SelectInput
              id="ref"
              value={reference}
              onChange={(e) => setReference(e.target.value as WindReference)}
            >
              <option value="magnetic">Magnética</option>
              <option value="true">Verdadera</option>
            </SelectInput>
          </Field>
          <Field label="Límite crosswind aeronave (opcional)" htmlFor="limit">
            <UnitInput
              id="limit"
              type="number"
              min={0}
              step="any"
              unit={displayUnit}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </Field>
        </FormGrid>
        <Actions>
          <PrimaryButton onClick={() => compute()}>Calcular</PrimaryButton>
          <SecondaryButton onClick={() => compute(result?.oppositeRunway ?? ((runway + 18 - 1) % 36) + 1)}>
            Invertir pista
          </SecondaryButton>
          <SecondaryButton onClick={clear}>Limpiar</SecondaryButton>
          <SecondaryButton onClick={copy} disabled={!result}>
            Copiar
          </SecondaryButton>
        </Actions>
      </Panel>

      {result && (
        <Panel title="Resultados">
          {result.exceedsLimit && <WarningBanner warning={getWarning('wind-xw-limit')!} />}
          {result.tailwind > 0 && <WarningBanner warning={getWarning('wind-tailwind')!} compact />}
          <ResultGrid>
            <Stat label="Ángulo viento-pista" value={`${result.angle}°`} />
            <Stat
              label="Headwind"
              value={`${toDisplay(result.headwind).toFixed(2)} ${displayUnit}`}
            />
            <Stat
              label="Tailwind"
              value={`${toDisplay(result.tailwind).toFixed(2)} ${displayUnit}`}
            />
            <Stat
              label="Crosswind"
              value={`${toDisplay(result.crosswind).toFixed(2)} ${displayUnit}`}
              hint={`Lado: ${sideLabel}`}
            />
            {result.gustCrosswind !== undefined && (
              <Stat
                label="Crosswind (ráfaga)"
                value={`${toDisplay(result.gustCrosswind).toFixed(2)} ${displayUnit}`}
              />
            )}
            <Stat label="Pista opuesta" value={String(result.oppositeRunway).padStart(2, '0')} />
          </ResultGrid>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '1rem' }}>
            <RunwayDiagram
              runwayNumber={runway}
              heading={runwayNumberToHeading(runway)}
              windDir={windDir}
              windSpeed={windSpeed}
              hwSigned={result.hwSigned}
              xwSigned={result.xwSigned}
            />
            <WindRose
              angle={result.angle}
              crosswind={result.crosswind}
              headwind={result.headwind}
              tailwind={result.tailwind}
            />
          </div>
          <ResultMeta formula={getFormula('wind')} />
        </Panel>
      )}
    </ModulePage>
  );
}
