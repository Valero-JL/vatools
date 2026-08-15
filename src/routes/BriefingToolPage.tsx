import { useState } from 'react';
import { ModulePage } from '../components/ModulePage';
import { BRIEFING_TOOL_ENTRIES, type BriefingLink } from '../data/briefingTool';
import styles from './BriefingToolPage.module.css';

export function BriefingToolPage() {
  const [awosOpen, setAwosOpen] = useState(false);

  if (awosOpen) {
    const awos = BRIEFING_TOOL_ENTRIES.find((e) => e.id === 'awos');
    const links = awos?.kind === 'submenu' ? awos.children : [];

    return (
      <ModulePage
        title="Briefing Tool"
        subtitle="Enlaces operativos de consulta (EFPL, NOTAM, meteorología, AWOS, RAC). Se abren en una pestaña nueva."
      >
        <div className={styles.stack}>
          <div className={styles.topBar}>
            <button type="button" className={styles.backBtn} onClick={() => setAwosOpen(false)}>
              ← Briefing Tool
            </button>
            <h2 className={styles.subTitle}>AWOS – METEOROLOGÍA</h2>
          </div>
          <p className={styles.hint}>Selecciona la estación AWOS. El enlace se abre en una pestaña nueva.</p>
          <nav className={styles.list} aria-label="Estaciones AWOS">
            {links.map((link) => (
              <ExternalLinkButton key={link.id} link={link} />
            ))}
          </nav>
        </div>
      </ModulePage>
    );
  }

  return (
    <ModulePage
      title="Briefing Tool"
      subtitle="Enlaces operativos de consulta (EFPL, NOTAM, meteorología, AWOS, RAC). Se abren en una pestaña nueva."
    >
      <div className={styles.stack}>
        <nav className={styles.list} aria-label="Briefing Tool">
          {BRIEFING_TOOL_ENTRIES.map((entry) => {
            if (entry.kind === 'submenu') {
              return (
                <button
                  key={entry.id}
                  type="button"
                  className={`${styles.btn} ${styles.btnSubmenu}`}
                  onClick={() => setAwosOpen(true)}
                >
                  <span>{entry.label}</span>
                  <span className={styles.meta}>{entry.children.length} estaciones →</span>
                </button>
              );
            }

            return <ExternalLinkButton key={entry.id} link={entry} />;
          })}
        </nav>
      </div>
    </ModulePage>
  );
}

function ExternalLinkButton({ link }: { link: BriefingLink }) {
  return (
    <a
      className={styles.btn}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{link.label}</span>
      <span className={styles.meta} aria-hidden>
        ↗
      </span>
    </a>
  );
}
