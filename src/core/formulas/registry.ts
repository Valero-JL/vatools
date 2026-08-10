import type { FormulaMeta } from '../../models/types';

export const FORMULAS: Record<string, FormulaMeta> = {
  wind: {
    id: 'wind-components',
    version: '1.0.0',
    source: 'AeroToolbox / FAA — fórmula estándar cos/sin del ángulo relativo',
    nature: 'approximate',
    certainty: 'verified',
    formula:
      'θ = ((WD − RH + 180) mod 360) − 180; HW = WS·cos(θ); XW = WS·sin(θ)',
    assumptions: [
      'La dirección del viento es de dónde viene (convención meteorológica).',
      'El rumbo de pista es el número × 10 (magnético si el viento es magnético).',
      'No corrige variación magnética automáticamente.',
    ],
  },
  toc: {
    id: 'toc-simplified',
    version: '1.0.0',
    source: 'Cinemática estándar (modelo simplificado educativo)',
    nature: 'educational',
    certainty: 'verified',
    formula: 'ΔAlt = AltObj − AltIni; t = ΔAlt / ROC; d = GS · (t / 60)',
    assumptions: [
      'Tasa de ascenso y velocidad constantes.',
      'TOC teórico: no modela peso, temperatura ni performance real del POH/AFM.',
      'GS ≈ TAS − headwind (o + tailwind) si se aporta componente de viento.',
    ],
  },
  tod_three_to_one: {
    id: 'tod-3to1',
    version: '1.0.0',
    source: 'Regla del tres (aeronautics) — 3 NM por cada 1000 ft',
    nature: 'approximate',
    certainty: 'verified',
    formula: 'Distancia_TOD (NM) = (ΔAlt / 1000) · 3',
    assumptions: [
      'Aproximación rápida; no incluye viento, desaceleración ni configuración.',
      'No reemplaza VNAV/FMS ni cartas de procedimiento.',
    ],
  },
  tod_angle: {
    id: 'tod-angle',
    version: '1.0.0',
    source: 'Geometría de sendero — 6076 · tan(ángulo°); ROD ≈ GS · 5 para 3°',
    nature: 'approximate',
    certainty: 'verified',
    formula: 'ft/NM = 6076 · tan(ángulo°); Dist = ΔAlt / (ft/NM); ROD ≈ GS · ángulo · 100/60 (3° ≈ GS×5)',
    assumptions: [
      'Ángulo de descenso constante.',
      'Puede sumarse distancia por desaceleración, configuración y margen.',
    ],
  },
  tod_rate: {
    id: 'tod-rate',
    version: '1.0.0',
    source: 'Cinemática: t = ΔAlt / ROD; d = GS · (t / 60)',
    nature: 'approximate',
    certainty: 'verified',
    formula: 't_desc = ΔAlt / ROD; d_desc = GS · (t_desc / 60)',
    assumptions: [
      'Tasa de descenso y GS constantes.',
      'El viento de cola aumenta la distancia necesaria (adelantar el TOD).',
    ],
  },
  time: {
    id: 'time-kinematics',
    version: '1.0.0',
    source: 'Cinemática: t = d/v; d = v·t; v = d/t con groundspeed',
    nature: 'operational',
    certainty: 'verified',
    formula: 'Tiempo = Distancia / Velocidad (GS)',
    assumptions: [
      'Para tiempos reales sobre el terreno se usa groundspeed (GS).',
      'No se modela aceleración ni cambios de fase en el modo básico.',
    ],
  },
  fuel: {
    id: 'fuel-block',
    version: '1.0.0',
    source: 'OACI Doc 9976 / Anexo 6 (referencia internacional); RAC pendiente de validación',
    nature: 'educational',
    certainty: 'pending_regulatory',
    formula:
      'Block = Taxi + Trip + Contingency + Alternate + Final Reserve + Additional + Extra',
    assumptions: [
      'Los valores de reserva/contingencia por defecto son referenciales [REF. INTERNACIONAL].',
      'Requisitos RAC 91/121/135: pendientes de validación normativa oficial.',
      'Flujos por fase son datos de performance (POH/AFM) o estimación del usuario.',
    ],
  },
};

export function getFormula(id: keyof typeof FORMULAS): FormulaMeta {
  return FORMULAS[id];
}
