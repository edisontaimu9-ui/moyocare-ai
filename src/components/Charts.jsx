export function DonutRing({ c, pct, size = 92 }) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={c.primarySoft} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={c.primary} strokeWidth={stroke} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
      />
    </svg>
  );
}

export function MacroBar({ c, label, value, max, tone }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.inkSoft, fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: c.ink }}>{value}g</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: c.bgAlt, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: tone }} />
      </div>
    </div>
  );
}
