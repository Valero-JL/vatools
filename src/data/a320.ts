export interface A320Memo {
  text: string;
  call?: boolean; // ◁ señal de llamada PM
}

export interface A320ChecklistItem {
  id: string;
  label: string;
  action: string;
  call?: boolean;
  memos?: A320Memo[];
}

export interface A320ChecklistStep {
  id: string;
  title: string;
  /** Condicionales << ... >> → C/L COMPLETE & RESET */
  resetOnComplete: boolean;
  items: A320ChecklistItem[];
}

export type A320BriefingCell =
  | { span: 'both'; text: string; threatsLink?: boolean }
  | { pf?: string; pm?: string; pfThreatsLink?: boolean; pmThreatsLink?: boolean };

export interface A320BriefingRow {
  step: string;
  cell: A320BriefingCell;
}

export interface A320ThreatCategory {
  id: string;
  title: string;
  items: string[];
}

export const A320_CHECKLIST_STEPS: A320ChecklistStep[] = [
  {
    id: 'cockpit-preparation',
    title: 'COCKPIT PREPARATION',
    resetOnComplete: false,
    items: [
      { id: 'cp-1', label: 'GEAR PINS & COVERS', action: 'REMOVED' },
      { id: 'cp-2', label: 'FUEL QUANTITY', action: '____ KG/LB' },
      { id: 'cp-3', label: 'SEAT BELTS', action: 'ON' },
      { id: 'cp-4', label: 'ADIRS', action: 'NAV' },
      { id: 'cp-5', label: 'BARO REF', action: '____ (BOTH)' },
    ],
  },
  {
    id: 'rnp-ar-dep-1',
    title: '<< IF RNP AR DEPARTURE >>',
    resetOnComplete: true,
    items: [{ id: 'rnp1-1', label: 'RADIONAV POSITION', action: 'DESELECTED' }],
  },
  {
    id: 'before-start',
    title: 'BEFORE START',
    resetOnComplete: false,
    items: [
      { id: 'bs-1', label: 'PARKING BRAKE', action: '____' },
      { id: 'bs-2', label: 'T.O SPEEDS & THRUST', action: '____ (BOTH)' },
      { id: 'bs-3', label: 'WINDOWS', action: 'CLOSED (BOTH)' },
      { id: 'bs-4', label: 'BEACON', action: 'ON' },
    ],
  },
  {
    id: 'after-start',
    title: 'AFTER START',
    resetOnComplete: false,
    items: [
      { id: 'as-1', label: 'ANTI ICE', action: '____' },
      { id: 'as-2', label: 'ECAM STATUS', action: 'CHECKED' },
      { id: 'as-3', label: 'PITCH TRIM', action: '____ %' },
      { id: 'as-4', label: 'RUDDER TRIM', action: 'NEUTRAL' },
    ],
  },
  {
    id: 'taxi',
    title: 'TAXI',
    resetOnComplete: false,
    items: [
      { id: 'tx-1', label: 'FLIGHT CONTROLS', action: 'CHECKED (BOTH)' },
      { id: 'tx-2', label: 'FLAPS SETTING', action: 'CONF ____ (BOTH)' },
      { id: 'tx-3', label: 'RADAR & PRED W/S', action: 'ON & AUTO' },
      { id: 'tx-4', label: 'ENG MODE SEL', action: '____' },
      {
        id: 'tx-5',
        label: 'ECAM MEMO',
        action: 'T.O NO BLUE',
        memos: [
          { text: 'AUTO BRK MAX' },
          { text: 'SEAT BELTS ON' },
          { text: 'CABIN READY', call: true },
          { text: 'SPLRS ARM' },
          { text: 'FLAPS T.O' },
          { text: 'T.O CONFIG NORMAL' },
        ],
      },
      { id: 'tx-6', label: 'CABIN', action: 'READY' },
    ],
  },
  {
    id: 'line-up',
    title: 'LINE-UP',
    resetOnComplete: false,
    items: [
      { id: 'lu-1', label: 'T.O RWY', action: '____ (BOTH)' },
      { id: 'lu-2', label: 'TCAS', action: '____' },
      { id: 'lu-3', label: 'PACKS 1 & 2', action: '____' },
    ],
  },
  {
    id: 'rnp-ar-dep-2',
    title: '<< IF RNP AR DEPARTURE >>',
    resetOnComplete: true,
    items: [{ id: 'rnp2-1', label: 'RADIONAV POSITION', action: 'DESELECTED' }],
  },
  {
    id: 'departure-change',
    title: '<< DEPARTURE CHANGE >>',
    resetOnComplete: true,
    items: [
      { id: 'dc-1', label: 'RWY & SID', action: '____' },
      { id: 'dc-2', label: 'FLAPS SETTING', action: 'CONF ____ (BOTH)' },
      { id: 'dc-3', label: 'T.O SPEEDS & THRUST', action: '____ (BOTH)' },
      { id: 'dc-4', label: 'FCU ALT', action: '____' },
    ],
  },
  {
    id: 'approach',
    title: 'APPROACH',
    resetOnComplete: false,
    items: [
      { id: 'ap-1', label: 'BARO REF', action: '____ (BOTH)' },
      { id: 'ap-2', label: 'SEAT BELTS', action: 'ON' },
      { id: 'ap-3', label: 'MINIMUM', action: '____' },
      { id: 'ap-4', label: 'AUTO BRAKE', action: '____' },
      { id: 'ap-5', label: 'ENG MODE SEL', action: '____' },
    ],
  },
  {
    id: 'rnp-ar-app',
    title: '<< IF RNP AR APP >>',
    resetOnComplete: true,
    items: [
      { id: 'rnpapp-1', label: 'RADIO NAV POSITION', action: 'DESELECTED' },
      { id: 'rnpapp-2', label: 'GPS 1 + 2', action: 'BOTH IN NAV or SBAS', call: true },
    ],
  },
  {
    id: 'landing',
    title: 'LANDING',
    resetOnComplete: false,
    items: [
      {
        id: 'ld-1',
        label: 'ECAM MEMO',
        action: 'LDG NO BLUE',
        memos: [
          { text: 'LDG GEAR DN' },
          { text: 'SEAT BELTS ON' },
          { text: 'CABIN READY', call: true },
          { text: 'SPLRS ARM' },
          { text: 'FLAPS FULL or CONF 3' },
        ],
      },
      { id: 'ld-2', label: 'CABIN', action: 'READY' },
    ],
  },
  {
    id: 'after-landing',
    title: 'AFTER LANDING',
    resetOnComplete: false,
    items: [{ id: 'al-1', label: 'RADAR & PRED W/S', action: 'OFF' }],
  },
  {
    id: 'parking',
    title: 'PARKING',
    resetOnComplete: false,
    items: [
      { id: 'pk-1', label: 'PARKING BRAKE OR CHOCKS', action: '____ SET' },
      { id: 'pk-2', label: 'ENGINES', action: 'OFF' },
      { id: 'pk-3', label: 'FUEL PUMPS', action: 'OFF' },
      { id: 'pk-4', label: 'YELLOW ELEC PUMP', action: 'OFF' },
    ],
  },
  {
    id: 'securing',
    title: 'SECURING THE AIRCRAFT',
    resetOnComplete: false,
    items: [
      { id: 'sc-1', label: 'OXYGEN', action: 'OFF' },
      { id: 'sc-2', label: 'EMER EXIT LT', action: 'OFF' },
      { id: 'sc-3', label: 'BATTERIES', action: 'OFF' },
    ],
  },
];

