import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Card } from "./Primitives.jsx";
import { getRenalFoods, ChakudyaError } from "../data/chakudyaApi.js";

function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export function RenalFoodBrowser({ c }) {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    getRenalFoods()
      .then((data) => !cancelled && setRows(data))
      .catch((err) => !cancelled && setError(err instanceof ChakudyaError ? err.message : "Couldn't load the renal food list."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const visible = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return rows.filter((r) => r.name?.toLowerCase().includes(q)).slice(0, 40);
  }, [rows, query]);

  if (loading) {
    return (
      <Card c={c} style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <Loader2 size={16} color={c.inkFaint} style={{ animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft }}>Loading renal food list…</span>
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
          placeholder={`Search ${rows?.length ?? ""} renal foods…`}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.ink }}
        />
      </div>

      {query.trim().length < 2 ? (
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint, padding: "8px 2px" }}>
          Type a food name to see its potassium, phosphorus, and sodium content per portion.
        </div>
      ) : (
        <Card c={c} style={{ padding: 6 }}>
          {visible.length === 0 ? (
            <div style={{ padding: 16, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint }}>
              No matches.
            </div>
          ) : (
            visible.map((r, i) => {
              const kj = num(r.energy_kj);
              const na = num(r.na), k = num(r.k), po4 = num(r.po4);
              return (
                <div key={r.id} style={{ padding: "11px 10px", borderBottom: i < visible.length - 1 ? `1px solid ${c.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.ink }}>{r.name}</span>
                    {kj != null && (
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, color: c.inkFaint, flexShrink: 0 }}>
                        {Math.round(kj)} kJ
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint, marginTop: 1 }}>
                    {r.grams}{r.measure ? ` · ${r.measure}` : ""}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
                    <ElectrolyteChip c={c} label="Na" value={na} unit="mg" tone={c.clay} bg={c.claySoft} />
                    <ElectrolyteChip c={c} label="K" value={k} unit="mg" tone={c.gold} bg={c.goldSoft} />
                    <ElectrolyteChip c={c} label="PO₄" value={po4} unit="mg" tone={c.primary} bg={c.primarySoft} />
                  </div>
                </div>
              );
            })
          )}
        </Card>
      )}
    </div>
  );
}

function ElectrolyteChip({ c, label, value, unit, tone, bg }) {
  if (value == null) return null;
  return (
    <span style={{ background: bg, color: tone, fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, fontWeight: 600, borderRadius: 8, padding: "3px 8px" }}>
      {label} {Math.round(value)}{unit}
    </span>
  );
}
