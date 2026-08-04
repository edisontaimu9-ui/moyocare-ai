import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { app } from "./config.js";

// Generate this in Firebase console → Project settings → Cloud Messaging →
// Web configuration → "Web Push certificates" → Generate key pair. It's a
// public key (safe to ship in the client), distinct from the apiKey.
const VAPID_KEY = "BBqiTK2G4REhhw27XD4z440QSKqYqeND6zObZoABcsuPNhNjWe8z9Jlm3t7GfRrndTCWjlWoKW6duPJIZgSGkDc";

let messagingInstance = null;
async function getMessagingIfSupported() {
  if (messagingInstance) return messagingInstance;
  if (!(await isSupported())) return null;
  messagingInstance = getMessaging(app);
  return messagingInstance;
}

export class NotificationSetupError extends Error {}

/**
 * Requests notification permission (if not already decided) and, if
 * granted, registers this device for push and returns its FCM token.
 * Returns null if push isn't supported on this browser at all.
 */
export async function requestNotificationPermission() {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return null;

  if (VAPID_KEY.startsWith("PASTE_")) {
    throw new NotificationSetupError(
      "Push notifications aren't configured yet — add the VAPID key in src/firebase/messaging.js."
    );
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const registration = await navigator.serviceWorker.ready;
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  return token || null;
}

/** Current permission state without prompting: "default" | "granted" | "denied" | "unsupported". */
export function currentPermissionState() {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
}

/** Fires callback(payload) for pushes that arrive while the app is in the foreground. */
export async function onForegroundMessage(callback) {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
}
