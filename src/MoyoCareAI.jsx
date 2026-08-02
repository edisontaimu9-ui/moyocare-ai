import React, { useState, useRef, useEffect } from "react";
import {
  Home, Sparkles, Apple, Stethoscope, User, Search, Camera, ScanLine, Mic,
  Send, Moon, Sun, Bell, ChevronRight, ChevronDown, Plus, ShieldCheck,
  AlertTriangle, BookOpen, Pill, Activity, Bookmark, Clock, ArrowLeft,
  Image as ImageIcon, UtensilsCrossed, Calculator, Info, Flame, Droplets,
  TrendingUp, X, Check, MessageSquare, Settings, LogOut, ChevronLeft
} from "lucide-react";

/* ---------------------------------------------------------------------
   DESIGN TOKENS
--------------------------------------------------------------------- */
const TOKENS = {
  light: {
    bg: "#F6F1E7",
    bgAlt: "#EFE7D8",
    surface: "rgba(255,255,255,0.72)",
    surfaceSolid: "#FFFFFF",
    border: "rgba(15,64,52,0.10)",
    ink: "#132420",
    inkSoft: "#5A6D66",
    inkFaint: "#8A9A93",
    primary: "#0F5C4C",
    primaryDeep: "#0A3F34",
    primarySoft: "#E2EEE7",
    mint: "#3F9174",
    clay: "#A8562E",
    claySoft: "#F3E1D3",
    gold: "#AD7F26",
    goldSoft: "#F3EAD2",
    danger: "#B3462C",
    dangerSoft: "#F5E0D8",
    shadow: "0 10px 30px -12px rgba(15,64,52,0.18)",
  },
  dark: {
    bg: "#081512",
    bgAlt: "#0C1D18",
    surface: "rgba(255,255,255,0.045)",
    surfaceSolid: "#0F211C",
    border: "rgba(255,255,255,0.09)",
    ink: "#E9F3EE",
    inkSoft: "#9FB6AC",
    inkFaint: "#6C8880",
    primary: "#6FCF9E",
    primaryDeep: "#8FDDB4",
    primarySoft: "rgba(111,207,158,0.12)",
    mint: "#6FCF9E",
    clay: "#DE9367",
    claySoft: "rgba(222,147,103,0.14)",
    gold: "#E3BE5B",
    goldSoft: "rgba(227,190,91,0.14)",
    danger: "#E5937A",
    dangerSoft: "rgba(229,147,122,0.14)",
    shadow: "0 10px 34px -10px rgba(0,0,0,0.55)",
  },
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

/* ---------------------------------------------------------------------
   SMALL DECOR: kente-inspired divider strip (signature motif)
--------------------------------------------------------------------- */
function WovenRule({ c }) {
  const teeth = new Array(24).fill(0);
  return (
    <div style={{ display: "flex", height: 6, width: "100%", overflow: "hidden", opacity: 0.55 }}>
      {teeth.map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: "100%",
            background: i % 3 === 0 ? c.clay : i % 3 === 1 ? c.gold : c.primary,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            marginRight: 1,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------
   LOGO MARK: heart formed from two leaves, cross negative-space,
   neural nodes tracing the veins
--------------------------------------------------------------------- */
function MoyoMark({ size = 30, c }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 40C24 40 6 29.2 6 17.6C6 11.2 11 6.4 17 6.4C20.2 6.4 22.8 8 24 10.4C25.2 8 27.8 6.4 31 6.4C37 6.4 42 11.2 42 17.6C42 29.2 24 40 24 40Z"
        fill={c.primary}
      />
      <path
        d="M24 10.4C24 10.4 24 22 24 40"
        stroke={c.bg}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <rect x="21.1" y="17.4" width="5.8" height="1.7" rx="0.85" fill={c.bg} opacity="0.9" />
      <rect x="23.15" y="15.3" width="1.7" height="5.9" rx="0.85" fill={c.bg} opacity="0.9" />
      <circle cx="15.5" cy="18" r="1.6" fill={c.gold} />
      <circle cx="24" cy="27" r="1.6" fill={c.gold} />
      <circle cx="32.5" cy="18" r="1.6" fill={c.gold} />
      <path d="M15.5 18L24 27L32.5 18" stroke={c.gold} strokeWidth="1" opacity="0.8" />
    </svg>
  );
}

/* ---------------------------------------------------------------------
   PRIMITIVES
--------------------------------------------------------------------- */
function Card({ c, children, style, onClick }) {
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

function Pill({ c, children, active, onClick, tone = "primary" }) {
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

function SectionLabel({ c, children, action, onAction }) {
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

/* ---------------------------------------------------------------------
   TOP BAR
--------------------------------------------------------------------- */
function TopBar({ c, dark, setDark, title, onBack }) {
  return (
    <div style={{ padding: "18px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onBack ? (
          <button onClick={onBack} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ArrowLeft size={17} color={c.ink} />
          </button>
        ) : (
          <MoyoMark c={c} size={32} />
        )}
        <div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: c.ink, lineHeight: 1.1 }}>
            {title || "MoyoCare AI"}
          </div>
          {!onBack && (
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint, letterSpacing: 0.3 }}>
              Chakudya Nutrition Registry
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setDark(!dark)} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {dark ? <Sun size={16} color={c.gold} /> : <Moon size={16} color={c.primary} />}
        </button>
        <button style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <Bell size={16} color={c.ink} />
          <span style={{ position: "absolute", top: 8, right: 9, width: 6, height: 6, borderRadius: 99, background: c.clay }} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   BOTTOM NAV
--------------------------------------------------------------------- */
function BottomNav({ c, active, setActive }) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "assistant", icon: Sparkles, label: "Assistant" },
    { id: "nutrition", icon: Apple, label: "Nutrition" },
    { id: "medical", icon: Stethoscope, label: "Medical" },
    { id: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderTop: `1px solid ${c.border}`,
        background: c.surfaceSolid,
        padding: "9px 6px calc(env(safe-area-inset-bottom, 0px) + 9px)",
      }}
    >
      {items.map((it) => {
        const isActive = active === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => setActive(it.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "4px 0",
            }}
          >
            <div
              style={{
                width: 40,
                height: 26,
                borderRadius: 13,
                background: isActive ? c.primarySoft : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              <Icon size={17} color={isActive ? c.primary : c.inkFaint} strokeWidth={isActive ? 2.4 : 2} />
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? c.primary : c.inkFaint }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------
   HOME
--------------------------------------------------------------------- */
function DonutRing({ c, pct, size = 92 }) {
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

function MacroBar({ c, label, value, max, tone }) {
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

function HomeScreen({ c, dark, setDark, goto }) {
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

/* ---------------------------------------------------------------------
   AI ASSISTANT
--------------------------------------------------------------------- */
function AssistantBubble({ c, response }) {
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

const RESPONSES = {
  "Explain diabetes.": {
    explanation: "Diabetes mellitus is a group of metabolic conditions where the body cannot regulate blood glucose effectively, either from insufficient insulin production (Type 1) or insulin resistance (Type 2).",
    clinical: "Type 2 diabetes accounts for most cases and is diagnosed via fasting glucose ≥126 mg/dL, HbA1c ≥6.5%, or an oral glucose tolerance test. Long-term hyperglycaemia can damage the eyes, kidneys, nerves, and blood vessels.",
    nutrition: "A consistent-carbohydrate eating pattern, higher fibre intake, and spacing meals helps stabilise post-meal glucose. Diabetes exchange lists in the Nutrition module can help with portioning maize, rice, and legume-based Malawian staples.",
    refs: "American Diabetes Association Standards of Care · WHO Diabetes Fact Sheet",
    safety: "This is educational information, not a diagnosis. Speak with a clinician for testing and personalised treatment.",
  },
  "What nutrients are in nsima?": {
    explanation: "Nsima, Malawi's maize-meal staple, is primarily a carbohydrate source with modest protein and very low fat, and is typically paired with a relish for balance.",
    clinical: "Per 100 g cooked: roughly 130 kcal, 28 g carbohydrate, 2.4 g protein, 0.5 g fat. It contributes iron and B-vitamins if made from unrefined flour, but is low in lysine, an essential amino acid.",
    nutrition: "Pairing nsima with legumes (beans, groundnuts) or animal protein improves the amino-acid profile. For diabetes management, portion using the Diabetes Exchange Calculator, since it is a fast-digesting carbohydrate.",
    refs: "Malawi Food Composition Table, 2019 · Chakudya Nutrition Registry",
    safety: null,
  },
  "How does metformin work?": {
    explanation: "Metformin is a first-line biguanide medication for Type 2 diabetes that primarily lowers glucose production by the liver and improves how the body's tissues respond to insulin.",
    clinical: "It reduces hepatic gluconeogenesis, decreases intestinal glucose absorption, and increases peripheral glucose uptake. It does not typically cause hypoglycaemia on its own and has a favourable cardiovascular safety profile.",
    nutrition: "Metformin can reduce vitamin B12 absorption with long-term use, and taking it with food reduces gastrointestinal side effects. See the Medicines section for full food-drug interaction detail.",
    refs: "UK NICE Guideline NG28 · Malawi Standard Treatment Guidelines",
    safety: "Educational information only — this does not replace a prescription or medical advice from your clinician or pharmacist.",
  },
};
const DEFAULT_RESPONSE = RESPONSES["Explain diabetes."];

function AssistantScreen({ c, dark, setDark }) {
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

/* ---------------------------------------------------------------------
   NUTRITION
--------------------------------------------------------------------- */
function NutritionScreen({ c, dark, setDark }) {
  const [tab, setTab] = useState("search");
  const [bmiForm, setBmiForm] = useState({ h: 165, w: 62 });
  const bmi = (bmiForm.w / Math.pow(bmiForm.h / 100, 2)).toFixed(1);

  const sources = ["Malawi FCT", "Packaged", "USDA", "Open Food Facts", "FatSecret", "Enteral", "Diabetes Exchange", "Renal Exchange"];
  const calcList = [
    { name: "BMI", icon: Activity, tone: "primary" },
    { name: "BMR", icon: Flame, tone: "clay" },
    { name: "TDEE", icon: TrendingUp, tone: "gold" },
    { name: "Diabetes Exchange", icon: Droplets, tone: "primary" },
    { name: "Renal Exchange", icon: Droplets, tone: "clay" },
    { name: "Enteral Feeding", icon: UtensilsCrossed, tone: "gold" },
  ];
  const toneColor = (t) => (t === "primary" ? c.primary : t === "clay" ? c.clay : c.gold);
  const toneSoft = (t) => (t === "primary" ? c.primarySoft : t === "clay" ? c.claySoft : c.goldSoft);

  return (
    <div style={{ paddingBottom: 18 }}>
      <TopBar c={c} dark={dark} setDark={setDark} title="Nutrition" />
      <WovenRule c={c} />
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[["search", "Food Search"], ["meal", "Meal Analysis"], ["calc", "Calculators"]].map(([id, label]) => (
            <Pill key={id} c={c} active={tab === id} onClick={() => setTab(id)}>{label}</Pill>
          ))}
        </div>

        {tab === "search" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: "11px 14px", marginBottom: 12 }}>
              <Search size={16} color={c.inkFaint} />
              <input placeholder="Search foods, e.g. nsima, chambo…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }} />
              <ScanLine size={16} color={c.clay} />
            </div>
            <div style={{ display: "flex", gap: 7, overflowX: "auto", marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20, marginBottom: 16 }}>
              {sources.map((s, i) => <Pill key={i} c={c} tone={i % 3 === 0 ? "primary" : i % 3 === 1 ? "clay" : "gold"} active={i === 0}>{s}</Pill>)}
            </div>

            <SectionLabel c={c}>Result</SectionLabel>
            <Card c={c} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 600, color: c.ink }}>Nsima (maize meal)</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: c.inkFaint, marginTop: 2 }}>Serving: 200 g cooked · Malawi FCT</div>
                </div>
                <Bookmark size={16} color={c.clay} />
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
                {[["Calories", "260 kcal"], ["Protein", "4.8 g"], ["Carbs", "56 g"], ["Fat", "1.0 g"]].map(([k, v], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, fontWeight: 600, color: c.ink }}>{v}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: c.inkFaint }}>{k}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}` }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, color: c.inkFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>Micronutrients</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkSoft }}>Iron 1.2 mg · Zinc 0.9 mg · Folate 14 µg · Potassium 82 mg</div>
              </div>
            </Card>
          </>
        )}

        {tab === "meal" && (
          <>
            <SectionLabel c={c}>Today's log</SectionLabel>
            <Card c={c} style={{ padding: 14, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 11, background: c.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <UtensilsCrossed size={15} color={c.primary} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: c.ink }}>Breakfast · Nsima & beans</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint }}>7:40 AM · 420 kcal</div>
                  </div>
                </div>
                <button style={{ background: c.primarySoft, border: "none", borderRadius: 10, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronDown size={14} color={c.primary} />
                </button>
              </div>
            </Card>

            <SectionLabel c={c}>AI meal analysis</SectionLabel>
            <Card c={c} style={{ padding: 15 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <Sparkles size={14} color={c.gold} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: c.ink }}>Nutrient breakdown & portion estimate</span>
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft, lineHeight: 1.55 }}>
                Estimated portion: 1.5 cups nsima + ¾ cup bean relish. This meal is carbohydrate-forward and moderate in fibre. Adding a vegetable side would improve micronutrient density and slow glucose absorption.
              </div>
              <button style={{ marginTop: 12, width: "100%", background: c.primary, color: c.bg, border: "none", borderRadius: 12, padding: "10px", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                Log this meal
              </button>
            </Card>
          </>
        )}

        {tab === "calc" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {calcList.map((cc, i) => (
                <div key={i} style={{ background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: 12, display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: toneSoft(cc.tone), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <cc.icon size={14} color={toneColor(cc.tone)} />
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600, color: c.ink, lineHeight: 1.25 }}>{cc.name}</span>
                </div>
              ))}
            </div>

            <SectionLabel c={c}>BMI calculator</SectionLabel>
            <Card c={c} style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint }}>Height (cm)</label>
                  <input type="number" value={bmiForm.h} onChange={(e) => setBmiForm({ ...bmiForm, h: +e.target.value })}
                    style={{ width: "100%", marginTop: 4, background: c.bgAlt, border: `1px solid ${c.border}`, borderRadius: 10, padding: "9px 10px", fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: c.ink, outline: "none" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint }}>Weight (kg)</label>
                  <input type="number" value={bmiForm.w} onChange={(e) => setBmiForm({ ...bmiForm, w: +e.target.value })}
                    style={{ width: "100%", marginTop: 4, background: c.bgAlt, border: `1px solid ${c.border}`, borderRadius: 10, padding: "9px 10px", fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: c.ink, outline: "none" }} />
                </div>
              </div>
              <div style={{ background: c.primarySoft, borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: c.primary }}>Your BMI</span>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 18, fontWeight: 700, color: c.primary }}>{bmi}</span>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   MEDICAL
--------------------------------------------------------------------- */
function AccordionRow({ c, title, children, open, onClick, icon: Icon }) {
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

function MedicalScreen({ c, dark, setDark }) {
  const [tab, setTab] = useState("diseases");
  const [openSection, setOpenSection] = useState("Overview");
  const diseases = ["Diabetes", "Hypertension", "Chronic Kidney Disease", "HIV/AIDS", "Tuberculosis", "Malnutrition", "Obesity", "Cardiovascular Disease"];

  const sections = [
    { t: "Overview", icon: Info, body: "Hypertension is persistently elevated arterial blood pressure (≥140/90 mmHg), a major modifiable risk factor for stroke, heart disease, and kidney disease." },
    { t: "Causes", icon: Activity, body: "Primary hypertension has no single cause and develops from a mix of genetics, ageing, and lifestyle. Secondary hypertension arises from an identifiable condition such as kidney disease or hormonal disorders." },
    { t: "Risk factors", icon: TrendingUp, body: "High salt intake, low potassium intake, physical inactivity, excess alcohol, obesity, chronic stress, and family history." },
    { t: "Signs & symptoms", icon: Stethoscope, body: "Often asymptomatic. When present: headaches, dizziness, blurred vision, or nosebleeds — usually only at very high readings." },
    { t: "Diagnosis", icon: Check, body: "Confirmed with repeated blood-pressure readings across separate visits, or 24-hour ambulatory monitoring." },
    { t: "Treatment overview", icon: Pill, body: "Lifestyle modification is first-line; medications (e.g. ACE inhibitors, calcium channel blockers, diuretics) are added based on risk and response." },
    { t: "Prevention", icon: ShieldCheck, body: "Reduce dietary sodium, maintain healthy weight, stay active, limit alcohol, and manage stress." },
    { t: "Nutrition considerations", icon: Apple, body: "A DASH-style eating pattern — rich in vegetables, fruit, legumes, and low-fat dairy, with sodium under 2 g/day — meaningfully lowers blood pressure." },
  ];

  return (
    <div style={{ paddingBottom: 18 }}>
      <TopBar c={c} dark={dark} setDark={setDark} title="Medical" />
      <WovenRule c={c} />
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto" }}>
          {[["diseases", "Diseases"], ["medicines", "Medicines"], ["ai", "Medical AI"]].map(([id, label]) => (
            <Pill key={id} c={c} active={tab === id} onClick={() => setTab(id)}>{label}</Pill>
          ))}
        </div>

        {tab === "diseases" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: "11px 14px", marginBottom: 14 }}>
              <Search size={16} color={c.inkFaint} />
              <input placeholder="Search diseases & conditions…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              {diseases.map((d, i) => (
                <Pill key={i} c={c} active={d === "Hypertension"} tone={i % 3 === 0 ? "primary" : i % 3 === 1 ? "clay" : "gold"}>{d}</Pill>
              ))}
            </div>

            <Card c={c} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: c.claySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Activity size={16} color={c.clay} />
                </div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: c.ink }}>Hypertension</div>
              </div>
              {sections.map((s, i) => (
                <AccordionRow key={i} c={c} title={s.t} icon={s.icon} open={openSection === s.t} onClick={() => setOpenSection(openSection === s.t ? "" : s.t)}>
                  {s.body}
                </AccordionRow>
              ))}
            </Card>
          </>
        )}

        {tab === "medicines" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: "11px 14px", marginBottom: 14 }}>
              <Search size={16} color={c.inkFaint} />
              <input placeholder="Search medicines, e.g. metformin…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }} />
            </div>

            <Card c={c} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: c.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Pill size={16} color={c.primary} />
                </div>
                <div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 600, color: c.ink }}>Metformin</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: c.inkFaint }}>Biguanide · Brands: Glucophage, Fortamet</div>
                </div>
              </div>

              {[
                ["Uses", "First-line treatment for Type 2 diabetes; also used in polycystic ovary syndrome."],
                ["Mechanism of action", "Reduces hepatic glucose production and improves insulin sensitivity in peripheral tissue."],
                ["Side effects", "Nausea, diarrhoea, abdominal discomfort — usually transient; rare risk of lactic acidosis."],
                ["Contraindications", "Severe renal impairment, acute heart failure, significant liver disease."],
                ["Food-drug interactions", "Take with meals to reduce GI upset; long-term use may lower vitamin B12."],
                ["Nutrition considerations", "Monitor B12 status annually; pair with a consistent-carbohydrate eating pattern."],
                ["Storage", "Store at room temperature, away from moisture and direct heat."],
              ].map(([k, v], i) => (
                <div key={i} style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c.border}` }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 700, color: c.inkFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{k}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkSoft, lineHeight: 1.5 }}>{v}</div>
                </div>
              ))}

              <div style={{ marginTop: 14, background: c.dangerSoft, borderRadius: 12, padding: "10px 12px", display: "flex", gap: 8 }}>
                <AlertTriangle size={14} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: c.danger, lineHeight: 1.45 }}>
                  Medicine information is provided for educational purposes only and should not replace professional medical advice.
                </span>
              </div>
            </Card>
          </>
        )}

        {tab === "ai" && (
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft, marginBottom: 14, lineHeight: 1.5 }}>
              Ask the Medical AI to explain clinical topics in plain language.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Explain diseases", "Explain laboratory tests", "Explain anatomy", "Explain physiology", "Explain pathology", "Explain medications", "Explain clinical nutrition", "Explain medical procedures"].map((s, i) => (
                <button key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 13, padding: "12px 14px", cursor: "pointer" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.ink }}>{s}</span>
                  <ChevronRight size={14} color={c.inkFaint} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   PROFILE
