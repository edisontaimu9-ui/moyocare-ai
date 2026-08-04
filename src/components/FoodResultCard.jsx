import { Bookmark } from "lucide-react";

const NUTRIENT_LABELS = [
  ["energy_kcal", "Calories", "kcal"],
  ["protein_g", "Protein", "g"],
  ["carbs_g", "Carbs", "g"],
  ["fat_g", "Fat", "g"],
  ["fiber_g", "Fibre", "g"],
  ["sodium_mg", "Sodium", "mg"],
];

export function FoodResultCard({ c, food, sourceLabel, Card, isSaved, onToggleSave }) {
  const stats = NUTRIENT_LABELS.filter(([key]) => food[key] !== null && food[key] !== undefined);

  return (
    <Card c={c} style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 600, color: c.ink }}>
            {food.food_name || "Unnamed food"}
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: c.inkFaint, marginTop: 2 }}>
            {food.measure ? `${food.measure}` : "Per 100g"}{food.category ? ` · ${food.category}` : ""}{sourceLabel ? ` · ${sourceLabel}` : ""}
          </div>
        </div>
        {onToggleSave ? (
          <button onClick={() => onToggleSave(food)} style={{ background: "none", border: "none", padding: 4, cursor: "pointer", display: "flex", flexShrink: 0 }} aria-label={isSaved ? "Remove bookmark" : "Save food"}>
            <Bookmark size={16} color={c.clay} fill={isSaved ? c.clay : "none"} />
          </button>
        ) : (
          <Bookmark size={16} color={c.clay} />
        )}
      </div>

      {stats.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 14 }}>
          {stats.map(([key, label, unit]) => (
            <div key={key}>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, fontWeight: 600, color: c.ink }}>
                {Math.round(food[key] * 10) / 10}{unit}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: c.inkFaint }}>{label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint, marginTop: 10 }}>
          Nutrient data isn't available for this item yet.
        </div>
      )}
    </Card>
  );
}
