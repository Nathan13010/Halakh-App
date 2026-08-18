import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || GEMINI_API_KEY,
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
