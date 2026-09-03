import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import { LEARNING_CATEGORY } from "./learningPathModel.js";
import { normalizeLearningPathState } from "./learningPathProgress.js";

/**
 * Fusionne intelligemment deux états de progression du parcours d'apprentissage.
 * Garantit qu'aucune leçon terminée ou examen réussi ne soit perdu.
 */
export const mergeLearningPathStates = (localState, cloudState) => {
  const normLocal = normalizeLearningPathState(localState);
  const normCloud = normalizeLearningPathState(cloudState);

  const mergedSimans = {};

  for (const simanId of LEARNING_CATEGORY.simanIds) {
    const localSiman = normLocal.simans[simanId] || { completedLessons: [] };
    const cloudSiman = normCloud.simans[simanId] || { completedLessons: [] };

    // Union des leçons complétées
    const allLessons = new Set([
      ...(localSiman.completedLessons || []),
      ...(cloudSiman.completedLessons || [])
    ]);

    mergedSimans[simanId] = {
      completedLessons: Array.from(allLessons),
      examPassed: Boolean(localSiman.examPassed || cloudSiman.examPassed),
      examAttempts: Math.max(localSiman.examAttempts || 0, cloudSiman.examAttempts || 0),
      bestExamScore: Math.max(localSiman.bestExamScore || 0, cloudSiman.bestExamScore || 0),
      completedAt: localSiman.completedAt || cloudSiman.completedAt || null
    };
  }

  const categoryExam = {
    passed: Boolean(normLocal.categoryExam.passed || normCloud.categoryExam.passed),
    attempts: Math.max(normLocal.categoryExam.attempts || 0, normCloud.categoryExam.attempts || 0),
    bestScore: Math.max(normLocal.categoryExam.bestScore || 0, normCloud.categoryExam.bestScore || 0),
    completedAt: normLocal.categoryExam.completedAt || normCloud.categoryExam.completedAt || null
  };

  return {
    version: normLocal.version || 1,
    categoryId: LEARNING_CATEGORY.id,
    simans: mergedSimans,
    categoryExam,
    revisionSheetUnlocked: Boolean(normLocal.revisionSheetUnlocked || normCloud.revisionSheetUnlocked),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Fusionne les données globales de l'utilisateur (XP, Série, Favoris, Marque-pages).
 */
export const mergeUserData = (local, cloud = {}) => {
  const localFavorites = Array.isArray(local.favorites) ? local.favorites : [];
  const cloudFavorites = Array.isArray(cloud.favorites) ? cloud.favorites : [];

  // Déduplication des favoris par identifiant unique (bookId + paragraphIndex)
  const favoritesMap = new Map();
  [...localFavorites, ...cloudFavorites].forEach((fav) => {
    if (fav && fav.bookId !== undefined) {
      const key = `${fav.bookId}_${fav.paragraphIndex ?? fav.seif ?? 0}`;
      favoritesMap.set(key, fav);
    }
  });

  const localBookmarks = Array.isArray(local.bookmarks) ? local.bookmarks : [];
  const cloudBookmarks = Array.isArray(cloud.bookmarks) ? cloud.bookmarks : [];
  const bookmarksMap = new Map();
  [...localBookmarks, ...cloudBookmarks].forEach((bm) => {
    if (bm && bm.bookId !== undefined) {
      bookmarksMap.set(bm.bookId, bm);
    }
  });

  return {
    xp: Math.max(Number(local.xp) || 0, Number(cloud.xp) || 0),
    streak: Math.max(Number(local.streak) || 0, Number(cloud.streak) || 0),
    lastStreakDate: local.lastStreakDate || cloud.lastStreakDate || "",
    favorites: Array.from(favoritesMap.values()),
    bookmarks: Array.from(bookmarksMap.values()),
    learningPath: mergeLearningPathStates(local.learningPath, cloud.learningPath)
  };
};

/**
 * Récupère les données de l'utilisateur depuis Firestore.
 */
export const fetchCloudUserData = async (uid) => {
  if (!uid || !db) return null;
  try {
    const userDocRef = doc(db, "users", uid);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération des données Cloud:", error);
    return null;
  }
};

/**
 * Enregistre les données utilisateur dans Firestore avec merge.
 */
export const saveCloudUserData = async (uid, data) => {
  if (!uid || !db) return false;
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(
      userDocRef,
      {
        ...data,
        lastSyncedAt: serverTimestamp()
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde Cloud:", error);
    return false;
  }
};

const SYNC_CODE_KEY = "halakhapp_sync_code";

/**
 * Nettoie et formate un code de synchronisation (ex: hlk-7k2-9mp -> HLK-7K2-9MP).
 */
export const cleanSyncCode = (rawCode) => {
  if (!rawCode || typeof rawCode !== "string") return "";
  const cleaned = rawCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.startsWith("HLK") && cleaned.length > 3) {
    const rest = cleaned.substring(3);
    if (rest.length <= 3) return `HLK-${rest}`;
    return `HLK-${rest.substring(0, 3)}-${rest.substring(3, 7)}`;
  }
  return cleaned;
};

/**
 * Génère un code unique, lisible et difficile à confondre (ex: HLK-84K-92M).
 */
export const generateSyncCode = () => {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // sans 0, O, 1, I pour éviter toute confusion
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 3; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `HLK-${part1}-${part2}`;
};

/**
 * Récupère le code de synchronisation stocké localement.
 */
export const getStoredSyncCode = () => {
  if (typeof window === "undefined" || !window.localStorage) return "";
  try {
    return localStorage.getItem(SYNC_CODE_KEY) || "";
  } catch (_) {
    return "";
  }
};

/**
 * Enregistre ou supprime le code de synchronisation localement.
 */
export const setStoredSyncCode = (code) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    if (code) {
      localStorage.setItem(SYNC_CODE_KEY, code.trim().toUpperCase());
    } else {
      localStorage.removeItem(SYNC_CODE_KEY);
    }
  } catch (_) {}
};

