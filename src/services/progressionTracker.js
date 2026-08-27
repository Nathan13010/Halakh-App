/**
 * progressionTracker.js
 * 
 * Gère l'état d'apprentissage et de maîtrise de chaque Knowledge Point.
 * Implémente les bases de la répétition espacée et la logique de maîtrise complexe.
 */

const STORAGE_KEY = "halakhapp_kp_progression";

export const getAllProgressions = () => {
  if (typeof window === 'undefined') return {}; // Pour les tests côté serveur
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Erreur lecture progression:", error);
    return {};
  }
};

const saveProgressions = (progressions) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressions));
  } catch (error) {
    console.error("Erreur sauvegarde progression:", error);
  }
};

export const getKpProgression = (kpId) => {
  const progressions = getAllProgressions();
  return progressions[kpId] || {
    status: "non_started",
    attempts: 0,
    correct: 0,
    wrong: 0,
    last_seen: null,
    last_correct: null,
    next_review: null,
    streak: 0,
    activities_mastered: [], // array d'objets { id, type }
    activity_success_counts: {}, // map activityId -> count
    last_failed_activity_id: null
  };
};

export const markKpAsLearning = (kpId) => {
  const progressions = getAllProgressions();
  const kpProg = getKpProgression(kpId);
  
  if (kpProg.status === "non_started") {
    progressions[kpId] = {
      ...kpProg,
      status: "learning",
      last_seen: Date.now()
    };
    saveProgressions(progressions);
  }
};

export const updateKpProgression = (kpId, activityId, activityType, isCorrect, availableActivityTypes = []) => {
  const progressions = getAllProgressions();
  const kpProg = progressions[kpId] || getKpProgression(kpId);
  
  let newStatus = kpProg.status;
  let newStreak = kpProg.streak;
  let newCorrect = kpProg.correct;
  let newWrong = kpProg.wrong;
  let newMasteredActs = [...(kpProg.activities_mastered || [])];
  let newSuccessCounts = { ...(kpProg.activity_success_counts || {}) };
  
  kpProg.attempts = (kpProg.attempts || 0) + 1;
  kpProg.last_seen = Date.now();

  if (isCorrect) {
    newCorrect += 1;
    newStreak += 1;
    kpProg.last_correct = Date.now();
    kpProg.last_failed_activity_id = null; // Reset de la dernière erreur sur réussite ? Non, gardons-le pour éviter les répétitions si besoin, mais on le clear pas forcément.
    
    // Une flashcard ne compte pas pour la maîtrise "active"
    if (activityType !== 'flashcard' && activityType !== 'card') {
      newSuccessCounts[activityId] = (newSuccessCounts[activityId] || 0) + 1;
      if (!newMasteredActs.some(a => a.id === activityId)) {
        newMasteredActs.push({ id: activityId, type: activityType });
      }
    }

    // Evaluation de la maîtrise
    const typesMastered = [...new Set(newMasteredActs.map(a => a.type))];
    const hasSituation = typesMastered.includes('practical_situation');
    
    const hasOtherThanFlashcard = availableActivityTypes.some(t => t !== 'flashcard' && t !== 'card');

    if (!hasOtherThanFlashcard) {
      // S'il n'y a QUE des flashcards pour ce KP (très rare dans V2)
      newStatus = "practicing";
    } else if (typesMastered.length >= 2) {
      // 2 types différents réussis = mastered
      newStatus = "mastered";
    } else if (typesMastered.length === 1) {
      // 1 type différent de flashcard réussi
      const totalSuccessOnActive = Object.values(newSuccessCounts).reduce((a, b) => a + b, 0);
      if (hasSituation) {
        // La situation a un poids très élevé, une seule peut suffire si pas d'autres types
        newStatus = "mastered";
      } else if (totalSuccessOnActive >= 2) {
        // QCM ou V/F nécessite au moins 2 réussites distinctes
        newStatus = "mastered";
      } else {
        newStatus = "practicing";
      }
    } else {
      newStatus = "practicing";
    }
  } else {
    // ERREUR
    newWrong += 1;
    newStreak = 0; // Remise à zéro
    newStatus = "needs_review";
    kpProg.last_failed_activity_id = activityId;
  }

  progressions[kpId] = {
    ...kpProg,
    status: newStatus,
    correct: newCorrect,
    wrong: newWrong,
    streak: newStreak,
    activities_mastered: newMasteredActs,
    activity_success_counts: newSuccessCounts
  };

  saveProgressions(progressions);
  return progressions[kpId];
};

// Pour les tests
export const resetAllProgressions = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
