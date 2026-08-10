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
import { calculateTime, TimeValidationError } from '../core/time/time';
import type { DistanceUnit, SpeedUnit, TimeMode, TimeResult } from '../models/types';

export function TimePage() {
  const [mode, setMode] = useState<TimeMode>('t');
  const [distance, setDistance] = useState('100');
  const [speed, setSpeed] = useState('120');
  const [timeMin, setTimeMin] = useState('50');
  const [distUnit, setDistUnit] = useState<DistanceUnit>('NM');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kt');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TimeResult | null>(null);

  const compute = () => {
    try {
      setError(null);
      const r = calculateTime({
        mode,
        distance: distance === '' ? undefined : Number(distance),
        speed: speed === '' ? undefined : Number(speed),
        timeMin: timeMin === '' ? undefined : Number(timeMin),
        distUnit,
        speedUnit,
      });
      setResult(r);
    } catch (e) {
      setResult(null);
      setError(e instanceof TimeValidationError ? e.message : 'Error de cálculo');
    }
  };

  return (
    <ModulePage
      title="Tiempos de vuelo"
      subtitle="Cinemática con groundspeed: tiempo, distancia o velocidad. Valida división por cero."
    >
      <Panel title="Datos de entrada">
        <FormGrid>
          <Field label="Modo" htmlFor="mode">
            <SelectInput id="mode" value={mode} onChange={(e) => setMode(e.target.value as TimeMode)}>
              <option value="t">Tiempo = distancia / velocidad</option>
              <option value="d">Distancia = velocidad · tiempo</option>
              <option value="v">Velocidad = distancia / tiempo</option>
            </SelectInput>
          </Field>
          {(mode === 't' || mode === 'v') && (
            <Field label="Distancia" htmlFor="dist" error={error ?? undefined}>
              <UnitInput id="dist" type="number" unit={distUnit} value={distance} onChange={(e) => setDistance(e.target.value)} />
            </Field>
          )}
          {(mode === 't' || mode === 'd') && (
            <Field label="Velocidad (GS)" htmlFor="spd" error={error ?? undefined}>
              <UnitInput id="spd" type="number" unit={speedUnit} value={speed} onChange={(e) => setSpeed(e.target.value)} />
            </Field>
          )}
          {(mode === 'd' || mode === 'v') && (
            <Field label="Tiempo" htmlFor="time">
              <UnitInput id="time" type="number" unit="min" value={timeMin} onChange={(e) => setTimeMin(e.target.value)} />
            </Field>
          )}
          <Field label="Unidad distancia" htmlFor="du">
            <SelectInput id="du" value={distUnit} onChange={(e) => setDistUnit(e.target.value as DistanceUnit)}>
              <option value="NM">NM</option>
              <option value="km">km</option>
            </SelectInput>
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
              setMode('t');
              setDistance('100');
              setSpeed('120');
              setTimeMin('50');
              setResult(null);
              setError(null);
            }}
          >
            Ejemplo 100 NM / 120 kt
          </SecondaryButton>
        </Actions>
      </Panel>

      {result && (
        <Panel title="Resultados">
          <ResultGrid>
            <Stat label="Resultado" value={`${result.value}`} hint={result.unitLabel} />
            <Stat label="Formato" value={result.formatted} />
          </ResultGrid>
          <ResultMeta formula={getFormula('time')} />
        </Panel>
      )}
    </ModulePage>
  );
}
