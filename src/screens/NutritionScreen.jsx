import { useState } from "react";
import { UtensilsCrossed, Droplets } from "lucide-react";
import { TopBar } from "../components/TopBar.jsx";
import { WovenRule } from "../components/WovenRule.jsx";
import { Chip, SectionLabel } from "../components/Primitives.jsx";
import { FoodSearchPanel } from "../components/FoodSearchPanel.jsx";
import { BiometricsCalculator } from "../components/BiometricsCalculator.jsx";
import { DiabetesExchangeBrowser } from "../components/DiabetesExchangeBrowser.jsx";
import { RenalFoodBrowser } from "../components/RenalFoodBrowser.jsx";
import { EnteralFormulaBrowser } from "../components/EnteralFormulaBrowser.jsx";
import { MealLogPanel } from "../components/MealLogPanel.jsx";

/* ---------------------------------------------------------------------
   NUTRITION
--------------------------------------------------------------------- */
export function NutritionScreen({ c, dark, setDark }) {
  const [tab, setTab] = useState("search");
  const [expandedCalc, setExpandedCalc] = useState(null); // "diabetes" | "renal" | "enteral" | null

  const calcList = [
    { name: "Diabetes Exchange", icon: Droplets, tone: "primary", enabled: true, key: "diabetes" },
    { name: "Renal Exchange", icon: Droplets, tone: "clay", enabled: true, key: "renal" },
    { name: "Enteral Feeding", icon: UtensilsCrossed, tone: "gold", enabled: true, key: "enteral" },
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

        {tab === "meal" && <MealLogPanel c={c} />}

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
            {expandedCalc === "enteral" && <EnteralFormulaBrowser c={c} />}
          </>
        )}
      </div>
    </div>
  );
}
