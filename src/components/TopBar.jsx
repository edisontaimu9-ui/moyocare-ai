import { ArrowLeft, Moon, Sun, Bell } from "lucide-react";
import { MoyoMark } from "./MoyoMark.jsx";
import { useNotifications } from "../firebase/NotificationsContext.jsx";
import { NotificationsPanel } from "./NotificationsPanel.jsx";

/* ---------------------------------------------------------------------
   TOP BAR
--------------------------------------------------------------------- */
export function TopBar({ c, dark, setDark, title, onBack }) {
  const { unreadCount, panelOpen, openPanel } = useNotifications();

  return (
    <div style={{ padding: "18px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onBack ? (
          <button onClick={onBack} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ArrowLeft size={17} color={c.ink} />
          </button>
        ) : (
          <MoyoMark c={c} size={32} />
        )}
        <div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: c.ink, lineHeight: 1.1 }}>
            {title || "MoyoCare AI"}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setDark(!dark)} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {dark ? <Sun size={16} color={c.gold} /> : <Moon size={16} color={c.primary} />}
        </button>
        <button onClick={openPanel} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <Bell size={16} color={c.ink} />
          {unreadCount > 0 && (
            <span style={{ position: "absolute", top: 8, right: 9, width: 6, height: 6, borderRadius: 99, background: c.clay }} />
          )}
        </button>
      </div>

      {panelOpen && <NotificationsPanel c={c} />}
    </div>
  );
}
