import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : {};
export const GEMINI_API_KEY = env.VITE_GEMINI_API_KEY || "";

export const FIREBASE_API_KEY = env.VITE_FIREBASE_API_KEY || "AIzaSyA510PiERnTBrKdK4uneRclhQS8DTFEb3Q";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "halakhapp.firebaseapp.com",
  projectId: "halakhapp",
  storageBucket: "halakhapp.firebasestorage.app",
  messagingSenderId: "330137288533",
  appId: "1:330137288533:web:992f22cdf65502d85379dc",
  measurementId: "G-5EWRB4P01Z"
};

// Initialize Firebase only if it hasn't been initialized yet (fixes HMR issues)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let db;
try {
  // Initialize Cloud Firestore with the new persistent cache API
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  // If Firestore is already initialized (e.g., during Vite Hot-Reload), just get the existing instance
  db = getFirestore(app);
}

export { db };

let auth = null;
try {
  auth = getAuth(app);
} catch (e) {
  // Graceful fallback for non-browser/test environments
}
export { auth };
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  if (!FIREBASE_API_KEY || FIREBASE_API_KEY.startsWith("AQ.")) {
    const errorMsg = "La clé Firebase Web API (commençant par AIzaSy...) est manquante dans le fichier .env (VITE_FIREBASE_API_KEY).";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Erreur lors de la connexion Google:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

export const onAuthChange = (callback) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};
