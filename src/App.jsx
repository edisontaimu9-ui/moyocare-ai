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
    <div style={{ width: "100%", minHeight: "100vh", background: dark ? "#040a08" : "#EAE3D2", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter, sans-serif" }}>
      <style>{FONTS}</style>
      <div
        style={{
          width: 400,
          height: 830,
          background: c.bg,
          borderRadius: 42,
          border: `10px solid ${dark ? "#000" : "#1a1a1a"}`,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.45)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 130, height: 26, background: dark ? "#000" : "#1a1a1a", borderRadius: "0 0 16px 16px", zIndex: 20 }} />
        <div style={{ flex: 1, overflowY: "auto" }}>{screens[tab]}</div>
        <BottomNav c={c} active={tab} setActive={setTab} />
      </div>
    </div>
  );
}
