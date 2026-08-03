import { X, UtensilsCrossed } from "lucide-react";
import { Card } from "./Primitives.jsx";
import { deleteMealLog } from "../firebase/mealLog.js";

export function MealLogList({ c, uid, meals }) {
  const totals = meals.reduce(
    (t, m) => ({
      kcal: t.kcal + (m.kcal || 0),
      protein_g: t.protein_g + (m.protein_g || 0),
      carbs_g: t.carbs_g + (m.carbs_g || 0),
      fat_g: t.fat_g + (m.fat_g || 0),
    }),
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );

  const timeLabel = (loggedAt) => {
    if (!loggedAt?.toDate) return "";
    return loggedAt.toDate().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  if (meals.length === 0) {
    return (
      <Card c={c} style={{ padding: 20, textAlign: "center" }}>
        <UtensilsCrossed size={20} color={c.inkFaint} style={{ margin: "0 auto 8px", display: "block" }} />
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkFaint }}>Nothing logged today yet.</div>
      </Card>
    );
  }

  return (
    <>
      <Card c={c} style={{ padding: "12px 14px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", background: c.primarySoft, border: "none" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: c.primary }}>Today's total</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 15, fontWeight: 700, color: c.primary }}>{Math.round(totals.kcal)} kcal</span>
      </Card>

      <Card c={c} style={{ padding: 6 }}>
        {meals.map((m, i) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderBottom: i < meals.length - 1 ? `1px solid ${c.border}` : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: c.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <UtensilsCrossed size={14} color={c.primary} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.foodName}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint }}>
                {m.mealType} · {timeLabel(m.loggedAt)}{m.kcal != null ? ` · ${Math.round(m.kcal)} kcal` : ""}
              </div>
            </div>
            <button onClick={() => deleteMealLog(uid, m.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4, flexShrink: 0 }} aria-label="Delete">
              <X size={14} color={c.inkFaint} />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}
