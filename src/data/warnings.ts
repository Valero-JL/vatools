import type { WarningMessage } from '../models/types';

export const OPERATIONAL_DISCLAIMER =
  'Este cálculo es una referencia educativa y no reemplaza la planificación operacional, el POH/AFM, el FCOM, el manual de operaciones, el despacho de vuelo, la información meteorológica oficial, los NOTAM, el AIP, las instrucciones ATC ni los requisitos vigentes de Aerocivil.';

export const WARNINGS: WarningMessage[] = [
  {
    id: 'ops-main',
    text: OPERATIONAL_DISCLAIMER,
    level: 'warning',
    location: 'global',
    blocking: false,
  },
  {
    id: 'wind-mag-true',
    text: 'El viento de ATIS/torre suele ser magnético; METAR/TAF y viento en altura suelen ser verdaderos. Verifica la referencia y la variación magnética.',
    level: 'caution',
    location: 'wind',
    blocking: false,
  },
  {
    id: 'wind-direction-convention',
    text: 'La dirección del viento indica de dónde viene el viento (convención meteorológica), no hacia dónde va.',
    level: 'info',
    location: 'wind',
    blocking: false,
  },
  {
    id: 'wind-xw-limit',
    text: 'El viento cruzado supera el límite introducido de la aeronave. Revisa el POH/AFM antes de operar.',
    level: 'warning',
    location: 'wind',
    blocking: true,
  },
  {
    id: 'wind-tailwind',
    text: 'Hay componente de cola. Confirma el límite de tailwind demostrado en el POH/AFM.',
    level: 'caution',
    location: 'wind',
    blocking: false,
  },
  {
    id: 'toc-theoretical',
    text: 'Este es un TOC teórico (ROC y velocidad constantes). El TOC real depende de peso, temperatura, presión y performance del POH/AFM. Pendiente de validación para modelos de performance real.',
    level: 'caution',
    location: 'toc',
    blocking: false,
  },
  {
    id: 'tod-atc',
    text: 'El TOD calculado es orientativo. Cumple restricciones ATC y procedimientos instrumentales; no reemplaza VNAV/FMS ni la carta del procedimiento.',
    level: 'caution',
    location: 'tod',
    blocking: false,
  },
];

export function getWarning(id: string): WarningMessage | undefined {
  return WARNINGS.find((w) => w.id === id);
}

export function getWarningsFor(location: string): WarningMessage[] {
  return WARNINGS.filter((w) => w.location === location || w.location === 'global');
}
