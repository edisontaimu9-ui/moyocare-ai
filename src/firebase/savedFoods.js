import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./config.js";

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "food";
}

function savedFoodsRef(uid) {
  return collection(db, "users", uid, "savedFoods");
}

/**
 * Save (bookmark) a food. Uses a slug of the food name as the doc ID, so
 * saving the same food twice just overwrites rather than duplicating —
 * makes the bookmark toggle naturally idempotent.
 */
export async function saveFood(uid, food) {
  const id = slugify(food.food_name);
  await setDoc(doc(db, "users", uid, "savedFoods", id), {
    food_name: food.food_name,
    category: food.category ?? null,
    energy_kcal: food.energy_kcal ?? null,
    protein_g: food.protein_g ?? null,
    carbs_g: food.carbs_g ?? null,
    fat_g: food.fat_g ?? null,
    savedAt: serverTimestamp(),
  });
  return id;
}

export async function unsaveFood(uid, foodName) {
  await deleteDoc(doc(db, "users", uid, "savedFoods", slugify(foodName)));
}

export function foodSlug(name) {
  return slugify(name);
}

/** Real-time subscription to all saved foods, most recently saved first. */
export function subscribeSavedFoods(uid, onChange, onError) {
  const q = query(savedFoodsRef(uid), orderBy("savedAt", "desc"));
  return onSnapshot(q, (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError);
}
