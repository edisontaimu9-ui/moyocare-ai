const BASE_URL = "https://chakudya-api.edisontaimu9.workers.dev";

// Exact `source` string values the API returns (traced from
// chakudya-api-main/src/index.js) — not guessed, so these must stay in
// sync with normalizeFood()/lookupFoodCascade() if the API changes them.
export const SOURCE_LABELS = {
  local: "Malawi FCT",
  local_packaged: "Packaged foods (community submitted)",
  usda_fdc: "USDA FoodData Central",
  openfoodfacts: "Open Food Facts",
  fatsecret: "FatSecret",
};

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

let exchangeListCache = null;

/**
 * Fetch the full diabetes exchange list (~300 rows: id, food_name,
 * exchange_type, portion, kcal, kj, protein_g, carbs_g, fat_g). The API
 * caps each request at 100 rows, so this pages through with offset and
 * caches the combined result for the rest of the session.
 */
export async function getExchangeList() {
  if (exchangeListCache) return exchangeListCache;

  const all = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const body = await request(`/exchange?limit=${limit}&offset=${offset}`);
    const page = body.data ?? [];
    all.push(...page);
    if (page.length < limit || all.length >= (body.count ?? all.length)) break;
    offset += limit;
  }

  exchangeListCache = all;
  return all;
}

export { ChakudyaError };
