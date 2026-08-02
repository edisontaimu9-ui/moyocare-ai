import {
  Sparkles, ScanLine, UtensilsCrossed, Search, Stethoscope, Activity,
  Calculator, MessageSquare, Bookmark,
} from "lucide-react";
import { TopBar } from "../components/TopBar.jsx";
import { WovenRule } from "../components/WovenRule.jsx";
import { Card, SectionLabel } from "../components/Primitives.jsx";
import { DonutRing, MacroBar } from "../components/Charts.jsx";

/* ---------------------------------------------------------------------
   HOME
--------------------------------------------------------------------- */
export function HomeScreen({ c, dark, setDark, goto }) {
  const quick = [
    { icon: Sparkles, label: "Ask AI", tone: "primary" },
    { icon: ScanLine, label: "Scan Barcode", tone: "clay" },
    { icon: UtensilsCrossed, label: "Analyze Meal", tone: "gold" },
    { icon: Search, label: "Food Search", tone: "primary" },
    { icon: Stethoscope, label: "Medical Search", tone: "clay" },
    { icon: Activity, label: "Symptom Education", tone: "gold" },
    { icon: Calculator, label: "Calculators", tone: "primary" },
  ];
  const toneColor = (t) => (t === "primary" ? c.primary : t === "clay" ? c.clay : c.gold);
  const toneSoft = (t) => (t === "primary" ? c.primarySoft : t === "clay" ? c.claySoft : c.goldSoft);

  return (
    <div style={{ paddingBottom: 18 }}>
      <TopBar c={c} dark={dark} setDark={setDark} />
      <WovenRule c={c} />

      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 23, fontWeight: 600, color: c.ink }}>
          Muli bwanji, Grace 👋
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkFaint, marginTop: 2 }}>
          Sunday, August 2 · Your health snapshot for today
        </div>

        {/* AI Search bar */}
        <button
          onClick={() => goto("assistant")}
          style={{
            width: "100%", marginTop: 16, display: "flex", alignItems: "center", gap: 10,
            background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 16,
            padding: "13px 16px", cursor: "pointer", boxShadow: c.shadow,
          }}
        >
          <Sparkles size={17} color={c.gold} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: c.inkFaint, textAlign: "left" }}>
            Ask MoyoCare AI anything…
          </span>
        </button>

        {/* Quick actions */}
        <div style={{ marginTop: 22 }}>
          <SectionLabel c={c}>Quick actions</SectionLabel>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
            {quick.map((q, i) => (
              <button
                key={i}
                onClick={() => goto(q.label === "Ask AI" ? "assistant" : q.label.includes("Food") || q.label.includes("Meal") || q.label.includes("Barcode") || q.label.includes("Calc") ? "nutrition" : "medical")}
                style={{
                  minWidth: 82, background: c.surfaceSolid, border: `1px solid ${c.border}`,
                  borderRadius: 16, padding: "14px 10px", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 8, cursor: "pointer",
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 11, background: toneSoft(q.tone), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <q.icon size={16} color={toneColor(q.tone)} />
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600, color: c.ink, textAlign: "center", lineHeight: 1.2 }}>
                  {q.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Daily nutrition summary */}
        <div style={{ marginTop: 22 }}>
          <SectionLabel c={c}>Daily nutrition summary</SectionLabel>
          <Card c={c} style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ position: "relative", width: 92, height: 92 }}>
                <DonutRing c={c} pct={0.64} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 15, color: c.ink }}>1,240</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, color: c.inkFaint }}>/ 1,940 kcal</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <MacroBar c={c} label="Protein" value={54} max={90} tone={c.primary} />
                <MacroBar c={c} label="Carbs" value={142} max={220} tone={c.clay} />
                <MacroBar c={c} label="Fat" value={38} max={60} tone={c.gold} />
              </div>
            </div>
          </Card>
        </div>

        {/* Health insights + AI recommendation */}
        <div style={{ marginTop: 14 }}>
          <Card c={c} style={{ padding: 16, background: dark ? "rgba(111,207,158,0.08)" : "#E2EEE7", border: `1px solid ${c.primary}22` }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={14} color={c.bg} />
              </div>
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, color: c.ink }}>AI recommendation</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkSoft, marginTop: 3, lineHeight: 1.5 }}>
                  Your sodium intake has trended high this week. Consider swapping dried fish for fresh fish twice this week to support your blood-pressure goal.
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <div style={{ marginTop: 22 }}>
          <SectionLabel c={c} action="See all">Recent activity</SectionLabel>
          <Card c={c} style={{ padding: 6 }}>
            {[
              { icon: UtensilsCrossed, label: "Logged breakfast — Nsima & beans", time: "7:40 AM", tone: "primary" },
              { icon: MessageSquare, label: "Asked: “Explain hypertension”", time: "Yesterday", tone: "gold" },
              { icon: ScanLine, label: "Scanned Fresh Dairy Yoghurt", time: "Yesterday", tone: "clay" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderBottom: i < 2 ? `1px solid ${c.border}` : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: a.tone === "primary" ? c.primarySoft : a.tone === "gold" ? c.goldSoft : c.claySoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <a.icon size={14} color={a.tone === "primary" ? c.primary : a.tone === "gold" ? c.gold : c.clay} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.ink, fontWeight: 500 }}>{a.label}</div>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint }}>{a.time}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Saved foods */}
        <div style={{ marginTop: 22 }}>
          <SectionLabel c={c} action="See all">Saved foods</SectionLabel>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
            {["Nsima (maize)", "Chambo, grilled", "Groundnut flour", "Mustard greens"].map((f, i) => (
              <div key={i} style={{ minWidth: 128, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: 12 }}>
                <Bookmark size={13} color={c.clay} />
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: c.ink, marginTop: 8 }}>{f}</div>
                <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, color: c.inkFaint, marginTop: 3 }}>per 100g</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
