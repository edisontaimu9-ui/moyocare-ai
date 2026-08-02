import {
  MessageSquare, Bookmark, Clock, ChevronRight, Sun, Moon, Settings, LogOut,
} from "lucide-react";
import { TopBar } from "../components/TopBar.jsx";
import { WovenRule } from "../components/WovenRule.jsx";
import { Card, Chip, SectionLabel } from "../components/Primitives.jsx";
import { AuthPanel } from "../components/AuthPanel.jsx";
import { useAuth } from "../firebase/AuthContext.jsx";

/* ---------------------------------------------------------------------
   PROFILE
--------------------------------------------------------------------- */
export function ProfileScreen({ c, dark, setDark }) {
  const { user, loading, logOut } = useAuth();

  const rows = [
    { icon: MessageSquare, label: "Saved conversations", count: 12 },
    { icon: Bookmark, label: "Saved foods", count: 34 },
    { icon: Clock, label: "Scan history", count: 21 },
  ];

  const displayName = user?.displayName || (user?.email ? user.email.split("@")[0] : "");
  const initial = displayName ? displayName[0].toUpperCase() : "?";

  return (
    <div style={{ paddingBottom: 18 }}>
      <TopBar c={c} dark={dark} setDark={setDark} title="Profile" />
      <WovenRule c={c} />
      <div style={{ padding: "18px 20px 0" }}>

        {loading ? (
          <Card c={c} style={{ padding: 18 }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkFaint }}>Loading account…</div>
          </Card>
        ) : !user ? (
          <AuthPanel c={c} />
        ) : (
          <>
            <Card c={c} style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="" style={{ width: 56, height: 56, borderRadius: 18, objectFit: "cover" }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 18, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 600, color: c.bg }}>
                  {initial}
                </div>
              )}
              <div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: c.ink }}>{displayName || "MoyoCare user"}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.inkFaint, marginTop: 2 }}>{user.email || "General public account"}</div>
              </div>
            </Card>

            <div style={{ marginTop: 18 }}>
              <SectionLabel c={c}>Dietary preferences</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Low sodium", "High fibre", "Vegetarian-friendly", "Renal-aware"].map((p, i) => (
                  <Chip key={i} c={c} active tone="primary">{p}</Chip>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <SectionLabel c={c}>Health goals</SectionLabel>
              <Card c={c} style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.ink }}>Lower blood pressure</span>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: c.primary }}>62%</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: c.bgAlt, overflow: "hidden" }}>
                  <div style={{ width: "62%", height: "100%", background: c.primary, borderRadius: 99 }} />
                </div>
              </Card>
            </div>

            <div style={{ marginTop: 18 }}>
              <SectionLabel c={c}>Activity</SectionLabel>
              <Card c={c} style={{ padding: 6 }}>
                {rows.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 10px", borderBottom: i < rows.length - 1 ? `1px solid ${c.border}` : "none" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: c.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <r.icon size={14} color={c.primary} />
                    </div>
                    <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500, color: c.ink }}>{r.label}</span>
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11.5, color: c.inkFaint }}>{r.count}</span>
                    <ChevronRight size={14} color={c.inkFaint} />
                  </div>
                ))}
              </Card>
            </div>
          </>
        )}

        <div style={{ marginTop: 18 }}>
          <SectionLabel c={c}>Settings</SectionLabel>
          <Card c={c} style={{ padding: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 10px", borderBottom: user ? `1px solid ${c.border}` : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: c.goldSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {dark ? <Sun size={14} color={c.gold} /> : <Moon size={14} color={c.gold} />}
              </div>
              <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500, color: c.ink }}>Appearance</span>
              <button onClick={() => setDark(!dark)} style={{ width: 40, height: 22, borderRadius: 99, background: dark ? c.primary : c.bgAlt, border: "none", cursor: "pointer", position: "relative" }}>
                <div style={{ width: 16, height: 16, borderRadius: 99, background: c.surfaceSolid, position: "absolute", top: 3, left: dark ? 21 : 3, transition: "left 0.2s" }} />
              </button>
            </div>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 10px" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: c.claySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Settings size={14} color={c.clay} />
                </div>
                <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500, color: c.ink }}>Account settings</span>
                <ChevronRight size={14} color={c.inkFaint} />
              </div>
            )}
          </Card>
        </div>

        {user && (
          <button onClick={logOut} style={{ width: "100%", marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: `1px solid ${c.border}`, borderRadius: 14, padding: "12px", cursor: "pointer" }}>
            <LogOut size={14} color={c.danger} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: c.danger }}>Log out</span>
          </button>
        )}
      </div>
    </div>
  );
}
