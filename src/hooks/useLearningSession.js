import { useState, useEffect, useCallback } from 'react';
import { fetchKnowledgeForSiman, getKnowledgePointById } from '../services/knowledgeService.js';
import { getKpProgression, markKpAsLearning, updateKpProgression } from '../services/progressionTracker.js';
import { getQueueForSession } from '../services/activitySelector.js';

/**
 * Hook qui orchestre une session d'apprentissage pour un Siman donné
 * basé EXCLUSIVEMENT sur les activités validées du JSON.
 */
export const useLearningSession = (simanId, sessionSize = 5) => {
  const [status, setStatus] = useState('loading'); // loading, ready, active, completed, error
  const [knowledgeData, setKnowledgeData] = useState(null);
  
  const [activityQueue, setActivityQueue] = useState([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  
  const [sessionScore, setSessionScore] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState(null); // null, 'correct', 'wrong'

  // Mode DEBUG exposant les KPs originaux de la file
  const [debugQueue, setDebugQueue] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      setStatus('loading');
      try {
        const data = await fetchKnowledgeForSiman(simanId);
        if (!data) throw new Error("Données introuvables");
        
        if (isMounted) {
          setKnowledgeData(data);
          
          // Récupère une file d'activités depuis le Selector
          const initialQueue = getQueueForSession(data, sessionSize);

          if (initialQueue.length === 0) {
            setStatus('error');
            return;
          }

          // Construire la debugQueue
          const dQueue = initialQueue.map(act => {
             const kp = getKnowledgePointById(data, act.knowledge_point_id);
             const prog = getKpProgression(act.knowledge_point_id);
             return { act, kp, prog };
          });

          // Marquer comme 'learning' les Flashcards vues pour la 1ère fois
          initialQueue.forEach(act => {
            if (act.type === 'flashcard') {
               markKpAsLearning(act.knowledge_point_id);
            }
          });

          setActivityQueue(initialQueue);
          setDebugQueue(dQueue);
          setCurrentActivityIndex(0);
          setSessionScore(0);
          setStatus('ready');
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setStatus('error');
      }
    };

    if (simanId) {
      initSession();
    }

    return () => { isMounted = false; };
  }, [simanId, sessionSize]);

  const currentActivity = activityQueue[currentActivityIndex];
  const currentDebugInfo = debugQueue[currentActivityIndex];

  const submitAnswer = useCallback((isCorrect) => {
    if (!currentActivity) return;
    
    // Si c'est une carte de lecture, il n'y a pas de bonne/mauvaise réponse, on valide juste
    if (currentActivity.type === 'flashcard') {
      setCurrentFeedback('correct');
      // Pour une flashcard, update avec true pour acter la vue si on veut, ou rien faire.
      // On a déjà fait markKpAsLearning à l'init.
      return;
    }

    // Récupérer les types disponibles pour ce KP pour la règle de maîtrise
    const allKpActs = currentDebugInfo.kp.pedagogy?.activities || {};
    const availableActivityTypes = Object.keys(allKpActs);

    if (isCorrect) {
      setCurrentFeedback('correct');
      setSessionScore(prev => prev + 15);
      updateKpProgression(currentActivity.knowledge_point_id, currentActivity.activity_id, currentActivity.rawType, true, availableActivityTypes);
    } else {
      setCurrentFeedback('wrong');
      updateKpProgression(currentActivity.knowledge_point_id, currentActivity.activity_id, currentActivity.rawType, false, availableActivityTypes);
      
      // Rajouter la même activité à la fin de la file pour obliger l'utilisateur à la refaire
      // L'utilisateur a dit : "Si l'utilisateur échoue : Activity A -> autre activité si disponible -> retour à Activity A plus tard"
      // Wait, the activitySelector handles the next session. Within the SAME session, do we append the same?
      // I'll append the same activity to the end so it's "plus tard" in the session.
      setActivityQueue(prev => {
        const newQueue = [...prev];
        newQueue.push({ ...currentActivity, id: currentActivity.activity_id + "_retry" });
        return newQueue;
      });
      setDebugQueue(prev => {
        const newDQueue = [...prev];
        newDQueue.push(currentDebugInfo); // copie l'info de debug
        return newDQueue;
      });
    }
  }, [currentActivity, currentDebugInfo]);

  const nextActivity = useCallback(() => {
    setCurrentFeedback(null);
    if (currentActivityIndex < activityQueue.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      setStatus('completed');
    }
  }, [currentActivityIndex, activityQueue.length]);

  const startSession = () => setStatus('active');

  return {
    status, // 'loading', 'ready', 'active', 'completed', 'error'
    currentActivity,
    currentDebugInfo,
    currentIndex: currentActivityIndex,
    totalActivities: activityQueue.length,
    sessionScore,
    currentFeedback,
    submitAnswer,
    nextActivity,
    startSession
  };
};
