import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Mic, Send } from "lucide-react";
import { TopBar } from "../components/TopBar.jsx";
import { WovenRule } from "../components/WovenRule.jsx";
import { MoyoMark } from "../components/MoyoMark.jsx";
import { AssistantBubble } from "../components/AssistantBubble.jsx";
import { RESPONSES, DEFAULT_RESPONSE } from "../data/aiResponses.js";

/* ---------------------------------------------------------------------
   AI ASSISTANT
--------------------------------------------------------------------- */
export function AssistantScreen({ c, dark, setDark }) {
  const [messages, setMessages] = useState([{ role: "ai-welcome" }]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const suggested = ["What nutrients are in nsima?", "Explain diabetes.", "How does metformin work?", "What causes hypertension?", "Compare insulin and glucagon.", "Create a renal meal plan."];

  const send = (text) => {
    const q = text || input;
    if (!q.trim()) return;
    const resp = RESPONSES[q] || DEFAULT_RESPONSE;
    setMessages((m) => [...m, { role: "user", text: q }, { role: "ai", response: resp }]);
    setInput("");
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar c={c} dark={dark} setDark={setDark} title="AI Assistant" />
      <WovenRule c={c} />
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {messages.length === 1 && (
          <div style={{ textAlign: "center", padding: "20px 10px 26px" }}>
            <MoyoMark c={c} size={40} />
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 600, color: c.ink, marginTop: 10 }}>
              How can I help today?
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint, marginTop: 4, lineHeight: 1.5 }}>
              Ask about nutrition, disease education, lab tests, or medicines. I explain — I don't diagnose or prescribe.
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          if (m.role === "ai-welcome") return null;
          if (m.role === "user") {
            return (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
                <div style={{ background: c.primary, color: c.bg, fontFamily: "Inter, sans-serif", fontSize: 13, padding: "10px 14px", borderRadius: "16px 16px 4px 16px", maxWidth: "78%" }}>
                  {m.text}
                </div>
              </div>
            );
          }
          return <AssistantBubble key={i} c={c} response={m.response} />;
        })}

        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: c.inkFaint, marginBottom: 8 }}>
            Suggested prompts
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {suggested.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{ background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 12, padding: "8px 12px", fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.inkSoft, cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "10px 16px", borderTop: `1px solid ${c.border}`, background: c.surfaceSolid }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: c.bgAlt, borderRadius: 16, padding: "6px 8px" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ImageIcon size={18} color={c.inkFaint} /></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask MoyoCare AI anything…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }}
          />
          <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><Mic size={18} color={c.inkFaint} /></button>
          <button onClick={() => send()} style={{ background: c.primary, border: "none", width: 32, height: 32, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Send size={14} color={c.bg} />
          </button>
        </div>
      </div>
    </div>
  );
}
