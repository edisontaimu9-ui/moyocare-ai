import { useState } from "react";
import { TOKENS } from "./theme/tokens.js";
import { FONTS } from "./theme/fonts.js";
import { BottomNav } from "./components/BottomNav.jsx";
import { HomeScreen } from "./screens/HomeScreen.jsx";
import { AssistantScreen } from "./screens/AssistantScreen.jsx";
import { NutritionScreen } from "./screens/NutritionScreen.jsx";
import { MedicalScreen } from "./screens/MedicalScreen.jsx";
import { ProfileScreen } from "./screens/ProfileScreen.jsx";

/* ---------------------------------------------------------------------
   APP
   Real app shell — fills the actual viewport (no decorative phone
   frame). Content is capped at a comfortable mobile width and centered
   on wider screens, the same pattern real responsive PWAs use.
--------------------------------------------------------------------- */
export default function App() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("home");
  const c = dark ? TOKENS.dark : TOKENS.light;

  const screens = {
    home: <HomeScreen c={c} dark={dark} setDark={setDark} goto={setTab} />,
    assistant: <AssistantScreen c={c} dark={dark} setDark={setDark} />,
    nutrition: <NutritionScreen c={c} dark={dark} setDark={setDark} />,
    medical: <MedicalScreen c={c} dark={dark} setDark={setDark} />,
    profile: <ProfileScreen c={c} dark={dark} setDark={setDark} />,
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100dvh",
        background: c.bg,
        fontFamily: "Inter, sans-serif",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <style>{FONTS}</style>
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          minHeight: "100dvh",
          background: c.bg,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {screens[tab]}
        </div>
        <BottomNav c={c} active={tab} setActive={setTab} />
      </div>
    </div>
  );
}
