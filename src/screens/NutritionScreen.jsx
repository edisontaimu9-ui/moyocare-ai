import { useState } from "react";
import {
  ChevronDown, Sparkles, UtensilsCrossed, Droplets,
} from "lucide-react";
import { TopBar } from "../components/TopBar.jsx";
import { WovenRule } from "../components/WovenRule.jsx";
import { Card, Chip, SectionLabel } from "../components/Primitives.jsx";
import { FoodSearchPanel } from "../components/FoodSearchPanel.jsx";
import { BiometricsCalculator } from "../components/BiometricsCalculator.jsx";
import { DiabetesExchangeBrowser } from "../components/DiabetesExchangeBrowser.jsx";
import { RenalFoodBrowser } from "../components/RenalFoodBrowser.jsx";

/* ---------------------------------------------------------------------
   NUTRITION
--------------------------------------------------------------------- */
export function NutritionScreen({ c, dark, setDark }) {
  const [tab, setTab] = useState("search");
  const [expandedCalc, setExpandedCalc] = useState(null); // "diabetes" | "renal" | null

  const calcList = [
    { name: "Diabetes Exchange", icon: Droplets, tone: "primary", enabled: true, key: "diabetes" },
    { name: "Renal Exchange", icon: Droplets, tone: "clay", enabled: true, key: "renal" },
    { name: "Enteral Feeding", icon: UtensilsCrossed, tone: "gold", enabled: false, key: "enteral" },
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

        {tab === "search" && <FoodSearchPanel c={c} />}

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
            <BiometricsCalculator c={c} />

            <SectionLabel c={c}>More calculators</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: expandedCalc ? 16 : 0 }}>
              {calcList.map((cc, i) => {
                const isOpen = cc.enabled && expandedCalc === cc.key;
                return (
                  <button
                    key={i}
                    onClick={() => cc.enabled && setExpandedCalc(isOpen ? null : cc.key)}
                    style={{
                      textAlign: "left", background: isOpen ? c.primarySoft : c.surfaceSolid,
                      border: `1px solid ${isOpen ? c.primary : c.border}`, borderRadius: 14, padding: 12,
                      display: "flex", alignItems: "center", gap: 9, cursor: cc.enabled ? "pointer" : "default",
                      opacity: cc.enabled ? 1 : 0.55,
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 10, background: toneSoft(cc.tone), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <cc.icon size={14} color={toneColor(cc.tone)} />
                    </div>
                    <div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600, color: c.ink, lineHeight: 1.25, display: "block" }}>{cc.name}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, color: c.inkFaint }}>{cc.enabled ? (isOpen ? "Tap to close" : "Tap to open") : "Coming soon"}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {expandedCalc === "diabetes" && <DiabetesExchangeBrowser c={c} />}
            {expandedCalc === "renal" && <RenalFoodBrowser c={c} />}
          </>
        )}
      </div>
    </div>
  );
}
