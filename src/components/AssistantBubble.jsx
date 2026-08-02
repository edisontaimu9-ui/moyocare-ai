import { Sparkles, Activity, Apple, BookOpen, AlertTriangle } from "lucide-react";
import { Card } from "./Primitives.jsx";

export function AssistantBubble({ c, response }) {
  return (
    <div style={{ display: "flex", gap: 9, marginBottom: 18 }}>
      <div style={{ width: 26, height: 26, borderRadius: 9, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        <Sparkles size={13} color={c.bg} />
      </div>
      <div style={{ flex: 1 }}>
        <Card c={c} style={{ padding: 14, borderRadius: "4px 16px 16px 16px" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink, lineHeight: 1.55, marginBottom: 12 }}>
            {response.explanation}
          </div>

          {[
            { label: "Clinical summary", icon: Activity, text: response.clinical, tone: "primary" },
            { label: "Nutrition implications", icon: Apple, text: response.nutrition, tone: "gold" },
          ].map((s, i) => (
            <div key={i} style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <s.icon size={12.5} color={s.tone === "primary" ? c.primary : c.gold} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: s.tone === "primary" ? c.primary : c.gold }}>
                  {s.label}
                </span>
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft, lineHeight: 1.5 }}>{s.text}</div>
            </div>
          ))}

          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <BookOpen size={12.5} color={c.inkFaint} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: c.inkFaint }}>References</span>
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.inkFaint, lineHeight: 1.6 }}>
              {response.refs}
            </div>
          </div>

          {response.safety && (
            <div style={{ marginTop: 12, background: c.dangerSoft, borderRadius: 12, padding: "9px 11px", display: "flex", gap: 8 }}>
              <AlertTriangle size={14} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.danger, lineHeight: 1.45 }}>{response.safety}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
