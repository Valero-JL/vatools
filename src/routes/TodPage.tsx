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
import { calculateTod, TodValidationError } from '../core/tod/tod';
import type { SpeedUnit, TodMethod, TodResult } from '../models/types';
import { getWarning } from '../data/warnings';

export function TodPage() {
  const [altNow, setAltNow] = useState(35000);
  const [altTarget, setAltTarget] = useState(0);
  const [method, setMethod] = useState<TodMethod>('threeToOne');
  const [rod, setRod] = useState('1000');
  const [gs, setGs] = useState('300');
  const [angle, setAngle] = useState('3');
  const [decel, setDecel] = useState('0');
  const [config, setConfig] = useState('0');
  const [margin, setMargin] = useState('0');
  const [windComp, setWindComp] = useState('0');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kt');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TodResult | null>(null);

  const compute = () => {
    try {
      setError(null);
      const r = calculateTod({
        altNow,
        altTarget,
        method,
        rod: rod === '' ? undefined : Number(rod),
        gs: gs === '' ? undefined : Number(gs),
        angleDeg: angle === '' ? undefined : Number(angle),
        decelDist: Number(decel) || 0,
        configDist: Number(config) || 0,
        safetyMargin: Number(margin) || 0,
        windComp: windComp === '' ? undefined : Number(windComp),
        altUnit: 'ft',
        speedUnit,
      });
      setResult(r);
    } catch (e) {
      setResult(null);
      setError(e instanceof TodValidationError ? e.message : 'Error de cálculo');
    }
  };

  const formulaKey =
    method === 'threeToOne'
      ? 'tod_three_to_one'
      : method === 'rate'
        ? 'tod_rate'
        : 'tod_angle';

  return (
    <ModulePage
      title="Top of Descent (TOD)"
      subtitle="Estima dónde iniciar el descenso. Compara regla 3:1, ángulo y tasa fija."
    >
      <WarningBanner warning={getWarning('tod-atc')!} compact />
      <Panel title="Datos de entrada">
        <FormGrid>
          <Field label="Altitud actual" htmlFor="altNow">
            <UnitInput id="altNow" type="number" unit="ft" value={altNow} onChange={(e) => setAltNow(Number(e.target.value))} />
          </Field>
          <Field label="Altitud objetivo" htmlFor="altT" error={error ?? undefined}>
            <UnitInput id="altT" type="number" unit="ft" value={altTarget} onChange={(e) => setAltTarget(Number(e.target.value))} />
          </Field>
          <Field label="Método" htmlFor="method">
            <SelectInput id="method" value={method} onChange={(e) => setMethod(e.target.value as TodMethod)}>
              <option value="threeToOne">Regla 3:1 (aprox. 3°)</option>
              <option value="angle">Ángulo de descenso</option>
              <option value="rate">Tasa de descenso fija</option>
              <option value="custom">Personalizado (ángulo)</option>
            </SelectInput>
          </Field>
          <Field label="Ángulo" htmlFor="angle">
            <UnitInput id="angle" type="number" unit="°" value={angle} onChange={(e) => setAngle(e.target.value)} />
          </Field>
          <Field label="ROD" htmlFor="rod">
            <UnitInput id="rod" type="number" unit="fpm" value={rod} onChange={(e) => setRod(e.target.value)} />
          </Field>
          <Field label="Groundspeed" htmlFor="gs">
            <UnitInput id="gs" type="number" unit={speedUnit} value={gs} onChange={(e) => setGs(e.target.value)} />
          </Field>
          <Field label="Dist. desaceleración" htmlFor="decel">
            <UnitInput id="decel" type="number" unit="NM" value={decel} onChange={(e) => setDecel(e.target.value)} />
          </Field>
          <Field label="Dist. configuración" htmlFor="config">
            <UnitInput id="config" type="number" unit="NM" value={config} onChange={(e) => setConfig(e.target.value)} />
          </Field>
          <Field label="Margen de seguridad" htmlFor="margin">
            <UnitInput id="margin" type="number" unit="NM" value={margin} onChange={(e) => setMargin(e.target.value)} />
          </Field>
          <Field label="Viento (+ frente / − cola)" htmlFor="wind">
            <UnitInput id="wind" type="number" unit="kt" value={windComp} onChange={(e) => setWindComp(e.target.value)} />
          </Field>
          <Field label="Unidad velocidad" htmlFor="su">
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
              setAltNow(35000);
              setAltTarget(0);
              setMethod('threeToOne');
              setResult(null);
              setError(null);
            }}
          >
            Ejemplo FL350
          </SecondaryButton>
        </Actions>
      </Panel>

      {result && (
        <Panel title="Resultados">
          <ResultGrid>
            <Stat label="Altitud a perder" value={`${result.altToLose} ft`} />
            <Stat label="Distancia TOD (método)" value={`${result.distanceNM} NM`} />
            {result.timeMin !== undefined && <Stat label="Tiempo estimado" value={`${result.timeMin} min`} />}
            {result.recommendedRod !== undefined && (
              <Stat label="ROD recomendado (ángulo)" value={`${result.recommendedRod} fpm`} />
            )}
            <Stat label="Extra (decel+config+margen)" value={`${result.extraDist} NM`} />
            {result.byThreeToOne !== undefined && <Stat label="Comparación 3:1" value={`${result.byThreeToOne} NM`} />}
            {result.byAngle !== undefined && <Stat label="Comparación ángulo" value={`${result.byAngle} NM`} />}
            {result.byRate !== undefined && <Stat label="Comparación tasa" value={`${result.byRate} NM`} />}
          </ResultGrid>
          <div style={{ marginTop: '1rem' }}>
            <ProfileChart altStart={altNow} altEnd={altTarget} distanceNM={result.distanceNM} mode="descent" />
          </div>
          <ResultMeta formula={getFormula(formulaKey)} />
        </Panel>
      )}
    </ModulePage>
  );
}
