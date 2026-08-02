import { useState } from "react";
import {
  Search, ScanLine, Bookmark, ChevronDown, Sparkles, UtensilsCrossed,
  Activity, Flame, TrendingUp, Droplets,
} from "lucide-react";
import { TopBar } from "../components/TopBar.jsx";
import { WovenRule } from "../components/WovenRule.jsx";
import { Card, Chip, SectionLabel } from "../components/Primitives.jsx";

/* ---------------------------------------------------------------------
   NUTRITION
--------------------------------------------------------------------- */
export function NutritionScreen({ c, dark, setDark }) {
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
            <Chip key={id} c={c} active={tab === id} onClick={() => setTab(id)}>{label}</Chip>
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
              {sources.map((s, i) => <Chip key={i} c={c} tone={i % 3 === 0 ? "primary" : i % 3 === 1 ? "clay" : "gold"} active={i === 0}>{s}</Chip>)}
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
