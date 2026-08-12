export type ChecklistLine =
  | { kind: 'item'; id: string; label: string; action: string }
  | { kind: 'callout'; text: string }
  | { kind: 'subtitle'; text: string };

export interface ChecklistBlock {
  id: string;
  title: string;
  accent?: 'emergency';
  lines: ChecklistLine[];
}

export type BriefingCell =
  | { span: 'both'; text: string }
  | { pf?: string; pm?: string };

export interface BriefingRow {
  id: string;
  step: string;
  cell: BriefingCell;
}

export interface BriefingTable {
  id: string;
  title: string;
  rows: BriefingRow[];
  notes: { n: number; text: string }[];
}

export const CHECKLIST_BLOCKS: ChecklistBlock[] = [
  {
    id: 'cockpit-preparation',
    title: 'COCKPIT PREPARATION',
    lines: [
      { kind: 'item', id: 'cp-1', label: 'Gear pins and covers', action: 'REMOVED' },
      { kind: 'item', id: 'cp-2', label: 'Fuel quantity', action: '_____ KG/LB' },
      { kind: 'item', id: 'cp-3', label: 'Seat Belts', action: 'ON' },
      { kind: 'item', id: 'cp-4', label: 'Baro ref', action: '_____ (BOTH)' },
    ],
  },
  {
    id: 'before-start',
    title: 'BEFORE START',
    lines: [
      { kind: 'item', id: 'bs-1', label: 'Parking brake', action: '_____' },
      { kind: 'item', id: 'bs-2', label: 'Windows', action: 'CLOSE (BOTH)' },
      { kind: 'item', id: 'bs-3', label: 'T.O Speeds & Thrust', action: '_____ (BOTH)' },
      { kind: 'item', id: 'bs-4', label: 'Beacon', action: 'ON' },
    ],
  },
  {
    id: 'after-start',
    title: 'AFTER START',
    lines: [
      { kind: 'item', id: 'as-1', label: 'Anti ice', action: '_____' },
      { kind: 'item', id: 'as-2', label: 'Annunciator Lights', action: 'CHECKED' },
      { kind: 'item', id: 'as-3', label: 'Pitch trim', action: '_____ %' },
      { kind: 'item', id: 'as-4', label: 'Rudder trim', action: 'NEUTRAL' },
    ],
  },
  {
    id: 'taxi',
    title: 'TAXI',
    lines: [
      { kind: 'item', id: 'tx-1', label: 'Flight controls', action: 'CHECKED (BOTH)' },
      { kind: 'item', id: 'tx-2', label: 'Flt / engine inst', action: 'CHECKED (BOTH)' },
      { kind: 'item', id: 'tx-3', label: 'Flap setting', action: 'CONF _____ (BOTH)' },
      { kind: 'item', id: 'tx-4', label: 'Auto feather', action: 'ARMED' },
      { kind: 'item', id: 'tx-5', label: 'Pressurization', action: 'SET' },
      { kind: 'item', id: 'tx-6', label: 'Cabin', action: 'READY' },
    ],
  },
  {
    id: 'line-up',
    title: 'LINE-UP',
    lines: [
      { kind: 'item', id: 'lu-1', label: 'T.O RWY', action: '_____ (BOTH)' },
      { kind: 'item', id: 'lu-2', label: 'TCAS', action: 'AS RQRD' },
      { kind: 'item', id: 'lu-3', label: 'Bleed air valves', action: 'AS RQRD' },
      { kind: 'item', id: 'lu-4', label: 'Ext lights', action: 'AS RQRD' },
    ],
  },
  {
    id: 'after-takeoff-climb',
    title: 'AFTER TAKEOFF / CLIMB',
    lines: [
      { kind: 'item', id: 'at-1', label: 'LDG gear', action: 'UP' },
      { kind: 'item', id: 'at-2', label: 'Flaps', action: 'RETRACTED' },
      { kind: 'item', id: 'at-3', label: 'Climb power', action: 'SET' },
      { kind: 'item', id: 'at-4', label: 'Ext lights', action: 'AS RQRD' },
      { kind: 'item', id: 'at-5', label: 'Auto feather', action: 'OFF' },
      { kind: 'item', id: 'at-6', label: 'Pressurization', action: 'CHECKED' },
    ],
  },
  {
    id: 'departure-change',
    title: '<<DEPARTURE CHANGE>>',
    lines: [
      { kind: 'item', id: 'dc-1', label: 'Briefing', action: 'CONFIRMED' },
      { kind: 'item', id: 'dc-2', label: 'Auto feather', action: 'ARMED' },
      { kind: 'item', id: 'dc-3', label: 'Seat belts', action: 'ON' },
      { kind: 'item', id: 'dc-4', label: 'Pressurization', action: 'SET' },
      { kind: 'item', id: 'dc-5', label: 'Baro ref', action: 'SET (BOTH)' },
      { kind: 'item', id: 'dc-6', label: 'Minimum', action: '_____ CHECKED (BOTH)' },
    ],
  },
  {
    id: 'approach',
    title: 'APPROACH',
    lines: [
      { kind: 'item', id: 'ap-1', label: 'Baro ref', action: '_____ (BOTH)' },
      { kind: 'item', id: 'ap-2', label: 'Seat belts', action: 'ON' },
      { kind: 'item', id: 'ap-3', label: 'Minimum', action: '_____' },
      { kind: 'item', id: 'ap-4', label: 'Pressurization', action: 'SET' },
      { kind: 'item', id: 'ap-5', label: 'Auto Feather', action: 'ARMED' },
    ],
  },
  {
    id: 'landing',
    title: 'LANDING',
    lines: [
      { kind: 'item', id: 'ld-1', label: 'Ldg gear', action: 'DN' },
      { kind: 'item', id: 'ld-2', label: 'Signs', action: 'ON' },
      { kind: 'item', id: 'ld-3', label: 'Cabin', action: 'READY' },
      { kind: 'item', id: 'ld-4', label: 'Flaps', action: 'SET' },
    ],
  },
  {
    id: 'after-landing',
    title: 'AFTER LANDING',
    lines: [
      { kind: 'item', id: 'al-1', label: 'Flaps', action: 'RETRACTED' },
      { kind: 'item', id: 'al-2', label: 'Ice protection', action: 'OFF' },
      { kind: 'item', id: 'al-3', label: 'Transponder', action: 'OFF' },
      { kind: 'item', id: 'al-4', label: 'Ext lights', action: 'AS RQRD' },
      { kind: 'item', id: 'al-5', label: 'Trim', action: 'ZERO' },
    ],
  },
  {
    id: 'parking',
    title: 'PARKING',
    lines: [
      { kind: 'item', id: 'pk-1', label: 'Avionics master', action: 'OFF' },
      { kind: 'item', id: 'pk-2', label: 'Inverter', action: 'OFF' },
      { kind: 'item', id: 'pk-3', label: 'Auto feather', action: 'OFF' },
      { kind: 'item', id: 'pk-4', label: 'Lights', action: 'OFF' },
      { kind: 'item', id: 'pk-5', label: 'Itt', action: 'STABILIZED 1MIN' },
      { kind: 'item', id: 'pk-6', label: 'Cond levers', action: 'CUTOFF' },
      { kind: 'item', id: 'pk-7', label: 'Prop levers', action: 'FEATHER' },
      { kind: 'item', id: 'pk-8', label: 'Batt and gen switches', action: 'OFF' },
      { kind: 'item', id: 'pk-9', label: 'Seat belts', action: 'OFF' },
      { kind: 'item', id: 'pk-10', label: 'Park brk and chocks', action: 'AS RQRD' },
    ],
  },
  {
    id: 'emergency-evacuation',
    title: 'EMERGENCY EVACUATION',
    accent: 'emergency',
    lines: [
      { kind: 'item', id: 'ee-1', label: 'AIRCRAFT/PARKING BRK', action: 'STOP/ON' },
      { kind: 'item', id: 'ee-2', label: 'ATC (VHF1)', action: 'NOTIFY' },
      { kind: 'item', id: 'ee-3', label: 'CABIN CREW (PA)', action: 'ALERT' },
      { kind: 'callout', text: '("ATENCIÓN, TRIPULACIÓN EN SUS ESTACIONES")' },
      { kind: 'item', id: 'ee-4', label: 'PWR LEVERS', action: 'IDLE' },
      { kind: 'item', id: 'ee-5', label: 'PROP LEVERS', action: 'FEATHER' },
      { kind: 'item', id: 'ee-6', label: 'COND LEVERS', action: 'CUTOFF' },
      { kind: 'item', id: 'ee-7', label: 'BOTH EXTINGUISHER', action: 'PUSH' },
      { kind: 'subtitle', text: 'If evacuation required' },
      { kind: 'item', id: 'ee-8', label: 'EVACUATION', action: 'INITIATE' },
      { kind: 'callout', text: '("EVACUAR, EVACUAR, EVACUAR")' },
      { kind: 'subtitle', text: 'If evacuation not required' },
      { kind: 'item', id: 'ee-9', label: 'CABIN CREW and PASSENGERS (PA)', action: 'NOTIFY' },
      { kind: 'callout', text: '("SITUACIÓN CONTROLADA")' },
    ],
  },
];

