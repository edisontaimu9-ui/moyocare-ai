const PROXY_URL = "https://thanzi-ai-proxy.edisontaimu9.workers.dev/v1/groq/v1/chat/completions";

// Generate a MoyoCare-specific key (don't reuse Thanzi's) with the proxy's
// key script, then paste it here. This ships inside the public JS bundle —
// there's no way to fully hide a key in a static site — but a dedicated key
// means you can revoke/rotate it independently if it ever gets abused.
const THANZI_KEY = "thanzi_813da720b61547949b8568dd5ade1196";

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are MoyoCare AI, a clinical nutrition and health education assistant for a general-public audience in Malawi. You explain — you never diagnose, prescribe, or replace a clinician.

Respond ONLY with a single JSON object, no markdown fences, no commentary outside the JSON, matching exactly this shape:
{
  "explanation": "1-2 plain-language sentences directly answering the question",
  "clinical": "a short clinical/scientific summary paragraph",
  "nutrition": "a short paragraph on nutrition implications relevant to Malawi where applicable (e.g. local staple foods, Malawi FCT context)",
  "refs": "a short string naming 1-3 general reference sources (e.g. WHO, ADA, NICE guidelines) — do not fabricate specific study titles or URLs",
  "safety": "a one-sentence safety disclaimer string, or null if the topic has no meaningful safety concern"
}

Keep every field concise (a few sentences at most). If the question is outside nutrition/health/medicine, politely redirect within the "explanation" field and leave other fields short/empty.`;

export class ThanziProxyError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/**
 * Ask MoyoCare AI a question. Returns the structured response shape that
 * AssistantBubble renders: { explanation, clinical, nutrition, refs, safety }.
 */
export async function askMoyoCareAI(question) {
  if (THANZI_KEY.startsWith("PASTE_")) {
    throw new ThanziProxyError(
      "AI isn't configured yet — add your MoyoCare Thanzi proxy key in src/data/thanziProxy.js.",
      0
    );
  }

  let res;
  try {
    res = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Thanzi-Key": THANZI_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });
  } catch {
    throw new ThanziProxyError("Network error — check your connection and try again.", 0);
  }

  if (!res.ok) {
    let msg = `Request failed (${res.status}).`;
    try {
      const body = await res.json();
      msg = body?.error?.message || msg;
    } catch {}
    throw new ThanziProxyError(msg, res.status);
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) throw new ThanziProxyError("The AI didn't return a response.", res.status);

  try {
    const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
    const parsed = JSON.parse(cleaned);
    return {
      explanation: parsed.explanation || "",
      clinical: parsed.clinical || "",
      nutrition: parsed.nutrition || "",
      refs: parsed.refs || "",
      safety: parsed.safety || null,
    };
  } catch {
    // Model didn't return valid JSON — fall back to showing it as plain text
    // rather than failing outright.
    return { explanation: raw, clinical: "", nutrition: "", refs: "", safety: null };
  }
}
