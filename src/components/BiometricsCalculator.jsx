import { useState } from "react";
import { Card, Chip, SectionLabel } from "./Primitives.jsx";
import { calcBMI, bmiCategory, calcBMR, calcTDEE, ACTIVITY_LEVELS } from "../data/formulas.js";

export function BiometricsCalculator({ c }) {
  const [form, setForm] = useState({ sex: "female", age: 28, height: 165, weight: 62, activity: "moderate" });
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const bmi = calcBMI(form.weight, form.height);
  const bmr = calcBMR(form.sex, form.weight, form.height, form.age);
  const tdee = calcTDEE(bmr, form.activity);

  const inputStyle = {
    width: "100%", marginTop: 4, background: c.bgAlt, border: `1px solid ${c.border}`,
    borderRadius: 10, padding: "9px 10px", fontFamily: "IBM Plex Mono, monospace",
    fontSize: 13, color: c.ink, outline: "none",
  };
  const labelStyle = { fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint };

  return (
    <>
      <SectionLabel c={c}>Body metrics</SectionLabel>
      <Card c={c} style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <Chip c={c} active={form.sex === "female"} onClick={() => set({ sex: "female" })}>Female</Chip>
          <Chip c={c} active={form.sex === "male"} onClick={() => set({ sex: "male" })}>Male</Chip>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Age</label>
            <input type="number" value={form.age} onChange={(e) => set({ age: +e.target.value })} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Height (cm)</label>
            <input type="number" value={form.height} onChange={(e) => set({ height: +e.target.value })} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Weight (kg)</label>
            <input type="number" value={form.weight} onChange={(e) => set({ weight: +e.target.value })} style={inputStyle} />
          </div>
        </div>

        <label style={labelStyle}>Activity level</label>
        <div style={{ display: "flex", gap: 7, overflowX: "auto", marginTop: 6, marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16, paddingBottom: 2 }}>
          {ACTIVITY_LEVELS.map((a) => (
            <button
              key={a.id}
              onClick={() => set({ activity: a.id })}
              style={{
                minWidth: 108, textAlign: "left", background: form.activity === a.id ? c.primary : c.bgAlt,
                border: "none", borderRadius: 12, padding: "9px 11px", cursor: "pointer", flexShrink: 0,
              }}
            >
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 700, color: form.activity === a.id ? c.bg : c.ink }}>{a.label}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, color: form.activity === a.id ? c.bg : c.inkFaint, opacity: form.activity === a.id ? 0.85 : 1, marginTop: 1 }}>{a.sub}</div>
            </button>
          ))}
        </div>
      </Card>

      <SectionLabel c={c}>Results</SectionLabel>
      <Card c={c} style={{ padding: 6, marginBottom: 16 }}>
        <ResultRow c={c} label="BMI" sub={bmi != null ? bmiCategory(bmi) : "—"} value={bmi != null ? bmi.toFixed(1) : "—"} />
        <ResultRow c={c} label="BMR" sub="Calories burned at rest" value={bmr != null ? `${Math.round(bmr)} kcal/day` : "—"} />
        <ResultRow c={c} label="TDEE" sub="Total daily energy needs" value={tdee != null ? `${Math.round(tdee)} kcal/day` : "—"} last />
      </Card>
    </>
  );
}

function ResultRow({ c, label, sub, value, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 12px", borderBottom: last ? "none" : `1px solid ${c.border}` }}>
      <div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, color: c.ink }}>{label}</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint, marginTop: 1 }}>{sub}</div>
      </div>
      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 15, fontWeight: 700, color: c.primary }}>{value}</span>
    </div>
  );
}
