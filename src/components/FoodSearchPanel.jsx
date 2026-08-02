import { useEffect, useState } from "react";
import { Search, ScanLine, Loader2, AlertCircle } from "lucide-react";
import { Card, SectionLabel } from "./Primitives.jsx";
import { FoodResultCard } from "./FoodResultCard.jsx";
import { searchFoods, lookupFood, ChakudyaError } from "../data/chakudyaApi.js";

const SOURCE_LABELS = {
  usda_fdc: "USDA FoodData Central",
  open_food_facts: "Open Food Facts",
  fatsecret: "FatSecret",
  local: "Malawi FCT",
};

export function FoodSearchPanel({ c }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const [external, setExternal] = useState(null); // { food, source } | null
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState("");

  // Debounced local search as the person types.
  useEffect(() => {
    setExternal(null);
    setExternalError("");
    setSelected(null);

    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    const handle = setTimeout(async () => {
      try {
        const { data } = await searchFoods(q);
        setResults(data);
      } catch (err) {
        setError(err instanceof ChakudyaError ? err.message : "Search failed. Try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(handle);
  }, [query]);

  const searchWider = async () => {
    setExternalLoading(true);
    setExternalError("");
    try {
      const found = await lookupFood(query.trim());
      if (!found) setExternalError(`No match for "${query.trim()}" in any connected source.`);
      else setExternal(found);
    } catch (err) {
      setExternalError(err instanceof ChakudyaError ? err.message : "Lookup failed. Try again.");
    } finally {
      setExternalLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: "11px 14px", marginBottom: 12 }}>
        <Search size={16} color={c.inkFaint} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search foods, e.g. nsima, chambo…"
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }}
        />
        {loading && <Loader2 size={15} color={c.inkFaint} style={{ animation: "spin 0.8s linear infinite" }} />}
        <ScanLine size={16} color={c.clay} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {query.trim().length < 2 && (
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint, padding: "8px 2px" }}>
          Start typing a food name to search the Malawi Food Composition Table.
        </div>
      )}

      {error && (
        <Card c={c} style={{ padding: 14, marginBottom: 12, display: "flex", gap: 9, alignItems: "flex-start" }}>
          <AlertCircle size={15} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.danger }}>{error}</span>
        </Card>
      )}

      {!error && !loading && query.trim().length >= 2 && results.length > 0 && !selected && (
        <>
          <SectionLabel c={c}>{results.length} match{results.length === 1 ? "" : "es"}</SectionLabel>
          <Card c={c} style={{ padding: 6, marginBottom: 16 }}>
            {results.map((f, i) => (
              <button
                key={f.id ?? i}
                onClick={() => setSelected(f)}
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 10px", borderBottom: i < results.length - 1 ? `1px solid ${c.border}` : "none" }}
              >
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: c.ink }}>{f.food_name}</div>
                  {f.category && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint, marginTop: 1 }}>{f.category}</div>}
                </div>
                {f.energy_kcal != null && (
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11.5, color: c.inkFaint }}>{Math.round(f.energy_kcal)} kcal</span>
                )}
              </button>
            ))}
          </Card>
        </>
      )}

      {selected && (
        <>
          <SectionLabel c={c}>Result</SectionLabel>
          <FoodResultCard c={c} food={selected} Card={Card} />
        </>
      )}

      {!error && !loading && query.trim().length >= 2 && results.length === 0 && !external && (
        <Card c={c} style={{ padding: 16, textAlign: "center" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft, marginBottom: 12 }}>
            No local match for "{query.trim()}" in the Malawi FCT.
          </div>
          <button
            onClick={searchWider}
            disabled={externalLoading}
            style={{ background: c.primary, color: c.bg, border: "none", borderRadius: 12, padding: "10px 16px", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, cursor: externalLoading ? "default" : "pointer", opacity: externalLoading ? 0.7 : 1 }}
          >
            {externalLoading ? "Searching wider databases…" : "Search wider databases"}
          </button>
          {externalError && (
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.danger, marginTop: 10 }}>{externalError}</div>
          )}
        </Card>
      )}

      {external && (
        <>
          <SectionLabel c={c}>Result</SectionLabel>
          <FoodResultCard c={c} food={external.food} sourceLabel={SOURCE_LABELS[external.source] || external.source} Card={Card} />
        </>
      )}
    </>
  );
}
