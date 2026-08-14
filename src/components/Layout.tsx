import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { WarningBanner } from './WarningBanner';
import { BrandLogo } from './BrandLogo';
import { getWarning } from '../data/warnings';
import { useTheme } from '../theme/ThemeProvider';
import styles from './Layout.module.css';

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/wind', label: 'Viento' },
  { to: '/toc', label: 'TOC' },
  { to: '/tod', label: 'TOD' },
  { to: '/time', label: 'Tiempos' },
  { to: '/fuel', label: 'Combustible' },
  { to: '/checklists', label: 'Checklists' },
  { to: '/a320', label: 'A320' },
  { to: '/sources', label: 'Fuentes' },
  { to: '/about', label: 'Acerca de' },
];

export function Layout() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainWarning = getWarning('ops-main')!;

  return (
    <div className="app-shell">
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <NavLink to="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
            <BrandLogo size="md" />
            <span className={styles.brandText}>
              <strong>Aviation Tools</strong>
              <small>VATools · referencia educativa</small>
            </span>
          </NavLink>

          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            Menú
          </button>

          <nav id="main-nav" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? styles.active : undefined)}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <button type="button" className={styles.themeBtn} onClick={toggle}>
              Tema {theme === 'dark' ? 'claro' : 'oscuro'}
            </button>
          </nav>
        </div>
      </header>

      <div className={`container ${styles.disclaimer}`}>
        <WarningBanner warning={mainWarning} compact />
      </div>

      <main className={`container ${styles.main}`}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <BrandLogo size="sm" />
          <p>
            Valero Aviation Tools v0.1 · Juan Luis Valero · Uso educativo · No operacional ·{' '}
            <NavLink to="/sources">Fuentes</NavLink>
          </p>
        </div>
      </footer>
    </div>
  );
}
