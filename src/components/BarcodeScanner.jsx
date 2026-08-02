import { useEffect, useRef, useState } from "react";
import { X, Keyboard, Upload, AlertCircle } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";

/**
 * Full-screen barcode scanner. Calls onDetected(code) once a barcode is
 * successfully read, and onClose() when dismissed. Three ways in:
 * live camera (default), a photo from the gallery, or typing the code by
 * hand — camera access isn't guaranteed on every device/browser, so the
 * other two are real fallbacks, not just decoration.
 */
export function BarcodeScanner({ c, onDetected, onClose }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const controlsRef = useRef(null);

  const [mode, setMode] = useState("camera"); // "camera" | "manual"
  const [cameraError, setCameraError] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageBusy, setImageBusy] = useState(false);
  const [restartToken, setRestartToken] = useState(0);

  useEffect(() => {
    if (mode !== "camera") return;

    let cancelled = false;
    setCameraError("");
    const reader = new BrowserMultiFormatReader();

    reader
      .decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current,
        (result, err, controls) => {
          controlsRef.current = controls;
          if (cancelled) return;
          if (result) {
            controls.stop();
            onDetected(result.getText());
          }
          // err fires continuously (NotFoundException) while no barcode is
          // in frame — that's normal, not a real error.
        }
      )
      .catch((err) => {
        if (cancelled) return;
        setCameraError(
          err?.name === "NotAllowedError"
            ? "Camera permission was denied. Allow camera access, upload a photo, or enter the barcode manually."
            : "Couldn't access a camera. Upload a photo, or enter the barcode manually."
        );
      });

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
  }, [mode, restartToken, onDetected]);

  const submitManual = (e) => {
    e.preventDefault();
    if (manualCode.trim()) onDetected(manualCode.trim());
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again later
    if (!file) return;

    controlsRef.current?.stop();
    setImageError("");
    setImageBusy(true);

    const url = URL.createObjectURL(file);
    try {
      const reader = new BrowserMultiFormatReader();
      const result = await reader.decodeFromImageUrl(url);
      onDetected(result.getText());
    } catch {
      setImageError("No barcode found in that photo. Try a clearer photo, or enter the code manually.");
      if (mode === "camera") setRestartToken((t) => t + 1); // resume the live camera
    } finally {
      URL.revokeObjectURL(url);
      setImageBusy(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 1000, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#fff" }}>
          {mode === "manual" ? "Enter barcode" : "Scan barcode"}
        </span>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 10, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={16} color="#fff" />
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

      {mode === "camera" ? (
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted playsInline />

          {!cameraError && !imageBusy && (
            <div style={{ position: "absolute", width: "72%", maxWidth: 320, aspectRatio: "1.6", border: `2px solid ${c.primary}`, borderRadius: 16, boxShadow: "0 0 0 2000px rgba(0,0,0,0.45)" }} />
          )}

          {imageBusy && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#fff" }}>Reading photo…</span>
            </div>
          )}

          {cameraError && !imageBusy && (
            <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, textAlign: "center" }}>
              <AlertCircle size={28} color={c.danger} />
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#fff", marginTop: 12, lineHeight: 1.5 }}>{cameraError}</div>
            </div>
          )}

          {!cameraError && !imageBusy && (
            <div style={{ position: "absolute", bottom: 30, left: 20, right: 20, textAlign: "center" }}>
              {imageError ? (
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: c.danger, background: "rgba(0,0,0,0.6)", padding: "6px 12px", borderRadius: 10 }}>
                  {imageError}
                </span>
              ) : (
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                  Point your camera at a barcode
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={submitManual} style={{ flex: 1, display: "flex", flexDirection: "column", padding: 24 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginBottom: 14, lineHeight: 1.5 }}>
            Type the numbers printed under the barcode.
          </div>
          <input
            autoFocus
            inputMode="numeric"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="e.g. 6007048001598"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "13px 14px", fontFamily: "IBM Plex Mono, monospace", fontSize: 16, color: "#fff", outline: "none" }}
          />
          <button type="submit" style={{ marginTop: 14, background: c.primary, color: c.bg, border: "none", borderRadius: 12, padding: "13px", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Look up
          </button>
          {imageError && (
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: c.danger, marginTop: 12 }}>{imageError}</div>
          )}
        </form>
      )}

      <div style={{ display: "flex", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={imageBusy}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: "none", padding: "14px 8px", cursor: imageBusy ? "default" : "pointer", opacity: imageBusy ? 0.5 : 1 }}
        >
          <Upload size={15} color="rgba(255,255,255,0.85)" />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
            Upload photo
          </span>
        </button>
        <div style={{ width: 1, background: "rgba(255,255,255,0.15)", margin: "10px 0" }} />
        <button
          onClick={() => { setImageError(""); setMode(mode === "manual" ? "camera" : "manual"); }}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: "none", padding: "14px 8px", cursor: "pointer" }}
        >
          <Keyboard size={15} color="rgba(255,255,255,0.85)" />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
            {mode === "manual" ? "Use camera" : "Enter manually"}
          </span>
        </button>
      </div>
    </div>
  );
}
