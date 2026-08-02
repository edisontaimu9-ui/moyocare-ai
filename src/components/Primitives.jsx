import { ChevronRight } from "lucide-react";

/* ---------------------------------------------------------------------
   PRIMITIVES
--------------------------------------------------------------------- */
export function Card({ c, children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: c.surface,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${c.border}`,
        borderRadius: 20,
        boxShadow: c.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Named "Chip" (not "Pill") to avoid colliding with the lucide-react
// "Pill" icon, which is used elsewhere for medicine-related UI.
export function Chip({ c, children, active, onClick, tone = "primary" }) {
  const toneMap = {
    primary: { bg: active ? c.primary : c.primarySoft, fg: active ? c.bg : c.primary },
    clay: { bg: active ? c.clay : c.claySoft, fg: active ? c.bg : c.clay },
    gold: { bg: active ? c.gold : c.goldSoft, fg: active ? c.bg : c.gold },
  };
  const t = toneMap[tone];
  return (
    <button
      onClick={onClick}
      style={{
        background: t.bg,
        color: t.fg,
        border: "none",
        borderRadius: 999,
        padding: "7px 14px",
        fontSize: 12.5,
        fontWeight: 600,
        fontFamily: "Inter, sans-serif",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function SectionLabel({ c, children, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: c.inkFaint }}>
        {children}
      </span>
      {action && (
        <button onClick={onAction} style={{ background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: c.primary, cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}