export const A320_DEPARTURE_BRIEFING: A320BriefingRow[] = [
  {
    step: '1',
    cell: {
      span: 'both',
      text: 'Cockpit door closed - Set an environment with no distraction (1)',
    },
  },
  {
    step: '2a',
    cell: {
      pm: 'Plan (2) — T.O RWY (Intersection) · SID designator · First cleared altitude · MSA/MORA for climb trajectory · Extra fuel and time',
    },
  },
  {
    step: '2b',
    cell: {
      pf: 'Plan (2) — Hotspots for taxi out · Stop margin for RTO · EOSID · Return/diversion considerations · Special operation · Non-standard operation',
    },
  },
  {
    step: '3a',
    cell: { pm: 'Identified THREATS (3)', pmThreatsLink: true },
  },
  {
    step: '3b',
    cell: { pf: 'Identified THREATS (3)', pfThreatsLink: true },
  },
  {
    step: '4',
    cell: { span: 'both', text: 'MITIGATIONS (4)' },
  },
  {
    step: '5',
    cell: { span: 'both', text: 'MISCELLANEOUS (5)' },
  },
];

export const A320_ARRIVAL_BRIEFING: A320BriefingRow[] = [
  {
    step: '1',
    cell: { span: 'both', text: 'Set an environment with no distraction (1)' },
  },
  {
    step: '2a',
    cell: {
      pm: 'Plan (2) — STAR/Transition Designator · MORA/MOCA/MSA for planned trajectory · Runway and type of approach · Approach minimum · Go-around trajectory · Extra fuel and time',
    },
  },
  {
    step: '2b',
    cell: {
      pf: 'Plan (2) — Guidance for approach · Landing flaps setting · Stop margin · Use of reverse thrust · Use of autobrake · Planned runway exit · Hotspots for taxi-in · Special operation · Non-standard operation',
    },
  },
  {
    step: '3a',
    cell: { pm: 'Identified THREATS (3)', pmThreatsLink: true },
  },
  {
    step: '3b',
    cell: { pf: 'Identified THREATS (3)', pfThreatsLink: true },
  },
  {
    step: '4',
    cell: { span: 'both', text: 'MITIGATIONS (4)' },
  },
  {
    step: '5',
    cell: { span: 'both', text: 'MISCELLANEOUS (5)' },
  },
];

