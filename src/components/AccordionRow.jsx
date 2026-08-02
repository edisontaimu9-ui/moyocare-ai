import { ChevronDown } from "lucide-react";

export function AccordionRow({ c, title, children, open, onClick, icon: Icon }) {
  return (
    <div style={{ borderBottom: `1px solid ${c.border}` }}>
      <button onClick={onClick} style={{ width: "100%", background: "none", border: "none", padding: "12px 2px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, color: c.ink }}>
          <Icon size={13} color={c.primary} /> {title}
        </span>
        <ChevronDown size={14} color={c.inkFaint} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && <div style={{ padding: "0 2px 14px", fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkSoft, lineHeight: 1.55 }}>{children}</div>}
    </div>
  );
}