--------------------------------------------------------------------- */
function ProfileScreen({ c, dark, setDark }) {
  const rows = [
    { icon: MessageSquare, label: "Saved conversations", count: 12 },
    { icon: Bookmark, label: "Saved foods", count: 34 },
    { icon: Clock, label: "Scan history", count: 21 },
  ];
  return (
    <div style={{ paddingBottom: 18 }}>
      <TopBar c={c} dark={dark} setDark={setDark} title="Profile" />
      <WovenRule c={c} />
      <div style={{ padding: "18px 20px 0" }}>
        <Card c={c} style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 600, color: c.bg }}>
            G
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: c.ink }}>Grace Chirwa</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.inkFaint, marginTop: 2 }}>General public account</div>
          </div>
        </Card>

        <div style={{ marginTop: 18 }}>
          <SectionLabel c={c}>Dietary preferences</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Low sodium", "High fibre", "Vegetarian-friendly", "Renal-aware"].map((p, i) => (
              <Pill key={i} c={c} active tone="primary">{p}</Pill>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <SectionLabel c={c}>Health goals</SectionLabel>
          <Card c={c} style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.ink }}>Lower blood pressure</span>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: c.primary }}>62%</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: c.bgAlt, overflow: "hidden" }}>
              <div style={{ width: "62%", height: "100%", background: c.primary, borderRadius: 99 }} />
            </div>
          </Card>
        </div>

        <div style={{ marginTop: 18 }}>
          <SectionLabel c={c}>Activity</SectionLabel>
          <Card c={c} style={{ padding: 6 }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 10px", borderBottom: i < rows.length - 1 ? `1px solid ${c.border}` : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: c.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <r.icon size={14} color={c.primary} />
                </div>
                <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500, color: c.ink }}>{r.label}</span>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11.5, color: c.inkFaint }}>{r.count}</span>
                <ChevronRight size={14} color={c.inkFaint} />
              </div>
            ))}
          </Card>
        </div>

        <div style={{ marginTop: 18 }}>
          <SectionLabel c={c}>Settings</SectionLabel>
          <Card c={c} style={{ padding: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 10px", borderBottom: `1px solid ${c.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: c.goldSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {dark ? <Sun size={14} color={c.gold} /> : <Moon size={14} color={c.gold} />}
              </div>
              <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500, color: c.ink }}>Appearance</span>
              <button onClick={() => setDark(!dark)} style={{ width: 40, height: 22, borderRadius: 99, background: dark ? c.primary : c.bgAlt, border: "none", cursor: "pointer", position: "relative" }}>
                <div style={{ width: 16, height: 16, borderRadius: 99, background: c.surfaceSolid, position: "absolute", top: 3, left: dark ? 21 : 3, transition: "left 0.2s" }} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 10px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: c.claySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Settings size={14} color={c.clay} />
              </div>
              <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500, color: c.ink }}>Account settings</span>
              <ChevronRight size={14} color={c.inkFaint} />
            </div>
          </Card>
        </div>

        <button style={{ width: "100%", marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: `1px solid ${c.border}`, borderRadius: 14, padding: "12px", cursor: "pointer" }}>
          <LogOut size={14} color={c.danger} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.danger }}>Log out</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   APP
--------------------------------------------------------------------- */
export default function MoyoCareAI() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("home");
  const c = dark ? TOKENS.dark : TOKENS.light;

  const screens = {
    home: <HomeScreen c={c} dark={dark} setDark={setDark} goto={setTab} />,
    assistant: <AssistantScreen c={c} dark={dark} setDark={setDark} />,
    nutrition: <NutritionScreen c={c} dark={dark} setDark={setDark} />,
    medical: <MedicalScreen c={c} dark={dark} setDark={setDark} />,
    profile: <ProfileScreen c={c} dark={dark} setDark={setDark} />,
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: dark ? "#040a08" : "#EAE3D2", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter, sans-serif" }}>
      <style>{FONTS}</style>
      <div
        style={{
          width: 400,
          height: 830,
          background: c.bg,
          borderRadius: 42,
          border: `10px solid ${dark ? "#000" : "#1a1a1a"}`,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.45)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 130, height: 26, background: dark ? "#000" : "#1a1a1a", borderRadius: "0 0 16px 16px", zIndex: 20 }} />
        <div style={{ flex: 1, overflowY: "auto" }}>{screens[tab]}</div>
        <BottomNav c={c} active={tab} setActive={setTab} />
      </div>
    </div>
  );
}
