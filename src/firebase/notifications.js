import {
  collection, doc, setDoc, deleteDoc, addDoc, onSnapshot,
  query, orderBy, limit, writeBatch, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config.js";

/** Register (or refresh) this device's push token for the signed-in user. */
export async function saveDeviceToken(uid, token) {
  await setDoc(doc(db, "users", uid, "fcmTokens", token), {
    token,
    userAgent: navigator.userAgent,
    createdAt: serverTimestamp(),
  });
}

export async function removeDeviceToken(uid, token) {
  await deleteDoc(doc(db, "users", uid, "fcmTokens", token));
}

/**
 * Log a notification into the user's history (used both for pushes
 * received in the foreground and, later, by the server-side sender so the
 * in-app panel has real content beyond native OS notifications).
 * entry: { title, body, data }
 */
export async function logNotification(uid, entry) {
  await addDoc(collection(db, "users", uid, "notifications"), {
    ...entry,
    read: false,
    createdAt: serverTimestamp(),
  });
}

/** Real-time subscription to the most recent notifications, newest first. */
export function subscribeNotifications(uid, count, onChange, onError) {
  const q = query(
    collection(db, "users", uid, "notifications"),
    orderBy("createdAt", "desc"),
    limit(count)
  );
  return onSnapshot(q, (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError);
}

/** Marks a batch of notifications as read (call with currently-loaded unread ids). */
export async function markNotificationsRead(uid, ids) {
  if (ids.length === 0) return;
  const batch = writeBatch(db);
  for (const id of ids) {
    batch.update(doc(db, "users", uid, "notifications", id), { read: true });
  }
  await batch.commit();
}
