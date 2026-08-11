export type SpeedUnit = 'kt' | 'kmh' | 'ms';
export type DistanceUnit = 'NM' | 'km';
export type AltitudeUnit = 'ft' | 'm';
export type VolumeUnit = 'L' | 'usgal' | 'impgal' | 'kg';
export type WindReference = 'magnetic' | 'true';
export type OperationType =
  | 'AG_VFR'
  | 'AG_IFR'
  | 'COMMERCIAL_RAC121'
  | 'AIRTAXI_RAC135'
  | 'OTHER';
export type CertaintyLevel =
  | 'verified'
  | 'reference_intl'
  | 'pending'
  | 'pending_regulatory';

export interface RunwayData {
  number: number;
  heading: number;
}

export interface WindData {
  runway: RunwayData;
  windDir: number;
  windSpeed: number;
  gust?: number;
  unit: SpeedUnit;
  reference: WindReference;
  aircraftCrosswindLimit?: number;
}

export interface WindResult {
  angle: number;
  headwind: number;
  tailwind: number;
  crosswind: number;
  crosswindSide: 'left' | 'right' | 'none';
  hwSigned: number;
  xwSigned: number;
  gustHeadwind?: number;
  gustTailwind?: number;
  gustCrosswind?: number;
  gustCrosswindSide?: 'left' | 'right' | 'none';
  exceedsLimit: boolean;
  oppositeRunway: number;
}

export interface TocData {
  altStart: number;
  altTarget: number;
  roc: number;
  tas?: number;
  gs?: number;
  windComp?: number;
  distanceFromOriginNM?: number;
  altUnit: AltitudeUnit;
  speedUnit: SpeedUnit;
}

export interface TocResult {
  altToGain: number;
  timeMin: number;
  distanceNM: number;
  tocPointNM?: number;
  gsUsed: number;
  method: string;
}

export type TodMethod = 'rate' | 'angle' | 'threeToOne' | 'custom';

export interface TodData {
  altNow: number;
  altTarget: number;
  rod?: number;
  gs?: number;
  angleDeg?: number;
  decelDist?: number;
  configDist?: number;
  windComp?: number;
  safetyMargin?: number;
  method: TodMethod;
  altUnit: AltitudeUnit;
  speedUnit: SpeedUnit;
}

export interface TodResult {
  altToLose: number;
  timeMin?: number;
  distanceNM: number;
  byRate?: number;
  byAngle?: number;
  byThreeToOne?: number;
  recommendedRod?: number;
  extraDist: number;
  method: TodMethod;
}

export type TimeMode = 't' | 'd' | 'v';

export interface TimeData {
  mode: TimeMode;
  distance?: number;
  speed?: number;
  timeMin?: number;
  distUnit: DistanceUnit;
  speedUnit: SpeedUnit;
}

export interface TimeResult {
  value: number;
  formatted: string;
  unitLabel: string;
}

export interface FuelData {
  operation: OperationType;
  rules: 'VFR' | 'IFR';
  density: number;
  unit: VolumeUnit;
  taxiTimeMin?: number;
  taxiFlowPerHour?: number;
  taxiFuelCustom?: number;
  tripTimeMin?: number;
  tripFlowPerHour?: number;
  tripFuelCustom?: number;
  alternateTimeMin?: number;
  alternateFlowPerHour?: number;
  alternateFuelCustom?: number;
  finalReserveMin?: number;
  finalReserveFlow?: number;
  finalReserveFuelCustom?: number;
  contingencyPercent?: number;
  additional?: number;
  extra?: number;
  fuelOnBoard?: number;
  margin?: number;
}

export interface FuelResult {
  breakdown: Record<string, number>;
  trip: number;
  taxi: number;
  contingency: number;
  alternate: number;
  finalReserve: number;
  minDiversion: number;
  totalRequired: number;
  fuelOnBoard?: number;
  remaining?: number;
  deficit?: number;
  alert: boolean;
}

export interface FormulaMeta {
  id: string;
  version: string;
  source: string;
  nature: 'educational' | 'approximate' | 'operational';
  certainty: CertaintyLevel;
  formula: string;
  assumptions: string[];
}

export interface Source {
  topic: string;
  name: string;
  type: 'regulatory' | 'technical' | 'educational' | 'performance' | 'complementary';
  doc: string;
  url: string;
  section?: string;
  consultedAt: string;
  reliability: string;
}

export interface WarningMessage {
  id: string;
  text: string;
  level: 'info' | 'caution' | 'warning';
  location: string;
  blocking: boolean;
}

export interface HistoryEntry {
  id: string;
  module: string;
  timestamp: string;
  input: unknown;
  result: unknown;
}
