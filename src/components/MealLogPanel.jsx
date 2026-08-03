import { useEffect, useState } from "react";
import { Plus, LogIn, AlertCircle } from "lucide-react";
import { Card, SectionLabel } from "./Primitives.jsx";
import { LogMealForm } from "./LogMealForm.jsx";
import { MealLogList } from "./MealLogList.jsx";
import { useAuth } from "../firebase/AuthContext.jsx";
import { subscribeTodaysMealLogs } from "../firebase/mealLog.js";

export function MealLogPanel({ c }) {
  const { user, loading: authLoading } = useAuth();
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeTodaysMealLogs(
      user.uid,
      (data) => { setMeals(data); setError(""); },
      () => setError("Couldn't load today's meals. Check your connection.")
    );
    return unsub;
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <Card c={c} style={{ padding: 18, textAlign: "center" }}>
        <LogIn size={20} color={c.inkFaint} style={{ margin: "0 auto 10px", display: "block" }} />
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft, lineHeight: 1.5 }}>
          Sign in from the Profile tab to log meals and keep a running history.
        </div>
      </Card>
    );
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <SectionLabel c={c}>Today's log</SectionLabel>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", marginBottom: 10 }}>
            <Plus size={14} color={c.primary} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: c.primary }}>Log a meal</span>
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ marginBottom: 16 }}>
          <LogMealForm c={c} uid={user.uid} onLogged={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {error && (
        <Card c={c} style={{ padding: 14, marginBottom: 12, display: "flex", gap: 9, alignItems: "flex-start" }}>
          <AlertCircle size={15} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.danger }}>{error}</span>
        </Card>
      )}

      <MealLogList c={c} uid={user.uid} meals={meals} />
    </>
  );
}
