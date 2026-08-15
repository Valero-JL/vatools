import styles from './BrandLogo.module.css';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function BrandLogo({ size = 'md', className }: BrandLogoProps) {
  const src = `${import.meta.env.BASE_URL}brand/vatools-logo.png`;

  return (
    <img
      src={src}
      alt="VA Tools — Aviation Nice Tool"
      className={`${styles.logo} ${styles[size]} ${className ?? ''}`}
      decoding="async"
    />
  );
}
