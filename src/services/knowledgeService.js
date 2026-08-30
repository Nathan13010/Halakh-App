/**
 * knowledgeService.js
 * 
 * Service responsable du chargement dynamique des données de connaissances (Knowledge Points).
 * Il lit le fichier JSON éditorial du Siman correspondant.
 */

import { getLearningSimanConfig } from "../data/learningSimans.js";

const CACHE = {};

export const fetchKnowledgeForSiman = async (simanId) => {
  // simanId ex: "siman_1"
  if (CACHE[simanId]) {
    return CACHE[simanId];
  }

  try {
    const config = getLearningSimanConfig(simanId);
    const response = await fetch(config.knowledgePath);
    if (!response.ok) {
      // Fallback à la racine /data/ si on aplatit l'arborescence
      const fallbackResponse = await fetch(`/data/${simanId}_knowledge.json`);
      if (!fallbackResponse.ok) {
         throw new Error(`Impossible de charger les connaissances pour ${simanId}`);
      }
      const data = await fallbackResponse.json();
      CACHE[simanId] = data;
      return data;
    }
    
    const data = await response.json();
    CACHE[simanId] = data;
    return data;
  } catch (error) {
    console.error("Erreur dans fetchKnowledgeForSiman:", error);
    return null;
  }
};

export const getAllKnowledgePoints = (knowledgeData) => {
  if (!knowledgeData || !knowledgeData.knowledge_points) return [];
  return knowledgeData.knowledge_points;
};

export const getKnowledgePointsByLevelAndImportance = (knowledgeData, maxLevel = 2) => {
  if (!knowledgeData || !knowledgeData.knowledge_points) return [];
  
  return knowledgeData.knowledge_points.filter(kp => 
    kp.learning_level <= maxLevel && 
    (kp.importance === "essential" || kp.importance === "important")
  );
};

export const getKnowledgePointById = (knowledgeData, kpId) => {
  if (!knowledgeData || !knowledgeData.knowledge_points) return null;
  return knowledgeData.knowledge_points.find(kp => kp.id === kpId);
};

export const getActivitiesForKp = (kp, type = null) => {
  if (!kp || !kp.pedagogy || !kp.pedagogy.activities) return [];
  
  if (type) {
    const acts = kp.pedagogy.activities[type];
    if (!acts) return [];
    return Array.isArray(acts) ? acts : [acts];
  }
  
  // Return all activities flattened
  let allActs = [];
  Object.keys(kp.pedagogy.activities).forEach(key => {
    const acts = kp.pedagogy.activities[key];
    if (Array.isArray(acts)) {
      allActs = allActs.concat(acts.map(a => ({...a, type: key})));
    } else {
      allActs.push({...acts, type: key});
    }
  });
  
  return allActs;
};
