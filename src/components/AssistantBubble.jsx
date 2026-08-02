import { Sparkles, BookOpen, AlertTriangle } from "lucide-react";
import { Card } from "./Primitives.jsx";

const SOURCE_LABELS = {
  knowledge_base: "Knowledge base",
  malawi_fct: "Malawi FCT",
  packaged_foods: "Packaged foods",
  diabetes_exchange: "Diabetes exchange list",
  renal_exchange: "Renal exchange list",
  enteral_formula: "Enteral formula",
  session_memory: "This conversation",
};

function sourceLabel(source) {
  if (SOURCE_LABELS[source]) return SOURCE_LABELS[source];
  if (source?.startsWith("barcode_")) return `Barcode · ${source.replace("barcode_", "")}`;
  if (source?.startsWith("external_")) return source.replace("external_", "").replace(/_/g, " ");
  return source || "Source";
}

export function AssistantBubble({ c, response }) {
  const { answer, sources = [] } = response;

  return (
    <div style={{ display: "flex", gap: 9, marginBottom: 18 }}>
      <div style={{ width: 26, height: 26, borderRadius: 9, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        <Sparkles size={13} color={c.bg} />
      </div>
      <div style={{ flex: 1 }}>
        <Card c={c} style={{ padding: 14, borderRadius: "4px 16px 16px 16px" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {answer}
          </div>

          {sources.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <BookOpen size={12.5} color={c.inkFaint} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: c.inkFaint }}>
                  Sources
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {sources.map((s) => (
                  <div key={s.id} style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.inkFaint, lineHeight: 1.5 }}>
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", color: c.inkSoft }}>[{s.id}]</span>{" "}
                    {s.title} <span style={{ opacity: 0.75 }}>· {sourceLabel(s.source)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 12, background: c.dangerSoft, borderRadius: 12, padding: "9px 11px", display: "flex", gap: 8 }}>
            <AlertTriangle size={14} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.danger, lineHeight: 1.45 }}>
              Educational information only — not a diagnosis. Speak with a clinician for personal medical advice.
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
