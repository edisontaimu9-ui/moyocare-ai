import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { Card, Chip } from "./Primitives.jsx";
import { getEnteralFormulas, ChakudyaError } from "../data/chakudyaApi.js";

export function EnteralFormulaBrowser({ c }) {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getEnteralFormulas()
      .then((data) => {
        if (cancelled) return;
        setRows(data);
        const cats = [...new Set(data.map((r) => r.category).filter(Boolean))];
        setCategory(cats[0] || null);
      })
      .catch((err) => !cancelled && setError(err instanceof ChakudyaError ? err.message : "Couldn't load the formula list."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    if (!rows) return [];
    return [...new Set(rows.map((r) => r.category).filter(Boolean))];
  }, [rows]);

  const visible = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    if (q) {
      return rows.filter((r) =>
        r.formula?.toLowerCase().includes(q) ||
        r.tags?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q)
      );
    }
    return rows.filter((r) => r.category === category);
  }, [rows, category, query]);

  if (loading) {
    return (
      <Card c={c} style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <Loader2 size={16} color={c.inkFaint} style={{ animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft }}>Loading formula list…</span>
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
          placeholder="Search formulas or tags…"
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.ink }}
        />
      </div>

      {!query.trim() && (
        <div style={{ display: "flex", gap: 7, overflowX: "auto", marginBottom: 12, marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
          {categories.map((cat) => (
            <Chip key={cat} c={c} active={category === cat} onClick={() => setCategory(cat)}>{cat}</Chip>
          ))}
        </div>
      )}

      <Card c={c} style={{ padding: 6 }}>
        {visible.length === 0 ? (
          <div style={{ padding: 16, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint }}>
            No matches.
          </div>
        ) : (
          visible.map((r, i) => {
            const isOpen = expanded === r.id;
            return (
              <div key={r.id} style={{ borderBottom: i < visible.length - 1 ? `1px solid ${c.border}` : "none" }}>
                <button
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "11px 10px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.ink }}>{r.formula}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint, marginTop: 1 }}>{r.route}{query.trim() ? ` · ${r.category}` : ""}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: c.primary }}>{r.kcal_per_ml} kcal/mL</span>
                      <ChevronDown size={13} color={c.inkFaint} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c.border}` }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 10 }}>
                        <Stat c={c} label="Protein" value={`${r.protein_g_per_l} g/L`} sub={r.protein_pct_e ? `${r.protein_pct_e} of energy` : null} />
                        <Stat c={c} label="Carbs" value={`${r.cho_g_per_l} g/L`} />
                        <Stat c={c} label="Fat" value={`${r.fat_g_per_l} g/L`} />
                        {r.fibre_g_per_l != null && <Stat c={c} label="Fibre" value={`${r.fibre_g_per_l} g/L`} />}
                        {r.osmol != null && <Stat c={c} label="Osmolality" value={`${r.osmol} mOsm/kg`} />}
                        <Stat c={c} label="Per 500 mL" value={`${r.kcal_per_500ml} kcal`} />
                      </div>
                      {r.tags && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                          {r.tags.split("|").map((t, ti) => (
                            <span key={ti} style={{ background: c.primarySoft, color: c.primary, fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, borderRadius: 7, padding: "3px 8px" }}>
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {r.notes && (
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.inkSoft, lineHeight: 1.5 }}>{r.notes}</div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}

function Stat({ c, label, value, sub }) {
  return (
    <div>
      <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, fontWeight: 600, color: c.ink }}>{value}</div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, color: c.inkFaint }}>{label}{sub ? ` · ${sub}` : ""}</div>
    </div>
  );
}
