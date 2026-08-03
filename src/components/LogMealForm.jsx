import { useEffect, useState } from "react";
import { Search, Loader2, AlertCircle, Check } from "lucide-react";
import { Card, Chip } from "./Primitives.jsx";
import { searchFoods, ChakudyaError } from "../data/chakudyaApi.js";
import { addMealLog } from "../firebase/mealLog.js";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export function LogMealForm({ c, uid, onLogged, onCancel }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selected, setSelected] = useState(null);
  const [mealType, setMealType] = useState("Breakfast");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearchError("");
      return;
    }
    setSearching(true);
    setSearchError("");
    const handle = setTimeout(async () => {
      try {
        const { data } = await searchFoods(q);
        setResults(data);
      } catch (err) {
        setSearchError(err instanceof ChakudyaError ? err.message : "Search failed.");
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [query]);

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveError("");
    try {
      await addMealLog(uid, {
        foodName: selected.food_name,
        mealType,
        portionLabel: "100g",
        kcal: selected.energy_kcal ?? null,
        protein_g: selected.protein_g ?? null,
        carbs_g: selected.carbs_g ?? null,
        fat_g: selected.fat_g ?? null,
      });
      onLogged();
    } catch {
      setSaveError("Couldn't save that meal. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (selected) {
    return (
      <Card c={c} style={{ padding: 16 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 600, color: c.ink }}>{selected.food_name}</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: c.inkFaint, marginTop: 2, marginBottom: 14 }}>
          Per 100g · {selected.energy_kcal != null ? `${Math.round(selected.energy_kcal)} kcal` : "kcal unavailable"}
        </div>

        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint, marginBottom: 6 }}>Meal type</div>
        <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
          {MEAL_TYPES.map((t) => (
            <Chip key={t} c={c} active={mealType === t} onClick={() => setMealType(t)}>{t}</Chip>
          ))}
        </div>

        {saveError && (
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.danger, marginBottom: 12 }}>{saveError}</div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setSelected(null)} style={{ flex: 1, background: c.bgAlt, border: "none", borderRadius: 12, padding: "11px", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.inkSoft, cursor: "pointer" }}>
            Back
          </button>
          <button onClick={save} disabled={saving} style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: c.primary, color: c.bg, border: "none", borderRadius: 12, padding: "11px", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Check size={14} />}
            {saving ? "Saving…" : "Log this meal"}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Card>
    );
  }

  return (
    <Card c={c} style={{ padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.bgAlt, borderRadius: 12, padding: "9px 12px", marginBottom: 10 }}>
        <Search size={15} color={c.inkFaint} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a food to log…"
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }}
        />
        {searching && <Loader2 size={14} color={c.inkFaint} style={{ animation: "spin 0.8s linear infinite" }} />}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {searchError && (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
          <AlertCircle size={13} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.danger }}>{searchError}</span>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {results.map((f, i) => (
            <button
              key={f.id ?? i}
              onClick={() => setSelected(f)}
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 4px", borderBottom: i < results.length - 1 ? `1px solid ${c.border}` : "none" }}
            >
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.ink }}>{f.food_name}</span>
              {f.energy_kcal != null && (
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: c.inkFaint }}>{Math.round(f.energy_kcal)} kcal</span>
              )}
            </button>
          ))}
        </div>
      )}

      <button onClick={onCancel} style={{ width: "100%", background: "none", border: "none", padding: "6px 0", fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.inkFaint, cursor: "pointer" }}>
        Cancel
      </button>
    </Card>
  );
}
