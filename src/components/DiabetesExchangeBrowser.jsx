import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Card, Chip } from "./Primitives.jsx";
import { getExchangeList, ChakudyaError } from "../data/chakudyaApi.js";

export function DiabetesExchangeBrowser({ c }) {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [group, setGroup] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    getExchangeList()
      .then((data) => {
        if (cancelled) return;
        setRows(data);
        const groups = [...new Set(data.map((r) => r.exchange_type).filter(Boolean))];
        setGroup(groups[0] || null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ChakudyaError ? err.message : "Couldn't load the exchange list.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const groups = useMemo(() => {
    if (!rows) return [];
    return [...new Set(rows.map((r) => r.exchange_type).filter(Boolean))];
  }, [rows]);

  const visible = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    if (q) return rows.filter((r) => r.food_name.toLowerCase().includes(q));
    return rows.filter((r) => r.exchange_type === group);
  }, [rows, group, query]);

  if (loading) {
    return (
      <Card c={c} style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <Loader2 size={16} color={c.inkFaint} style={{ animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft }}>Loading exchange list…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Card>
    );
  }

  if (error) {
    return (
      <Card c={c} style={{ padding: 14, display: "flex", gap: 9, alignItems: "flex-start" }}>
        <AlertCircle size={15} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.danger }}>{error}</span>
      </Card>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: "10px 13px", marginBottom: 12 }}>
        <Search size={15} color={c.inkFaint} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all groups…"
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.ink }}
        />
      </div>

      {!query.trim() && (
        <div style={{ display: "flex", gap: 7, overflowX: "auto", marginBottom: 12, marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
          {groups.map((g) => (
            <Chip key={g} c={c} active={group === g} onClick={() => setGroup(g)}>{g}</Chip>
          ))}
        </div>
      )}

      <Card c={c} style={{ padding: 6 }}>
        {visible.length === 0 ? (
          <div style={{ padding: 16, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint }}>
            No items found.
          </div>
        ) : (
          visible.map((r, i) => (
            <div key={r.id} style={{ padding: "11px 10px", borderBottom: i < visible.length - 1 ? `1px solid ${c.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.ink }}>{r.food_name}</span>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: c.primary, flexShrink: 0 }}>{r.kcal} kcal</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint }}>{r.portion}{query.trim() ? ` · ${r.exchange_type}` : ""}</span>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: c.inkFaint, flexShrink: 0 }}>
                  {r.carbs_g}g carb · {r.protein_g}g pro · {r.fat_g}g fat
                </span>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
