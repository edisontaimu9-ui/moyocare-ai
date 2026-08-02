import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Client-side Firebase config — the apiKey here is not a secret (it just
// identifies the project to Google's servers); access is controlled by
// Firebase Auth rules and authorized domains, not by hiding this value.
const firebaseConfig = {
  apiKey: "AIzaSyBxe_1cqOuaItGGXg8vwYbJklejgNC47us",
  authDomain: "moyocare2026.firebaseapp.com",
  projectId: "moyocare2026",
  storageBucket: "moyocare2026.firebasestorage.app",
  messagingSenderId: "39884306219",
  appId: "1:39884306219:web:1da090a5bbf2800be8376e",
  measurementId: "G-BTPW28Z0EP",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
