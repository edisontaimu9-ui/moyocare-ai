import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./config.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInGoogle = () => signInWithPopup(auth, googleProvider);

  const signInEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signUpEmail = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    return cred;
  };

  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signInGoogle, signInEmail, signUpEmail, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
