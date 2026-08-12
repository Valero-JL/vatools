import { useTheme } from '../theme/ThemeProvider';
import styles from './BrandLogo.module.css';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function BrandLogo({ size = 'md', className }: BrandLogoProps) {
  const { theme } = useTheme();
  const file = theme === 'dark' ? 'logo-dark.png' : 'logo-light.png';
  const src = `${import.meta.env.BASE_URL}brand/${file}`;

  return (
    <img
      src={src}
      alt="Juan Luis Valero"
      className={`${styles.logo} ${styles[size]} ${className ?? ''}`}
      decoding="async"
    />
  );
}
