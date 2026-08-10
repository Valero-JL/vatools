import { useState } from 'react';
import type { WarningMessage } from '../models/types';
import styles from './WarningBanner.module.css';

interface Props {
  warning: WarningMessage;
  compact?: boolean;
}

export function WarningBanner({ warning, compact }: Props) {
  const [open, setOpen] = useState(true);
  if (!open && !warning.blocking) {
    return (
      <button type="button" className={styles.showAgain} onClick={() => setOpen(true)}>
        Mostrar aviso
      </button>
    );
  }

  return (
    <aside
      className={`${styles.banner} ${styles[warning.level]} ${compact ? styles.compact : ''}`}
      role={warning.level === 'warning' ? 'alert' : 'status'}
      aria-live={warning.blocking ? 'assertive' : 'polite'}
    >
      <div className={styles.icon} aria-hidden>
        {warning.level === 'warning' ? '⛔' : warning.level === 'caution' ? '⚠️' : 'ℹ️'}
      </div>
      <p className={styles.text}>{warning.text}</p>
      {!warning.blocking && (
        <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Cerrar aviso">
          ×
        </button>
      )}
    </aside>
  );
}
