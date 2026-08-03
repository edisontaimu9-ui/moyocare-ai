import { useState } from "react";
import { Search, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Card, Chip } from "./Primitives.jsx";
import { GroundedAnswerContent } from "./GroundedAnswerContent.jsx";
import { askChakudya, ChakudyaAskError } from "../data/chakudyaRag.js";

/**
 * suggestions: [{ label, query }] — shown as tappable chips
 * buildQuery: (typedText) => query string, used when the person types their
 *   own topic instead of tapping a suggestion
 * placeholder: input placeholder text
 */
export function TopicLookup({ c, suggestions, buildQuery, placeholder }) {
  const [input, setInput] = useState("");
  const [activeLabel, setActiveLabel] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async (label, query) => {
    setActiveLabel(label);
    setResponse(null);
    setError("");
    setLoading(true);
    try {
      const result = await askChakudya(query);
      setResponse(result);
    } catch (err) {
      setError(err instanceof ChakudyaAskError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitCustom = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    run(q, buildQuery(q));
  };

  const reset = () => {
    setActiveLabel(null);
    setResponse(null);
    setError("");
    setInput("");
  };

  if (activeLabel) {
    return (
      <div>
        <button onClick={reset} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, marginBottom: 12, cursor: "pointer" }}>
          <ArrowLeft size={14} color={c.primary} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: c.primary }}>Back</span>
        </button>

        <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: c.ink, marginBottom: 12 }}>
          {activeLabel}
        </div>

        {loading && (
          <Card c={c} style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Loader2 size={16} color={c.inkFaint} style={{ animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft }}>Looking this up…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </Card>
        )}

        {error && (
          <Card c={c} style={{ padding: 14, display: "flex", gap: 9, alignItems: "flex-start" }}>
            <AlertCircle size={15} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.danger }}>{error}</span>
          </Card>
        )}

        {response && (
          <Card c={c} style={{ padding: 16 }}>
            <GroundedAnswerContent c={c} response={response} />
          </Card>
        )}
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={submitCustom} style={{ display: "flex", alignItems: "center", gap: 10, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: "11px 14px", marginBottom: 14 }}>
        <Search size={16} color={c.inkFaint} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }}
        />
      </form>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {suggestions.map((s, i) => (
          <Chip key={i} c={c} tone={i % 3 === 0 ? "primary" : i % 3 === 1 ? "clay" : "gold"} onClick={() => run(s.label, s.query)}>
            {s.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
