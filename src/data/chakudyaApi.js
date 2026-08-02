const BASE_URL = "https://chakudya-api.edisontaimu9.workers.dev";

class ChakudyaError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new ChakudyaError("Network error — check your connection and try again.", 0);
  }
  let body;
  try {
    body = await res.json();
  } catch {
    throw new ChakudyaError("Unexpected response from the server.", res.status);
  }
  if (!res.ok && res.status !== 404) {
    throw new ChakudyaError(body?.message || "Something went wrong.", res.status);
  }
  return body;
}

/**
 * Search the local Malawi FCT / curated foods table by name.
 * Returns { count, data: Food[] } — data is [] if nothing matched.
 */
export async function searchFoods(query, { limit = 12 } = {}) {
  const q = encodeURIComponent(query.trim());
  const body = await request(`/foods?search=${q}&limit=${limit}`);
  return { count: body.count ?? 0, data: body.data ?? [] };
}

/**
 * Cascade lookup: local data -> cached external results -> USDA / Open Food
 * Facts / FatSecret. Slower than searchFoods, but finds foods that aren't
 * in the curated local table yet. Returns null if nothing was found
 * anywhere.
 */
export async function lookupFood(query) {
  const q = encodeURIComponent(query.trim());
  const body = await request(`/foods/lookup?q=${q}`);
  if (body.status === "not_found") return null;
  return { food: body.data, source: body.source, cached: body.cached };
}

/** Barcode variant of the cascade lookup. */
export async function lookupBarcode(barcode) {
  const b = encodeURIComponent(barcode.trim());
  const body = await request(`/foods/lookup?barcode=${b}`);
  if (body.status === "not_found") return null;
  return { food: body.data, source: body.source, cached: body.cached };
}

export { ChakudyaError };
