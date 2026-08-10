interface Props {
  altStart: number;
  altEnd: number;
  distanceNM: number;
  mode: 'climb' | 'descent';
}

export function ProfileChart({ altStart, altEnd, distanceNM, mode }: Props) {
  const w = 360;
  const h = 180;
  const pad = 28;
  const x0 = pad;
  const y0 = h - pad;
  const x1 = w - pad;
  const y1 = pad;
  const maxAlt = Math.max(altStart, altEnd, 1);
  const yStart = y0 - (altStart / maxAlt) * (y0 - y1);
  const yEnd = y0 - (altEnd / maxAlt) * (y0 - y1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-label={`Perfil de ${mode}`}>
      <rect width={w} height={h} rx="12" fill="var(--surface-2)" />
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="var(--border)" />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="var(--border)" />
      <polyline
        points={`${x0},${yStart} ${x1},${yEnd}`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
      />
      <circle cx={x0} cy={yStart} r="4" fill="var(--ok)" />
      <circle cx={x1} cy={yEnd} r="4" fill="var(--caution)" />
      <text x={x0} y={yStart - 8} fill="var(--text-muted)" fontSize="11">
        {altStart} ft
      </text>
      <text x={x1 - 50} y={yEnd - 8} fill="var(--text-muted)" fontSize="11">
        {altEnd} ft
      </text>
      <text x={w / 2 - 30} y={h - 8} fill="var(--text-muted)" fontSize="11">
        {distanceNM.toFixed(1)} NM
      </text>
    </svg>
  );
}
