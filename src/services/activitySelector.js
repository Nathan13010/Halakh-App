/**
 * activitySelector.js
 * 
 * Sélectionne et ordonne les activités pédagogiques existantes sans en générer de nouvelles.
 */

import { getKpProgression } from './progressionTracker.js';
import { getActivitiesForKp } from './knowledgeService.js';

const STATUS_ORDER = {
  "needs_review": 5,
  "non_started": 4,
  "learning": 3,
  "practicing": 2,
  "mastered": 1
};

const LEVEL_ORDER = {
  1: 4, 
  2: 3, 
  3: 2, 
  4: 1
};

const IMPORTANCE_ORDER = {
  "essential": 4, 
  "important": 3, 
  "useful": 2, 
  "reference": 1
};

export const sortKpsForSelection = (kpA, kpB) => {
  if (STATUS_ORDER[kpA.prog.status] !== STATUS_ORDER[kpB.prog.status]) {
    return STATUS_ORDER[kpB.prog.status] - STATUS_ORDER[kpA.prog.status];
  }
  
  const lvlA = LEVEL_ORDER[kpA.kp.learning_level] || 0;
  const lvlB = LEVEL_ORDER[kpB.kp.learning_level] || 0;
  if (lvlA !== lvlB) {
    return lvlB - lvlA;
  }
  
  const impA = IMPORTANCE_ORDER[kpA.kp.importance] || 0;
  const impB = IMPORTANCE_ORDER[kpB.kp.importance] || 0;
  return impB - impA;
};

export const pickActivitiesForKp = (kp, progression, recentlyUsedIds = []) => {
  const allActs = getActivitiesForKp(kp);
  const validActs = allActs.filter(a => a.validated === true);
  if (validActs.length === 0) return [];

  const flashcards = validActs.filter(a => a.type === 'flashcard');
  const tests = validActs.filter(a => a.type === 'multiple_choice' || a.type === 'true_false');
  const situations = validActs.filter(a => a.type === 'practical_situation');

  const masteredActs = progression.activities_mastered || [];
  const masteredIds = masteredActs.map(a => a.id);
  const hasMasteredFlashcard = flashcards.some(a => masteredIds.includes(a.activity_id));
  const hasMasteredTests = tests.some(a => masteredIds.includes(a.activity_id));

  let selectedActs = [];

  // Fonction pour éviter la dernière erreur (et les IDs récemment utilisés dans cette même file)
  const pickAvoidFailed = (acts) => {
    if (acts.length === 0) return null;
    
    // Idéal : on évite la dernière erreur ET les IDs déjà dans la file (au cas où on mettrait plusieurs fois le même KP)
    let others = acts.filter(a => 
       a.activity_id !== progression.last_failed_activity_id &&
       !recentlyUsedIds.includes(a.activity_id)
    );
    
    if (others.length > 0) {
       // Optionnel : aléatoire parmi les dispo, ou juste le premier
       return others[0];
    }
    
    // Fallback : si on ne peut pas éviter, on autorise, 
    // SAUF si c'est déjà dans la file actuelle (recentlyUsedIds) auquel cas on prend le premier qui n'y est pas
    const notInQueue = acts.filter(a => !recentlyUsedIds.includes(a.activity_id));
    if (notInQueue.length > 0) return notInQueue[0];
    
    return acts[0]; // Ultime fallback
  };

  // 1. Si jamais vu ou learning -> Flashcard
  if ((progression.status === "non_started" || progression.status === "learning") && !hasMasteredFlashcard) {
    const fc = pickAvoidFailed(flashcards);
    if (fc) selectedActs.push(fc);
  }

  // 2. Chercher une activité de test (QCM, V/F ou Situation)
  let testAct = null;
  if (progression.status === "needs_review") {
    const unmasteredTests = tests.filter(a => !masteredIds.includes(a.activity_id));
    const unmasteredSituations = situations.filter(a => !masteredIds.includes(a.activity_id));
    
    testAct = pickAvoidFailed(unmasteredTests) || pickAvoidFailed(unmasteredSituations);
    
    if (!testAct) {
       testAct = pickAvoidFailed(tests) || pickAvoidFailed(situations);
    }
  } else {
    // Cas nominal (non_started, learning, practicing, mastered)
    const unmasteredTests = tests.filter(a => !masteredIds.includes(a.activity_id));
    const unmasteredSituations = situations.filter(a => !masteredIds.includes(a.activity_id));

    if (!hasMasteredTests && unmasteredTests.length > 0) {
      testAct = pickAvoidFailed(unmasteredTests);
    } else if (unmasteredSituations.length > 0) {
      testAct = pickAvoidFailed(unmasteredSituations);
    } else {
      const allActive = [...tests, ...situations];
      if (allActive.length > 0) {
        testAct = pickAvoidFailed(allActive);
      }
    }
  }

  if (testAct) {
    selectedActs.push(testAct);
  }

  if (selectedActs.length === 0) return [];

  // Normaliser pour l'UI
  return selectedActs.map(rawAct => {
    let normalizedAct = { ...rawAct, id: rawAct.activity_id, rawType: rawAct.type };

    if (rawAct.type === 'flashcard') {
      normalizedAct.type = 'card';
      normalizedAct.title = kp.title || rawAct.title;
      normalizedAct.rule = kp.rule || rawAct.answer;
      normalizedAct.explanation = kp.explanation;
      normalizedAct.practical_example = kp.practical_example;
      normalizedAct.halakha_status = kp.halakha_status;
    } else if (rawAct.type === 'multiple_choice') {
      normalizedAct.type = 'quiz';
      normalizedAct.correctIndex = rawAct.options.indexOf(rawAct.correct_answer);
    } else if (rawAct.type === 'true_false') {
      normalizedAct.type = 'true_false';
      normalizedAct.question = `Vrai ou Faux : ${rawAct.statement}`;
      normalizedAct.options = ["Vrai", "Faux"];
      normalizedAct.correctIndex = rawAct.is_true ? 0 : 1;
    } else if (rawAct.type === 'practical_situation') {
      normalizedAct.type = 'card';
      normalizedAct.title = "Cas Pratique";
      normalizedAct.rule = `Situation : ${rawAct.situation}\n\nQuestion : ${rawAct.question}\n\nRéponse attendue : ${rawAct.answer}`;
      normalizedAct.explanation = rawAct.explanation || kp.explanation;
      normalizedAct.halakha_status = kp.halakha_status;
    }

    return normalizedAct;
  });
};

export const getQueueForSession = (knowledgeData, sessionSize = 5) => {
  if (!knowledgeData || !knowledgeData.knowledge_points) return [];

  // 1. Evaluer chaque KP
  const kps = knowledgeData.knowledge_points.map(kp => ({
    kp,
    prog: getKpProgression(kp.id)
  }));

  // 2. Trier selon les règles strictes
  kps.sort(sortKpsForSelection);

  // 3. Prendre les N meilleurs KP (max 5)
  let selectedKps = kps.slice(0, sessionSize);

  // 4. Assigner l'activité et construire la file
  const queue = [];
  const recentlyUsedIds = [];
  
  selectedKps.forEach(item => {
    const acts = pickActivitiesForKp(item.kp, item.prog, recentlyUsedIds);
    acts.forEach(act => {
      queue.push(act);
      recentlyUsedIds.push(act.id);
    });
  });

  return queue;
};