export const BRIEFING_TABLES: BriefingTable[] = [
  {
    id: 'departure',
    title: 'DEPARTURE BRIEFING',
    rows: [
      {
        id: 'dep-1',
        step: '1',
        cell: {
          span: 'both',
          text: 'Cockpit door closed - Set an environment with no distraction (1)',
        },
      },
      {
        id: 'dep-2a',
        step: '2a',
        cell: {
          pf: 'Plan (2): Taxi route (Hotspot) · SID Chart Briefing · Emergency/EOSID · Return/Diversion considerations (Weather/weight) · Non-Standard Operation',
        },
      },
      {
        id: 'dep-2b',
        step: '2b',
        cell: {
          pm: 'Plan (2): First Cleared altitude · MSA/MRA for climb trayectory · Extra fuel and time',
        },
      },
      {
        id: 'dep-3a',
        step: '3a',
        cell: { pm: 'Identified THREATS (3)' },
      },
      {
        id: 'dep-3b',
        step: '3b',
        cell: { pf: 'Identified THREATS (3)' },
      },
      {
        id: 'dep-4',
        step: '4',
        cell: { span: 'both', text: 'MITIGATIONS (4)' },
      },
      {
        id: 'dep-5',
        step: '5',
        cell: { span: 'both', text: 'MISCELLANEOUS (5)' },
      },
    ],
    notes: [
      {
        n: 1,
        text: 'If interrupted, the briefing should resume at the beginning of the step where the interruption occurred.',
      },
      {
        n: 2,
        text: 'PF starts to brief after the BOX preparation Checked and check (by PM). The PF recalls any Special Operations or Supplementary procedures to be applied.',
      },
      {
        n: 3,
        text: 'The PM should brief THREATS identified throughout the preparation for the mission. The PF highlights additional threats if required.',
      },
      {
        n: 4,
        text: 'The PF and PM discuss and agree on the MITIGATION of the identified threats.',
      },
      {
        n: 5,
        text: 'MISCELLANEOUS is intended to consider additional items e.g.: Observer safety briefing and duties · Dangerous goods on board.',
      },
    ],
  },
  {
    id: 'arrival',
    title: 'ARRIVAL BRIEFING',
    rows: [
      {
        id: 'arr-1',
        step: '1',
        cell: { span: 'both', text: 'Set an environment with no distraction (1)' },
      },
      {
        id: 'arr-2a',
        step: '2a',
        cell: {
          pf: 'Plan (2): STAR chart Briefing · IAC chart Briefing · Extra fuel and time · Non-Standard Operation',
        },
      },
      {
        id: 'arr-2b',
        step: '2b',
        cell: {
          pm: 'Plan (2): Guidance for approach · Landing flaps setting · Planned runway exit · Hotspots for taxi-in',
        },
      },
      {
        id: 'arr-3a',
        step: '3a',
        cell: { pm: 'Identified THREATS (3)' },
      },
      {
        id: 'arr-3b',
        step: '3b',
        cell: { pf: 'Identified THREATS (3)' },
      },
      {
        id: 'arr-4',
        step: '4',
        cell: { span: 'both', text: 'MITIGATIONS (4)' },
      },
      {
        id: 'arr-5',
        step: '5',
        cell: { span: 'both', text: 'MISCELLANEOUS (5)' },
      },
    ],
    notes: [
      {
        n: 1,
        text: 'Allocating the right time before top of descent mitigates potential disturbances. If interrupted, the briefing should resume at the beginning of the step where the interruption occurred.',
      },
      {
        n: 2,
        text: 'PF starts to brief after the BOX preparation Checked and check (by PM). The PF briefs what the PF considers for landing.',
      },
      {
        n: 3,
        text: 'The PM should brief the THREATS they have identified. The PF highlights additional threats if required.',
      },
      {
        n: 4,
        text: 'The PF and PM discuss and agree on the MITIGATION of the identified threats.',
      },
      {
        n: 5,
        text: 'MISCELLANEOUS is intended to consider additional items e.g.: Special Operations · Supplementary Procedures if not yet briefed.',
      },
    ],
  },
];

export function getChecklistItemIds(): string[] {
  return CHECKLIST_BLOCKS.flatMap((block) =>
    block.lines.filter((l): l is Extract<ChecklistLine, { kind: 'item' }> => l.kind === 'item').map((l) => l.id),
  );
}

export function getBriefingRowIds(): string[] {
  return BRIEFING_TABLES.flatMap((t) => t.rows.map((r) => r.id));
}
