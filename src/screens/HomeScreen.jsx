import { useEffect, useState } from "react";
import {
  Sparkles, ScanLine, UtensilsCrossed, Search, Stethoscope, Activity,
  Calculator, MessageSquare, Bookmark, LogIn, Loader2, AlertCircle,
} from "lucide-react";
import { TopBar } from "../components/TopBar.jsx";
import { WovenRule } from "../components/WovenRule.jsx";
import { Card, SectionLabel } from "../components/Primitives.jsx";
import { DonutRing, MacroBar } from "../components/Charts.jsx";
import { useAuth } from "../firebase/AuthContext.jsx";
import { subscribeTodaysMealLogs, subscribeRecentMealLogs } from "../firebase/mealLog.js";
import { subscribeSavedFoods } from "../firebase/savedFoods.js";
import { askChakudya, ChakudyaAskError } from "../data/chakudyaRag.js";

// General public daily-reference values (not a personalized target — no
// biometric profile is stored yet to compute a real one from).
const REFERENCE_KCAL = 2000;

function timeAgo(ts) {
  if (!ts?.toDate) return "";
  const d = ts.toDate();
  const diffMs = Date.now() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24 && d.toDateString() === new Date().toDateString()) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  const days = Math.round(hrs / 24);
  if (days < 7) return days === 1 ? "Yesterday" : `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ---------------------------------------------------------------------
   HOME
--------------------------------------------------------------------- */
export function HomeScreen({ c, dark, setDark, goto }) {
  const { user, loading: authLoading } = useAuth();

  const [todaysMeals, setTodaysMeals] = useState([]);
  const [recentMeals, setRecentMeals] = useState([]);
  const [savedFoods, setSavedFoods] = useState([]);

  const [insight, setInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState("");

  useEffect(() => {
    if (!user) { setTodaysMeals([]); setRecentMeals([]); setSavedFoods([]); return; }
    const unsub1 = subscribeTodaysMealLogs(user.uid, setTodaysMeals, () => {});
    const unsub2 = subscribeRecentMealLogs(user.uid, 5, setRecentMeals, () => {});
    const unsub3 = subscribeSavedFoods(user.uid, setSavedFoods, () => {});
    return () => { unsub1(); unsub2(); unsub3(); };
  }, [user]);

  useEffect(() => { setInsight(null); setInsightError(""); }, [user]);

  const totals = todaysMeals.reduce(
    (t, m) => ({
      kcal: t.kcal + (m.kcal || 0),
      protein_g: t.protein_g + (m.protein_g || 0),
      carbs_g: t.carbs_g + (m.carbs_g || 0),
      fat_g: t.fat_g + (m.fat_g || 0),
    }),
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );

  const getInsight = async () => {
    setInsightLoading(true);
    setInsightError("");
    try {
      const foodList = todaysMeals.map((m) => m.foodName).join(", ");
      const query = `Based on a day's food log so far totaling roughly ${Math.round(totals.kcal)} kcal, ${Math.round(totals.protein_g)}g protein, ${Math.round(totals.carbs_g)}g carbs, and ${Math.round(totals.fat_g)}g fat — foods logged: ${foodList || "none specified"} — what's one specific, practical nutrition observation or suggestion?`;
      const result = await askChakudya(query);
      setInsight(result);
    } catch (err) {
      setInsightError(err instanceof ChakudyaAskError ? err.message : "Couldn't generate an insight right now.");
    } finally {
      setInsightLoading(false);
    }
  };

  const quick = [
    { icon: Sparkles, label: "Ask AI", tone: "primary" },
    { icon: ScanLine, label: "Scan Barcode", tone: "clay" },
    { icon: UtensilsCrossed, label: "Analyze Meal", tone: "gold" },
    { icon: Search, label: "Food Search", tone: "primary" },
    { icon: Stethoscope, label: "Medical Search", tone: "clay" },
    { icon: Activity, label: "Symptom Education", tone: "gold" },
    { icon: Calculator, label: "Calculators", tone: "primary" },
  ];
  const toneColor = (t) => (t === "primary" ? c.primary : t === "clay" ? c.clay : c.gold);
  const toneSoft = (t) => (t === "primary" ? c.primarySoft : t === "clay" ? c.claySoft : c.goldSoft);

  const firstName = user?.displayName?.split(" ")[0] || (user?.email ? user.email.split("@")[0] : null);
  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const kcalPct = Math.min(1, totals.kcal / REFERENCE_KCAL);

  return (
    <div style={{ paddingBottom: 18 }}>
      <TopBar c={c} dark={dark} setDark={setDark} />
      <WovenRule c={c} />

      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 23, fontWeight: 600, color: c.ink }}>
          {firstName ? `Muli bwanji, ${firstName}` : "Muli bwanji"} 👋
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkFaint, marginTop: 2 }}>
          {todayLabel} · Your health snapshot for today
        </div>

        {/* AI Search bar */}
        <button
          onClick={() => goto("assistant")}
          style={{
            width: "100%", marginTop: 16, display: "flex", alignItems: "center", gap: 10,
            background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 16,
            padding: "13px 16px", cursor: "pointer", boxShadow: c.shadow,
          }}
        >
          <Sparkles size={17} color={c.gold} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: c.inkFaint, textAlign: "left" }}>
            Ask MoyoCare AI anything…
          </span>
        </button>

        {/* Quick actions */}
        <div style={{ marginTop: 22 }}>
          <SectionLabel c={c}>Quick actions</SectionLabel>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
            {quick.map((q, i) => (
              <button
                key={i}
                onClick={() => goto(q.label === "Ask AI" ? "assistant" : q.label.includes("Food") || q.label.includes("Meal") || q.label.includes("Barcode") || q.label.includes("Calc") ? "nutrition" : "medical")}
                style={{
                  minWidth: 82, background: c.surfaceSolid, border: `1px solid ${c.border}`,
                  borderRadius: 16, padding: "14px 10px", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 8, cursor: "pointer",
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 11, background: toneSoft(q.tone), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <q.icon size={16} color={toneColor(q.tone)} />
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600, color: c.ink, textAlign: "center", lineHeight: 1.2 }}>
                  {q.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {!user && !authLoading ? (
          <div style={{ marginTop: 22 }}>
            <Card c={c} style={{ padding: 18, textAlign: "center" }}>
              <LogIn size={20} color={c.inkFaint} style={{ margin: "0 auto 10px", display: "block" }} />
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft, lineHeight: 1.5 }}>
                Sign in from the Profile tab to track your daily nutrition, save foods, and see your activity here.
              </div>
            </Card>
          </div>
        ) : (
          <>
            {/* Daily nutrition summary */}
            <div style={{ marginTop: 22 }}>
              <SectionLabel c={c}>Daily nutrition summary</SectionLabel>
              <Card c={c} style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ position: "relative", width: 92, height: 92 }}>
                    <DonutRing c={c} pct={kcalPct} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 15, color: c.ink }}>{Math.round(totals.kcal)}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, color: c.inkFaint }}>/ {REFERENCE_KCAL} kcal</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <MacroBar c={c} label="Protein" value={Math.round(totals.protein_g)} max={90} tone={c.primary} />
                    <MacroBar c={c} label="Carbs" value={Math.round(totals.carbs_g)} max={220} tone={c.clay} />
                    <MacroBar c={c} label="Fat" value={Math.round(totals.fat_g)} max={60} tone={c.gold} />
                  </div>
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: c.inkFaint, marginTop: 12 }}>
                  Against a general 2,000 kcal daily reference — not a personalized target.
                </div>
              </Card>
            </div>

            {/* AI insight — user-triggered, grounded in today's real log */}
            <div style={{ marginTop: 14 }}>
              {insight ? (
                <Card c={c} style={{ padding: 16, background: dark ? "rgba(111,207,158,0.08)" : "#E2EEE7", border: `1px solid ${c.primary}22` }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 10, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Sparkles size={14} color={c.bg} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, color: c.ink }}>AI insight</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkSoft, marginTop: 3, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                        {insight.answer}
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <button
                  onClick={getInsight}
                  disabled={insightLoading || todaysMeals.length === 0}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: "12px",
                    cursor: (insightLoading || todaysMeals.length === 0) ? "default" : "pointer",
                    opacity: todaysMeals.length === 0 ? 0.5 : 1,
                  }}
                >
                  {insightLoading ? <Loader2 size={14} color={c.gold} style={{ animation: "spin 0.8s linear infinite" }} /> : <Sparkles size={14} color={c.gold} />}
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.ink }}>
                    {todaysMeals.length === 0 ? "Log a meal to get an AI insight" : insightLoading ? "Thinking…" : "Get today's AI insight"}
                  </span>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </button>
              )}
              {insightError && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <AlertCircle size={13} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.danger }}>{insightError}</span>
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div style={{ marginTop: 22 }}>
              <SectionLabel c={c} action="See all" onAction={() => goto("nutrition")}>Recent activity</SectionLabel>
              {recentMeals.length === 0 ? (
                <Card c={c} style={{ padding: 18, textAlign: "center" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint }}>Nothing logged yet.</div>
                </Card>
              ) : (
                <Card c={c} style={{ padding: 6 }}>
                  {recentMeals.map((m, i) => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderBottom: i < recentMeals.length - 1 ? `1px solid ${c.border}` : "none" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: c.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <UtensilsCrossed size={14} color={c.primary} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.ink, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          Logged {m.mealType?.toLowerCase()} — {m.foodName}
                        </div>
                      </div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint, flexShrink: 0 }}>{timeAgo(m.loggedAt)}</span>
                    </div>
                  ))}
                </Card>
              )}
            </div>

            {/* Saved foods */}
            <div style={{ marginTop: 22 }}>
              <SectionLabel c={c} action="See all" onAction={() => goto("nutrition")}>Saved foods</SectionLabel>
              {savedFoods.length === 0 ? (
                <Card c={c} style={{ padding: 18, textAlign: "center" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint }}>
                    Tap the bookmark icon on any food in Nutrition search to save it here.
                  </div>
                </Card>
              ) : (
                <div style={{ display: "flex", gap: 10, overflowX: "auto", marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
                  {savedFoods.map((f) => (
                    <div key={f.id} style={{ minWidth: 128, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 14, padding: 12 }}>
                      <Bookmark size={13} color={c.clay} fill={c.clay} />
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: c.ink, marginTop: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.food_name}</div>
                      <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, color: c.inkFaint, marginTop: 3 }}>
                        {f.energy_kcal != null ? `${Math.round(f.energy_kcal)} kcal · ` : ""}per 100g
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
