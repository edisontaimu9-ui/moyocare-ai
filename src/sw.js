import { precacheAndRoute } from "workbox-precaching";

// Injected at build time by vite-plugin-pwa (injectManifest strategy) with
// the list of app-shell files to precache for offline use.
precacheAndRoute(self.__WB_MANIFEST);

// --- Firebase Cloud Messaging (background push) ---------------------------
// Uses the compat/CDN scripts (not the modular SDK) since service workers
// don't go through the same module bundling as the main app, and this is
// Firebase's documented pattern for messaging service workers.
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

// Duplicated from src/firebase/config.js — this file can't easily import
// that module since it's processed as a separate service-worker bundle by
// vite-plugin-pwa. If the Firebase project config ever changes, update
// both places.
firebase.initializeApp({
  apiKey: "AIzaSyBxe_1cqOuaItGGXg8vwYbJklejgNC47us",
  authDomain: "moyocare2026.firebaseapp.com",
  projectId: "moyocare2026",
  storageBucket: "moyocare2026.firebasestorage.app",
  messagingSenderId: "39884306219",
  appId: "1:39884306219:web:1da090a5bbf2800be8376e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "MoyoCare AI", {
    body: body || "",
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    data: payload.data || {},
  });
});

// Tapping a notification focuses/opens the app instead of just dismissing.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
      if (clientsList.length > 0) return clientsList[0].focus();
      return self.clients.openWindow("./");
    })
  );
});
