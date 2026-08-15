import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { ModulePage, Panel } from '../components/ModulePage';
import { OPERATIONAL_DISCLAIMER } from '../data/warnings';

export function AboutPage() {
  return (
    <ModulePage
      title="Acerca de"
      subtitle="Valero Aviation Tools (vatools) — suite educativa de cálculo y planificación básica de vuelo."
    >
      <Panel title="Marca">
        <BrandLogo size="lg" />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          VA Tools — Aviation Nice Tool.
        </p>
      </Panel>
      <Panel title="Propósito">
        <p>
          Ofrecer calculadoras aeronáuticas claras y trazables (viento, TOC, TOD, tiempos y
          combustible) que funcionen en el navegador sin backend ni registro.
        </p>
        <p>{OPERATIONAL_DISCLAIMER}</p>
      </Panel>
      <Panel title="Alcance MVP">
        <ul>
          <li>Ejecución 100% cliente (React + Vite + TypeScript)</li>
          <li>Lógica pura en <code>src/core/</code> con pruebas Vitest</li>
          <li>Despliegue en GitHub Pages bajo <code>/vatools/</code></li>
          <li>Normativa RAC marcada como pendiente de validación oficial</li>
        </ul>
      </Panel>
      <Panel title="Documentación">
        <p>
          Especificación maestra:{' '}
          <code>docs/Documento_Maestro_Valero_Aviation_Tools.md</code>
        </p>
        <p>
          <Link to="/sources">Ver fuentes y metodología</Link>
        </p>
      </Panel>
      <Panel title="Autor">
        <p>Juan Luis Valero · versión app 0.1.0 · documento maestro 1.0 (2026-08-09)</p>
      </Panel>
    </ModulePage>
  );
}
