const BASE_URL = "https://chakudya-api.edisontaimu9.workers.dev";

export class ChakudyaAskError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// One session id per app load — lets /rag/ask pull in this session's
// recalled memory as extra context on later questions, without persisting
// anything across visits. Not required for /rag/ask to work.
let sessionId = null;
function getSessionId() {
  if (!sessionId) {
    sessionId = crypto.randomUUID
      ? crypto.randomUUID()
      : `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
  return sessionId;
}

/**
 * Ask the Chakudya RAG Search Orchestrator a question. Fans out across the
 * knowledge base, Malawi FCT, packaged foods, exchange lists, and external
 * food APIs as relevant, reranks, then returns a grounded LLM answer with
 * inline [1][2]-style citations tied to `sources`.
 *
 * Returns { answer, intent, barcodeDetected, sources: [{id, source, title}] }.
 */
export async function askChakudya(query, { context = "both", topK = 6 } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/rag/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        context,
        top_k: topK,
        session_id: getSessionId(),
      }),
    });
  } catch {
    throw new ChakudyaAskError("Network error — check your connection and try again.", 0);
  }

  let body;
  try {
    body = await res.json();
  } catch {
    throw new ChakudyaAskError("Unexpected response from the server.", res.status);
  }

  if (!res.ok) {
    throw new ChakudyaAskError(body?.message || `Request failed (${res.status}).`, res.status);
  }

  const data = body.data || {};
  return {
    answer: data.answer || "No answer was returned.",
    intent: data.intent || null,
    barcodeDetected: data.barcode_detected || null,
    sources: data.sources || [],
  };
}