export const A320_THREAT_CATEGORIES: A320ThreatCategory[] = [
  {
    id: 'airport',
    title: 'AIRPORT',
    items: ['Congestion', 'Construction', 'Hotspots', 'Infrastructure', 'Runway condition'],
  },
  {
    id: 'atc',
    title: 'ATC',
    items: [
      'Challenging restrictions',
      'Language',
      'Phraseology',
      'Short term changes of clearance',
      'Barometric setting for approaches based on barometric guidance',
    ],
  },
  {
    id: 'aircraft',
    title: 'AIRCRAFT',
    items: ['MEL/CDL', 'Aircraft defects', 'Supplementary procedures that are not routine'],
  },
  {
    id: 'environment',
    title: 'ENVIRONMENT',
    items: ['Low visibility', 'Approach/runway lighting', 'Runway contamination'],
  },
  {
    id: 'weather',
    title: 'WEATHER',
    items: [
      'Windshear',
      'Convective weather',
      'Cold weather',
      'Precipitation',
      'Unreliable weather reports',
    ],
  },
  {
    id: 'operations',
    title: 'OPERATIONS',
    items: ['Schedule pressure', 'Delays', 'Late crew', 'Load issues'],
  },
  {
    id: 'crew',
    title: 'CREW',
    items: [
      'Fatigue',
      'Low experience',
      'Complacency',
      'Distraction',
      'Training',
      'Crew that is not standard',
    ],
  },
  {
    id: 'terrain',
    title: 'TERRAIN',
    items: ['High terrain', 'Unfamiliar environment', 'Complex visual approach'],
  },
];

/** Notas de referencia (plantilla estándar; (3) = pantalla THREATS). */
export const A320_BRIEFING_NOTES = [
  {
    n: 1,
    text: 'If interrupted, the briefing should resume at the beginning of the step where the interruption occurred.',
  },
  {
    n: 2,
    text: 'PF starts to brief after the BOX preparation Checked and check (by PM).',
  },
  {
    n: 3,
    text: 'Identified THREATS — open the THREATS reference screen (indicative only).',
  },
  {
    n: 4,
    text: 'The PF and PM discuss and agree on the MITIGATION of the identified threats.',
  },
  {
    n: 5,
    text: 'MISCELLANEOUS is intended to consider additional items (e.g. special operations, supplementary procedures).',
  },
] as const;
