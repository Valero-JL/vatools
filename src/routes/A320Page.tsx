import { useMemo, useState } from 'react';
import { ModulePage } from '../components/ModulePage';
import {
  A320_ARRIVAL_BRIEFING,
  A320_BRIEFING_NOTES,
  A320_CHECKLIST_STEPS,
  A320_DEPARTURE_BRIEFING,
  A320_THREAT_CATEGORIES,
  type A320BriefingRow,
  type A320ChecklistStep,
} from '../data/a320';
import styles from './A320Page.module.css';

type MainMenu = 'home' | 'checklist' | 'briefing';
type BriefingScreen = 'menu' | 'departure' | 'threats' | 'arrival';

export function A320Page() {
  const [main, setMain] = useState<MainMenu>('home');
  const [stepId, setStepId] = useState<string | null>(null);
  const [briefingScreen, setBriefingScreen] = useState<BriefingScreen>('menu');
  const [threatsReturnTo, setThreatsReturnTo] = useState<Exclude<BriefingScreen, 'threats'>>('menu');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const activeStep = useMemo(
    () => A320_CHECKLIST_STEPS.find((s) => s.id === stepId) ?? null,
    [stepId],
  );

  const openChecklist = () => {
    setMain('checklist');
    setStepId(null);
  };

  const openBriefing = () => {
    setMain('briefing');
    setBriefingScreen('menu');
    setThreatsReturnTo('menu');
  };

  const backToHome = () => {
    setMain('home');
    setStepId(null);
    setBriefingScreen('menu');
    setThreatsReturnTo('menu');
  };

  const openThreats = (from: Exclude<BriefingScreen, 'threats'>) => {
    setThreatsReturnTo(from);
    setBriefingScreen('threats');
  };

  const toggleItem = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completeStep = (step: A320ChecklistStep) => {
    if (step.resetOnComplete) {
      setChecked((prev) => {
        const next = { ...prev };
        for (const item of step.items) delete next[item.id];
        return next;
      });
    }
    setStepId(null);
  };

  return (
    <ModulePage
      title="A320"
      subtitle="Checklist y briefing A320 (referencia educativa). No reemplaza el QRH ni los procedimientos oficiales del operador."
    >
      <div className={styles.shell}>
        {main === 'home' && (
          <div className={styles.menuStack}>
            <p className={styles.menuIntro}>Selecciona un menú</p>
            <button type="button" className={styles.menuBtn} onClick={openChecklist}>
              A320 Checklist
            </button>
            <button type="button" className={styles.menuBtn} onClick={openBriefing}>
              A320 Briefing
            </button>
          </div>
        )}

        {main === 'checklist' && !activeStep && (
          <div className={styles.menuStack}>
            <div className={styles.topBar}>
              <button type="button" className={styles.backBtn} onClick={backToHome}>
                ← Menú A320
              </button>
              <h2 className={styles.screenTitle}>A320 Checklist</h2>
            </div>
            {A320_CHECKLIST_STEPS.map((step) => {
              const done = step.items.filter((i) => checked[i.id]).length;
              return (
                <button
                  key={step.id}
                  type="button"
                  className={`${styles.menuBtn} ${step.resetOnComplete ? styles.menuBtnConditional : ''}`}
                  onClick={() => setStepId(step.id)}
                >
                  <span>{step.title}</span>
                  <span className={styles.menuMeta}>
                    {done}/{step.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {main === 'checklist' && activeStep && (
          <ChecklistStepScreen
            step={activeStep}
            checked={checked}
            onToggle={toggleItem}
            onBack={() => setStepId(null)}
            onComplete={() => completeStep(activeStep)}
          />
        )}

        {main === 'briefing' && briefingScreen === 'menu' && (
          <div className={styles.menuStack}>
            <div className={styles.topBar}>
              <button type="button" className={styles.backBtn} onClick={backToHome}>
                ← Menú A320
              </button>
              <h2 className={styles.screenTitle}>A320 Briefing</h2>
            </div>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setBriefingScreen('departure')}
            >
              DEPARTURE BRIEFING
            </button>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => openThreats('menu')}
            >
              THREATS
            </button>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setBriefingScreen('arrival')}
            >
              ARRIVAL BRIEFING
            </button>
          </div>
        )}

        {main === 'briefing' && briefingScreen === 'departure' && (
          <BriefingTableScreen
            title="DEPARTURE BRIEFING"
            intro="The structure and minimum items of the departure briefing are:"
            rows={A320_DEPARTURE_BRIEFING}
            onBack={() => setBriefingScreen('menu')}
            onOpenThreats={() => openThreats('departure')}
          />
        )}

        {main === 'briefing' && briefingScreen === 'arrival' && (
          <BriefingTableScreen
            title="ARRIVAL BRIEFING"
            rows={A320_ARRIVAL_BRIEFING}
            onBack={() => setBriefingScreen('menu')}
            onOpenThreats={() => openThreats('arrival')}
          />
        )}

        {main === 'briefing' && briefingScreen === 'threats' && (
          <ThreatsScreen onBack={() => setBriefingScreen(threatsReturnTo)} />
        )}
      </div>
    </ModulePage>
  );
}

function ChecklistStepScreen({
  step,
  checked,
  onToggle,
  onBack,
  onComplete,
}: {
  step: A320ChecklistStep;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  onBack: () => void;
  onComplete: () => void;
}) {
  const activeId = step.items.find((i) => !checked[i.id])?.id ?? null;

  return (
    <div className={styles.stepScreen}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Pasos
        </button>
      </div>

      <header className={styles.stepHeader}>
        <h2>{step.title}</h2>
      </header>

      <ul className={styles.itemList}>
        {step.items.map((item) => {
          const done = !!checked[item.id];
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <label
                className={`${styles.item} ${done ? styles.itemDone : ''} ${active ? styles.itemActive : ''}`}
              >
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={done}
                  onChange={() => onToggle(item.id)}
                />
                <span className={styles.itemBody}>
                  <span className={styles.itemRow}>
                    <span className={styles.itemLabel}>{item.label}</span>
                    <span className={styles.dots} aria-hidden />
                    <span className={styles.itemAction}>
                      {item.action}
                      {item.call ? <span className={styles.call}> ◁</span> : null}
                    </span>
                  </span>
                  {item.memos && item.memos.length > 0 ? (
                    <ul className={styles.memoList}>
                      {item.memos.map((memo) => (
                        <li key={memo.text}>
                          - {memo.text}
                          {memo.call ? <span className={styles.call}> ◁</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <p className={styles.endMark}>// END</p>

      <button type="button" className={styles.completeBtn} onClick={onComplete}>
        {step.resetOnComplete ? 'C/L COMPLETE & RESET' : 'C/L COMPLETE'}
      </button>
    </div>
  );
}

function BriefingTableScreen({
  title,
  intro,
  rows,
  onBack,
  onOpenThreats,
}: {
  title: string;
  intro?: string;
  rows: A320BriefingRow[];
  onBack: () => void;
  onOpenThreats: () => void;
}) {
  return (
    <div className={styles.stepScreen}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Briefing
        </button>
      </div>

      <header className={styles.stepHeader}>
        <h2>{title}</h2>
      </header>

      {intro ? <p className={styles.intro}>{intro}</p> : null}

      <div className={styles.tableWrap}>
        <table className={styles.briefingTable}>
          <thead>
            <tr>
              <th scope="col" className={styles.colStep}>
                Step
              </th>
              <th scope="col">PF</th>
              <th scope="col">PM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.step}>
                <td className={styles.colStep}>{row.step}</td>
                {'span' in row.cell && row.cell.span === 'both' ? (
                  <td colSpan={2}>{row.cell.text}</td>
                ) : (
                  <>
                    <td>
                      {'pf' in row.cell && row.cell.pfThreatsLink ? (
                        <button type="button" className={styles.threatsLink} onClick={onOpenThreats}>
                          {row.cell.pf}
                        </button>
                      ) : (
                        ('pf' in row.cell ? row.cell.pf : '') || ''
                      )}
                    </td>
                    <td>
                      {'pm' in row.cell && row.cell.pmThreatsLink ? (
                        <button type="button" className={styles.threatsLink} onClick={onOpenThreats}>
                          {row.cell.pm}
                        </button>
                      ) : (
                        ('pm' in row.cell ? row.cell.pm : '') || ''
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ol className={styles.notes}>
        {A320_BRIEFING_NOTES.map((note) => (
          <li key={note.n}>
            <span className={styles.noteNum}>({note.n})</span> {note.text}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ThreatsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className={styles.stepScreen}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Briefing
        </button>
      </div>

      <header className={styles.stepHeader}>
        <h2>THREATS</h2>
      </header>

      <p className={styles.threatsSubtitle}>THREATS</p>
      <p className={styles.threatsHint}>
        Pantalla solo indicativa / de referencia — sin checkboxes.
      </p>

      <div className={styles.threatsGrid}>
        {A320_THREAT_CATEGORIES.map((cat) => (
          <section key={cat.id} className={styles.threatCard}>
            <h3>{cat.title}</h3>
            <ul>
              {cat.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
