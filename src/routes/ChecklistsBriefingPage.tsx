import { useMemo, useState } from 'react';
import { ModulePage, Panel, SecondaryButton } from '../components/ModulePage';
import {
  BRIEFING_TABLES,
  CHECKLIST_BLOCKS,
  type BriefingRow,
  type ChecklistBlock,
  type ChecklistLine,
  getBriefingRowIds,
  getChecklistItemIds,
} from '../data/checklistsBriefing';
import styles from './ChecklistsBriefingPage.module.css';

type Tab = 'checklist' | 'briefing';

function blockProgress(block: ChecklistBlock, checked: Record<string, boolean>) {
  const ids = block.lines
    .filter((l): l is Extract<ChecklistLine, { kind: 'item' }> => l.kind === 'item')
    .map((l) => l.id);
  const done = ids.filter((id) => checked[id]).length;
  return { done, total: ids.length };
}

export function ChecklistsBriefingPage() {
  const [tab, setTab] = useState<Tab>('checklist');
  const [checklistChecked, setChecklistChecked] = useState<Record<string, boolean>>({});
  const [briefingChecked, setBriefingChecked] = useState<Record<string, boolean>>({});

  const checklistIds = useMemo(() => getChecklistItemIds(), []);
  const briefingIds = useMemo(() => getBriefingRowIds(), []);

  const checklistDone = checklistIds.filter((id) => checklistChecked[id]).length;
  const briefingDone = briefingIds.filter((id) => briefingChecked[id]).length;

  const toggleChecklist = (id: string) => {
    setChecklistChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBriefing = (id: string) => {
    setBriefingChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ModulePage
      title="Checklists y Briefing"
      subtitle="Lista de verificación de aeronave y briefings de salida/llegada (PF / PM). Referencia educativa — no reemplaza el checklist oficial de la aeronave."
    >
      <div className={styles.tabs} role="tablist" aria-label="Checklists y Briefing">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'checklist'}
          className={`${styles.tab} ${tab === 'checklist' ? styles.tabActive : ''}`}
          onClick={() => setTab('checklist')}
        >
          Checklist
          <span className={styles.tabMeta}>
            {checklistDone}/{checklistIds.length}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'briefing'}
          className={`${styles.tab} ${tab === 'briefing' ? styles.tabActive : ''}`}
          onClick={() => setTab('briefing')}
        >
          Briefing
          <span className={styles.tabMeta}>
            {briefingDone}/{briefingIds.length}
          </span>
        </button>
      </div>

      {tab === 'checklist' ? (
        <div role="tabpanel" className={styles.panelStack}>
          <Panel>
            <div className={styles.toolbar}>
              <p className={styles.progressGlobal}>
                Progreso total: <strong className="mono">{checklistDone}</strong> /{' '}
                <strong className="mono">{checklistIds.length}</strong>
              </p>
              <SecondaryButton onClick={() => setChecklistChecked({})}>
                Reiniciar checklist
              </SecondaryButton>
            </div>
          </Panel>

          {CHECKLIST_BLOCKS.map((block) => {
            const { done, total } = blockProgress(block, checklistChecked);
            return (
              <section
                key={block.id}
                className={`${styles.block} ${block.accent === 'emergency' ? styles.blockEmergency : ''}`}
              >
                <header className={styles.blockHeader}>
                  <h2>{block.title}</h2>
                  <span className={styles.blockProgress}>
                    {done}/{total}
                  </span>
                </header>
                <ul className={styles.itemList}>
                  {block.lines.map((line, idx) => (
                    <ChecklistLineView
                      key={line.kind === 'item' ? line.id : `${block.id}-${line.kind}-${idx}`}
                      line={line}
                      checked={line.kind === 'item' ? !!checklistChecked[line.id] : false}
                      onToggle={toggleChecklist}
                      emergency={block.accent === 'emergency'}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <div role="tabpanel" className={styles.panelStack}>
          <Panel>
            <div className={styles.toolbar}>
              <p className={styles.progressGlobal}>
                Progreso briefings: <strong className="mono">{briefingDone}</strong> /{' '}
                <strong className="mono">{briefingIds.length}</strong>
              </p>
              <SecondaryButton onClick={() => setBriefingChecked({})}>
                Reiniciar briefing
              </SecondaryButton>
            </div>
          </Panel>

          {BRIEFING_TABLES.map((table) => (
            <section key={table.id} className={styles.briefingSection}>
              <header className={styles.blockHeader}>
                <h2>{table.title}</h2>
              </header>
              <div className={styles.tableWrap}>
                <table className={styles.briefingTable}>
                  <thead>
                    <tr>
                      <th scope="col" className={styles.colCheck} aria-label="Completado" />
                      <th scope="col" className={styles.colStep}>
                        Step
                      </th>
                      <th scope="col">PF</th>
                      <th scope="col">PM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row) => (
                      <BriefingRowView
                        key={row.id}
                        row={row}
                        checked={!!briefingChecked[row.id]}
                        onToggle={toggleBriefing}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <ol className={styles.notes}>
                {table.notes.map((note) => (
                  <li key={note.n}>
                    <span className={styles.noteNum}>{note.n}.</span> {note.text}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </ModulePage>
  );
}

function ChecklistLineView({
  line,
  checked,
  onToggle,
  emergency,
}: {
  line: ChecklistLine;
  checked: boolean;
  onToggle: (id: string) => void;
  emergency?: boolean;
}) {
  if (line.kind === 'callout') {
    return (
      <li className={`${styles.callout} ${emergency ? styles.calloutEmergency : ''}`}>
        {line.text}
      </li>
    );
  }

  if (line.kind === 'subtitle') {
    return <li className={styles.subtitle}>{line.text}</li>;
  }

  return (
    <li className={`${styles.item} ${checked ? styles.itemDone : ''}`}>
      <label className={styles.itemLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          onChange={() => onToggle(line.id)}
        />
        <span className={styles.itemText}>
          <span className={styles.itemLeft}>{line.label}</span>
          <span className={styles.dots} aria-hidden />
          <span className={styles.itemRight}>{line.action}</span>
        </span>
      </label>
    </li>
  );
}

function BriefingRowView({
  row,
  checked,
  onToggle,
}: {
  row: BriefingRow;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  const { cell } = row;
  const doneClass = checked ? styles.itemDone : '';

  return (
    <tr className={`${styles.briefingRow} ${doneClass}`}>
      <td className={styles.colCheck}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          onChange={() => onToggle(row.id)}
          aria-label={`Completar paso ${row.step}`}
        />
      </td>
      <td className={styles.colStep}>
        <span className={styles.stepBadge}>{row.step}</span>
      </td>
      {'span' in cell && cell.span === 'both' ? (
        <td colSpan={2} className={styles.cellBoth}>
          {cell.text}
        </td>
      ) : (
        <>
          <td className={styles.cellPf}>{'pf' in cell ? (cell.pf ?? '') : ''}</td>
          <td className={styles.cellPm}>{'pm' in cell ? (cell.pm ?? '') : ''}</td>
        </>
      )}
    </tr>
  );
}
