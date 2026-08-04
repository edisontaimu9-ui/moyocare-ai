import { X, Bell, BellOff, BellRing, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../firebase/AuthContext.jsx";
import { useNotifications } from "../firebase/NotificationsContext.jsx";

function timeAgo(ts) {
  if (!ts?.toDate) return "";
  const d = ts.toDate();
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function NotificationsPanel({ c }) {
  const { user } = useAuth();
  const { notifications, permission, enabling, enableError, enablePush, closePanel } = useNotifications();

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 900, display: "flex", alignItems: "flex-end" }} onClick={closePanel}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxHeight: "80vh", background: c.bg, borderRadius: "22px 22px 0 0", display: "flex", flexDirection: "column", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px" }}>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: c.ink }}>Notifications</span>
          <button onClick={closePanel} style={{ background: c.bgAlt, border: "none", borderRadius: 10, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={15} color={c.ink} />
          </button>
        </div>

        <div style={{ overflowY: "auto", padding: "0 20px 20px" }}>
          {!user ? (
            <EmptyState c={c} icon={Bell} text="Sign in from the Profile tab to receive notifications." />
          ) : permission !== "granted" ? (
            <div style={{ textAlign: "center", padding: "24px 10px" }}>
              <BellRing size={26} color={c.inkFaint} style={{ margin: "0 auto 12px", display: "block" }} />
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkSoft, lineHeight: 1.5, marginBottom: 14 }}>
                {permission === "denied"
                  ? "Notifications are blocked for this site. Enable them in your browser's site settings to receive reminders."
                  : "Turn on notifications to get reminders like logging meals or new health tips."}
              </div>
              {permission !== "denied" && (
                <button
                  onClick={enablePush}
                  disabled={enabling}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: c.primary, color: c.bg, border: "none", borderRadius: 12, padding: "11px 18px", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, cursor: enabling ? "default" : "pointer", opacity: enabling ? 0.7 : 1 }}
                >
                  {enabling ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Bell size={14} />}
                  {enabling ? "Enabling…" : "Enable notifications"}
                </button>
              )}
              {enableError && (
                <div style={{ display: "flex", gap: 7, marginTop: 12, textAlign: "left" }}>
                  <AlertCircle size={13} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.danger }}>{enableError}</span>
                </div>
              )}
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState c={c} icon={BellOff} text="No notifications yet. You'll see reminders and updates here." />
          ) : (
            notifications.map((n) => (
              <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 2px", borderBottom: `1px solid ${c.border}` }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: c.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bell size={13} color={c.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, color: c.ink }}>{n.title}</div>
                  {n.body && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkSoft, marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>}
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: c.inkFaint, marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ c, icon: Icon, text }) {
  return (
    <div style={{ textAlign: "center", padding: "24px 10px" }}>
      <Icon size={22} color={c.inkFaint} style={{ margin: "0 auto 10px", display: "block" }} />
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: c.inkFaint, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}
