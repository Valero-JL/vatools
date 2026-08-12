import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import styles from './Field.module.css';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor}>{label}</label>
      <div className={styles.control}>{children}</div>
      <div className={styles.meta}>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className={styles.hint}>{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  unit?: string;
};

export function UnitInput({ unit, className, ...props }: InputProps) {
  if (!unit) {
    return <input className={`${styles.input} ${className ?? ''}`} {...props} />;
  }

  return (
    <div className={styles.unitWrap}>
      <input className={`${styles.input} ${className ?? ''}`} {...props} />
      <span className={styles.unit}>{unit}</span>
    </div>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function SelectInput({ className, children, ...props }: SelectProps) {
  return (
    <select className={`${styles.input} ${styles.select} ${className ?? ''}`} {...props}>
      {children}
    </select>
  );
}
