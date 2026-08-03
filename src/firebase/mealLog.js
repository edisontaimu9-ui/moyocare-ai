import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, where, Timestamp, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config.js";

function mealLogsRef(uid) {
  return collection(db, "users", uid, "mealLogs");
}

/**
 * Log a meal for the signed-in user.
 * entry: { foodName, mealType, portionLabel, kcal, protein_g, carbs_g, fat_g }
 */
export async function addMealLog(uid, entry) {
  await addDoc(mealLogsRef(uid), {
    ...entry,
    loggedAt: serverTimestamp(),
  });
}

export async function deleteMealLog(uid, mealId) {
  await deleteDoc(doc(db, "users", uid, "mealLogs", mealId));
}

/**
 * Real-time subscription to today's meal logs (device-local "today",
 * midnight to midnight), ordered oldest to newest. Calls onChange with the
 * current array every time it changes; call the returned function to
 * unsubscribe.
 */
export function subscribeTodaysMealLogs(uid, onChange, onError) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const q = query(
    mealLogsRef(uid),
    where("loggedAt", ">=", Timestamp.fromDate(startOfDay)),
    orderBy("loggedAt", "asc")
  );

  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}
