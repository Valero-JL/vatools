interface Props {
  runwayNumber: number;
  heading: number;
  windDir: number;
  windSpeed: number;
  hwSigned: number;
  xwSigned: number;
}

export function RunwayDiagram({
  runwayNumber,
  heading,
  windDir,
  windSpeed,
  hwSigned,
  xwSigned,
}: Props) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const runwayLen = 110;
  const runwayW = 28;
  const windLen = Math.min(90, 20 + windSpeed * 3);

  const rot = heading;
  const windRot = windDir + 180; // hacia dónde sopla

  const hwLen = Math.min(70, Math.abs(hwSigned) * 4);
  const xwLen = Math.min(70, Math.abs(xwSigned) * 4);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label="Diagrama de pista y viento">
      <rect width={size} height={size} rx="12" fill="var(--surface-2)" />
      <circle cx={cx} cy={cy} r="118" fill="none" stroke="var(--border)" strokeDasharray="4 6" />

      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        <rect
          x={cx - runwayW / 2}
          y={cy - runwayLen / 2}
          width={runwayW}
          height={runwayLen}
          rx="3"
          fill="#3a465c"
          stroke="var(--text-muted)"
        />
        <text
          x={cx}
          y={cy + runwayLen / 2 - 8}
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="14"
          fontFamily="var(--font-mono)"
        >
          {String(runwayNumber).padStart(2, '0')}
        </text>
        {/* HW vector along runway (up = headwind facing into runway end) */}
        {hwLen > 0 && (
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={hwSigned > 0 ? cy + hwLen : cy - hwLen}
            stroke="var(--ok)"
            strokeWidth="3"
            markerEnd="url(#arrowOk)"
          />
        )}
        {/* XW vector — positive = from right */}
        {xwLen > 0 && (
          <line
            x1={cx}
            y1={cy}
            x2={xwSigned > 0 ? cx - xwLen : cx + xwLen}
            y2={cy}
            stroke="var(--caution)"
            strokeWidth="3"
            markerEnd="url(#arrowCaution)"
          />
        )}
      </g>

      <g transform={`rotate(${windRot} ${cx} ${cy})`}>
        <line
          x1={cx}
          y1={cy - 20}
          x2={cx}
          y2={cy - 20 - windLen}
          stroke="var(--accent)"
          strokeWidth="3"
          markerEnd="url(#arrowAccent)"
        />
      </g>

      <defs>
        <marker id="arrowAccent" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
        </marker>
        <marker id="arrowOk" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--ok)" />
        </marker>
        <marker id="arrowCaution" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--caution)" />
        </marker>
      </defs>

      <text x="12" y="22" fill="var(--text-muted)" fontSize="11">
        Cian: viento · Verde: HW/TW · Ámbar: XW
      </text>
    </svg>
  );
}
