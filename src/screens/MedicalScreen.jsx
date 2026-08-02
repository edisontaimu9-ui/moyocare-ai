import { useState } from "react";
import { Search, ChevronRight, Activity, Pill, AlertTriangle } from "lucide-react";
import { TopBar } from "../components/TopBar.jsx";
import { WovenRule } from "../components/WovenRule.jsx";
import { Card, Chip } from "../components/Primitives.jsx";
import { AccordionRow } from "../components/AccordionRow.jsx";
import { DISEASES, HYPERTENSION_SECTIONS } from "../data/diseaseInfo.js";
import { METFORMIN } from "../data/medicineInfo.js";

/* ---------------------------------------------------------------------
   MEDICAL
--------------------------------------------------------------------- */
export function MedicalScreen({ c, dark, setDark }) {
  const [tab, setTab] = useState("diseases");
  const [openSection, setOpenSection] = useState("Overview");

  return (
    <div style={{ paddingBottom: 18 }}>
      <TopBar c={c} dark={dark} setDark={setDark} title="Medical" />
      <WovenRule c={c} />
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto" }}>
          {[["diseases", "Diseases"], ["medicines", "Medicines"], ["ai", "Medical AI"]].map(([id, label]) => (
            <Chip key={id} c={c} active={tab === id} onClick={() => setTab(id)}>{label}</Chip>
          ))}
        </div>

        {tab === "diseases" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: "11px 14px", marginBottom: 14 }}>
              <Search size={16} color={c.inkFaint} />
              <input placeholder="Search diseases & conditions…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              {DISEASES.map((d, i) => (
                <Chip key={i} c={c} active={d === "Hypertension"} tone={i % 3 === 0 ? "primary" : i % 3 === 1 ? "clay" : "gold"}>{d}</Chip>
              ))}
            </div>

            <Card c={c} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: c.claySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Activity size={16} color={c.clay} />
                </div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: c.ink }}>Hypertension</div>
              </div>
              {HYPERTENSION_SECTIONS.map((s, i) => (
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
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 600, color: c.ink }}>{METFORMIN.name}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: c.inkFaint }}>{METFORMIN.brandLine}</div>
                </div>
              </div>

              {METFORMIN.facts.map(([k, v], i) => (
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
