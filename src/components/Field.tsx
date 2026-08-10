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
      {children}
      {hint && !error ? <p className={styles.hint}>{hint}</p> : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  unit?: string;
};

export function UnitInput({ unit, className, ...props }: InputProps) {
  return (
    <div className={styles.unitWrap}>
      <input className={`${styles.input} ${className ?? ''}`} {...props} />
      {unit ? <span className={styles.unit}>{unit}</span> : null}
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
