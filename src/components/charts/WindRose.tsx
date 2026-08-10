interface Props {
  angle: number;
  crosswind: number;
  headwind: number;
  tailwind: number;
}

export function WindRose({ angle, crosswind, headwind, tailwind }: Props) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;
  const mag = Math.max(crosswind, headwind, tailwind, 1);
  const len = Math.min(r - 8, (Math.hypot(crosswind, headwind || tailwind) / mag) * (r - 8));
  const rad = ((angle - 90) * Math.PI) / 180;
  const x2 = cx + Math.cos(rad) * len;
  const y2 = cy + Math.sin(rad) * len;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label="Rosa de vientos relativa">
      <rect width={size} height={size} rx="12" fill="var(--surface-2)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" />
      <circle cx={cx} cy={cy} r={r / 2} fill="none" stroke="var(--border)" strokeDasharray="3 4" />
      {['N', 'E', 'S', 'O'].map((label, i) => {
        const a = ((-90 + i * 90) * Math.PI) / 180;
        return (
          <text
            key={label}
            x={cx + Math.cos(a) * (r + 14)}
            y={cy + Math.sin(a) * (r + 14) + 4}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="12"
          >
            {label}
          </text>
        );
      })}
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="3" fill="var(--accent)" />
      <text x="12" y={size - 12} fill="var(--text-muted)" fontSize="11">
        Ángulo relativo {angle.toFixed(1)}°
      </text>
    </svg>
  );
}
