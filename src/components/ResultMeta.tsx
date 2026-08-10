import type { FormulaMeta } from '../models/types';
import styles from './ResultMeta.module.css';

const certaintyLabel: Record<FormulaMeta['certainty'], string> = {
  verified: 'Verificado',
  reference_intl: 'Referencia internacional',
  pending: 'Pendiente de validación',
  pending_regulatory: 'Pendiente de validación normativa oficial',
};

interface Props {
  formula: FormulaMeta;
  extraAssumptions?: string[];
}

export function ResultMeta({ formula, extraAssumptions = [] }: Props) {
  const assumptions = [...formula.assumptions, ...extraAssumptions];
  return (
    <section className={styles.meta} aria-label="Fórmula, supuestos y fuente">
      <h3>Trazabilidad</h3>
      <dl>
        <div>
          <dt>Fórmula</dt>
          <dd className="mono">{formula.formula}</dd>
        </div>
        <div>
          <dt>Supuestos</dt>
          <dd>
            <ul>
              {assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Fuente</dt>
          <dd>{formula.source}</dd>
        </div>
        <div>
          <dt>Naturaleza</dt>
          <dd>
            {formula.nature} · {certaintyLabel[formula.certainty]} · v{formula.version}
          </dd>
        </div>
      </dl>
    </section>
  );
}
