import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import styles from './HomePage.module.css';

const MODULES = [
  {
    to: '/wind',
    title: 'Componente de viento',
    desc: 'Headwind, tailwind y crosswind respecto a la pista, con ráfagas y diagrama.',
  },
  {
    to: '/toc',
    title: 'Top of Climb (TOC)',
    desc: 'Tiempo y distancia de ascenso hasta la altitud objetivo (modelo teórico).',
  },
  {
    to: '/tod',
    title: 'Top of Descent (TOD)',
    desc: 'Inicio de descenso por tasa, ángulo, regla 3:1 o personalizado.',
  },
  {
    to: '/time',
    title: 'Tiempos de vuelo',
    desc: 't = d/v, d = v·t, v = d/t con groundspeed y conversiones.',
  },
  {
    to: '/fuel',
    title: 'Combustible',
    desc: 'Planificación por componentes y Total Trip Fuel (taxi, trip, contingencia, alterno, reserva…).',
  },
  {
    to: '/checklists',
    title: 'Checklists y Briefing',
    desc: 'Checklist de aeronave y briefings de salida/llegada (PF / PM) con seguimiento de progreso.',
  },
  {
    to: '/a320',
    title: 'A320',
    desc: 'Checklist A320 por pasos y briefing (Departure / Threats / Arrival).',
  },
  {
    to: '/briefing-tool',
    title: 'Briefing Tool',
    desc: 'Accesos rápidos a EFPL, NOTAM, METAR/TAF, AWOS, Windy, RAC y más.',
  },
];

export function HomePage() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <BrandLogo size="lg" className={styles.heroLogo} />
        <p className={styles.eyebrow}>Suite educativa de cálculo aeronáutico</p>
        <h1>Valero Aviation Tools</h1>
        <p className={styles.lead}>
          Calculadoras de viento, TOC, TOD, tiempos y combustible con fórmulas visibles,
          supuestos explícitos y advertencias operacionales. 100% en el navegador.
        </p>
      </section>

      <section className={styles.grid} aria-label="Módulos">
        {MODULES.map((m) => (
          <Link key={m.to} to={m.to} className={styles.card}>
            <h2>{m.title}</h2>
            <p>{m.desc}</p>
          </Link>
        ))}
      </section>

      <section className={styles.links}>
        <Link to="/sources">Fuentes y metodología</Link>
        <Link to="/about">Acerca del proyecto</Link>
      </section>
    </div>
  );
}
