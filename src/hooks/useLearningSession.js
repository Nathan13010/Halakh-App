import { useCallback, useEffect, useState } from "react";
import { fetchKnowledgeForSiman, getKnowledgePointById } from "../services/knowledgeService.js";
import { getKpProgression, updateKpProgression } from "../services/progressionTracker.js";
import { getQueueForSession } from "../services/activitySelector.js";
import { isObjectivelyAssessable } from "../services/activityValidator.js";
import { createRetryActivity, getNextSessionTransition } from "../services/sessionQueue.js";

/**
 * Orchestre une session fondée exclusivement sur les activités validées du JSON.
 */
export const useLearningSession = (simanId, sessionSize = 5) => {
  const [status, setStatus] = useState("loading");
  const [knowledgeData, setKnowledgeData] = useState(null);
  const [activityQueue, setActivityQueue] = useState([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [debugQueue, setDebugQueue] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      setStatus("loading");

      try {
        const data = await fetchKnowledgeForSiman(simanId);
        if (!data) throw new Error("Données introuvables");
        if (!isMounted) return;

        const initialQueue = getQueueForSession(data, sessionSize);
        if (initialQueue.length === 0) {
          setStatus("error");
          return;
        }

        const initialDebugQueue = initialQueue.map((activity) => ({
          act: activity,
          kp: getKnowledgePointById(data, activity.knowledge_point_id),
          prog: getKpProgression(activity.knowledge_point_id)
        }));

        setKnowledgeData(data);
        setActivityQueue(initialQueue);
        setDebugQueue(initialDebugQueue);
        setCurrentActivityIndex(0);
        setSessionScore(0);
        setCurrentFeedback(null);
        setStatus("ready");
      } catch (error) {
        console.error(error);
        if (isMounted) setStatus("error");
      }
    };

    if (simanId) initSession();
    return () => { isMounted = false; };
  }, [simanId, sessionSize]);

  const currentActivity = activityQueue[currentActivityIndex];
  const currentDebugInfo = debugQueue[currentActivityIndex];
  const currentProgression = currentActivity
    ? getKpProgression(currentActivity.knowledge_point_id)
    : null;

  const submitAnswer = useCallback((isCorrect) => {
    if (!currentActivity) return { retryActivity: null };

    const kp = currentDebugInfo?.kp
      || getKnowledgePointById(knowledgeData, currentActivity.knowledge_point_id);
    const availableActivityTypes = Object.keys(kp?.pedagogy?.activities || {});
    const isAssessable = isObjectivelyAssessable(currentActivity);
    const trackerActivityType = currentActivity.rawType === "practical_situation" && !isAssessable
      ? "practical_situation_reflective"
      : currentActivity.rawType;

    if (!isAssessable) {
      setCurrentFeedback("correct");
      const progression = updateKpProgression(
        currentActivity.knowledge_point_id,
        currentActivity.activity_id,
        trackerActivityType,
        null,
        availableActivityTypes
      );
      return { retryActivity: null, progression };
    }

    if (isCorrect) {
      setCurrentFeedback("correct");
      setSessionScore((score) => score + 15);
      const progression = updateKpProgression(
        currentActivity.knowledge_point_id,
        currentActivity.activity_id,
        trackerActivityType,
        true,
        availableActivityTypes
      );
      return { retryActivity: null, progression };
    }

    setCurrentFeedback("wrong");
    const progression = updateKpProgression(
      currentActivity.knowledge_point_id,
      currentActivity.activity_id,
      trackerActivityType,
      false,
      availableActivityTypes
    );
    const retryActivity = createRetryActivity(currentActivity, currentActivityIndex + 1);

    return {
      retryActivity,
      retryDebugInfo: { act: retryActivity, kp, prog: progression },
      progression
    };
  }, [currentActivity, currentActivityIndex, currentDebugInfo, knowledgeData]);

  const nextActivity = useCallback((submission = {}) => {
    setCurrentFeedback(null);

    const transition = getNextSessionTransition({
      currentIndex: currentActivityIndex,
      queueLength: activityQueue.length,
      retryActivity: submission.retryActivity
    });

    if (transition.appendRetry) {
      setActivityQueue((queue) => [...queue, submission.retryActivity]);
      setDebugQueue((queue) => [...queue, submission.retryDebugInfo]);
    }

    if (transition.nextStatus === "completed") {
      setStatus("completed");
    } else {
      setCurrentActivityIndex(transition.nextIndex);
    }
  }, [activityQueue.length, currentActivityIndex]);

  const startSession = () => setStatus("active");
  const closeSession = () => setStatus("ready");
  const restartSession = () => {
    if (!knowledgeData) return;
    const nextQueue = getQueueForSession(knowledgeData, sessionSize);
    const nextDebugQueue = nextQueue.map((activity) => ({
      act: activity,
      kp: getKnowledgePointById(knowledgeData, activity.knowledge_point_id),
      prog: getKpProgression(activity.knowledge_point_id)
    }));

    setActivityQueue(nextQueue);
    setDebugQueue(nextDebugQueue);
    setCurrentActivityIndex(0);
    setSessionScore(0);
    setCurrentFeedback(null);
    setStatus(nextQueue.length > 0 ? "ready" : "error");
  };

  return {
    status,
    knowledgeData,
    currentActivity,
    currentDebugInfo,
    currentProgression,
    currentIndex: currentActivityIndex,
    totalActivities: activityQueue.length,
    sessionScore,
    currentFeedback,
    submitAnswer,
    nextActivity,
    startSession,
    closeSession,
    restartSession
  };
};
