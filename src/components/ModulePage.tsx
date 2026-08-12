import styles from './ModulePage.module.css';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function ModulePage({ title, subtitle, children }: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      {children}
    </div>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className={styles.panel}>
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}

export function Actions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={styles.primary} {...props} />;
}

export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={styles.secondary} {...props} />;
}

export function ResultGrid({ children }: { children: ReactNode }) {
  return <div className={styles.results}>{children}</div>;
}

export function ResultsStack({ children }: { children: ReactNode }) {
  return <div className={styles.resultsStack}>{children}</div>;
}

export function Stat({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'monitor';
}) {
  return (
    <div className={`${styles.stat} ${tone === 'monitor' ? styles.statMonitor : ''}`}>
      <span>{label}</span>
      <strong className="mono">{value}</strong>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}
