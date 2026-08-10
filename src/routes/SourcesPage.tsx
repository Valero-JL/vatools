import { ModulePage, Panel } from '../components/ModulePage';
import { SOURCES } from '../data/sources';
import { FORMULAS } from '../core/formulas/registry';
import { OPERATIONAL_DISCLAIMER } from '../data/warnings';

export function SourcesPage() {
  return (
    <ModulePage
      title="Fuentes y metodología"
      subtitle="Matriz de fuentes y metadatos de fórmulas. Los valores normativos colombianos pendientes se marcan explícitamente."
    >
      <Panel title="Aviso operacional">
        <p>{OPERATIONAL_DISCLAIMER}</p>
      </Panel>

      <Panel title="Fórmulas versionadas">
        <ul>
          {Object.values(FORMULAS).map((f) => (
            <li key={f.id} style={{ marginBottom: '0.85rem' }}>
              <strong>{f.id}</strong> · v{f.version} · {f.certainty}
              <div className="mono" style={{ fontSize: '0.9rem' }}>
                {f.formula}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{f.source}</div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Matriz de fuentes">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
            <thead>
              <tr>
                <th align="left">Tema</th>
                <th align="left">Fuente</th>
                <th align="left">Tipo</th>
                <th align="left">Documento</th>
                <th align="left">Confiabilidad</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={`${s.topic}-${s.doc}`}>
                  <td>{s.topic}</td>
                  <td>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.name}
                    </a>
                  </td>
                  <td>{s.type}</td>
                  <td>
                    {s.doc}
                    {s.section ? ` · ${s.section}` : ''}
                  </td>
                  <td>{s.reliability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </ModulePage>
  );
}
