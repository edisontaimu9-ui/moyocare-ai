import { useState } from "react";
import { LogIn, Mail, Lock, User as UserIcon } from "lucide-react";
import { Card } from "./Primitives.jsx";
import { useAuth } from "../firebase/AuthContext.jsx";

export function AuthPanel({ c }) {
  const { signInGoogle, signInEmail, signUpEmail } = useAuth();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const inputStyle = {
    width: "100%",
    background: c.bgAlt,
    border: `1px solid ${c.border}`,
    borderRadius: 10,
    padding: "10px 12px",
    fontFamily: "Inter, sans-serif",
    fontSize: 13,
    color: c.ink,
    outline: "none",
  };

  const friendlyError = (err) => {
    const code = err?.code || "";
    if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password.";
    if (code.includes("user-not-found")) return "No account found with that email.";
    if (code.includes("email-already-in-use")) return "That email is already registered — try signing in instead.";
    if (code.includes("weak-password")) return "Password should be at least 6 characters.";
    if (code.includes("invalid-email")) return "That email address doesn't look right.";
    if (code.includes("popup-closed-by-user")) return "Google sign-in was closed before finishing.";
    return "Something went wrong. Please try again.";
  };

  const handleGoogle = async () => {
    setError(""); setBusy(true);
    try { await signInGoogle(); }
    catch (err) { setError(friendlyError(err)); }
    finally { setBusy(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      if (mode === "signup") await signUpEmail(email, password, name);
      else await signInEmail(email, password);
    } catch (err) { setError(friendlyError(err)); }
    finally { setBusy(false); }
  };

  return (
    <Card c={c} style={{ padding: 20 }}>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: c.ink, marginBottom: 3 }}>
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.inkFaint, marginBottom: 16 }}>
        Sign in to save your nutrition history, preferences, and conversations across devices.
      </div>

      <button
        onClick={handleGoogle}
        disabled={busy}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: c.surfaceSolid, border: `1px solid ${c.border}`, borderRadius: 12, padding: "11px", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1, marginBottom: 14 }}
      >
        <GoogleG />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: c.ink }}>Continue with Google</span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 1, background: c.border }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: c.inkFaint }}>or</span>
        <div style={{ flex: 1, height: 1, background: c.border }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mode === "signup" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, ...inputStyle, padding: "2px 12px" }}>
            <UserIcon size={14} color={c.inkFaint} />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: "9px 0", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }} />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, ...inputStyle, padding: "2px 12px" }}>
          <Mail size={14} color={c.inkFaint} />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: "9px 0", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, ...inputStyle, padding: "2px 12px" }}>
          <Lock size={14} color={c.inkFaint} />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: "9px 0", fontFamily: "Inter, sans-serif", fontSize: 13, color: c.ink }} />
        </div>

        {error && (
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.danger, background: c.dangerSoft, borderRadius: 10, padding: "8px 11px" }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={busy} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", background: c.primary, color: c.bg, border: "none", borderRadius: 12, padding: "11px", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1, marginTop: 2 }}>
          <LogIn size={14} />
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <button
        onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); }}
        style={{ width: "100%", textAlign: "center", background: "none", border: "none", marginTop: 14, fontFamily: "Inter, sans-serif", fontSize: 12, color: c.primary, fontWeight: 600, cursor: "pointer" }}
      >
        {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>
    </Card>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.02l7.73 6c4.51-4.18 7.09-10.36 7.09-17.49z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.27-3.13.77-4.59l-7.98-6.19A24 24 0 000 24c0 3.87.92 7.53 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
