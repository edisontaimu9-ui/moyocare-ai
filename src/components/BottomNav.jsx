import { Home, Sparkles, Apple, Stethoscope, User } from "lucide-react";

/* ---------------------------------------------------------------------
   BOTTOM NAV
--------------------------------------------------------------------- */
export function BottomNav({ c, active, setActive }) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "assistant", icon: Sparkles, label: "Assistant" },
    { id: "nutrition", icon: Apple, label: "Nutrition" },
    { id: "medical", icon: Stethoscope, label: "Medical" },
    { id: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderTop: `1px solid ${c.border}`,
        background: c.surfaceSolid,
        padding: "9px 6px calc(env(safe-area-inset-bottom, 0px) + 9px)",
      }}
    >
      {items.map((it) => {
        const isActive = active === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => setActive(it.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "4px 0",
            }}
          >
            <div
              style={{
                width: 40,
                height: 26,
                borderRadius: 13,
                background: isActive ? c.primarySoft : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              <Icon size={17} color={isActive ? c.primary : c.inkFaint} strokeWidth={isActive ? 2.4 : 2} />
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? c.primary : c.inkFaint }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
