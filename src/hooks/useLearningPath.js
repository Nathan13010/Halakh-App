import { useEffect, useMemo, useState } from "react";
import { AVAILABLE_LEARNING_SIMANS } from "../data/learningSimans.js";
import { fetchKnowledgeForSiman } from "../services/knowledgeService.js";
import {
  buildCategoryExamQuestions,
  buildSimanCurriculum,
  buildSimanExamQuestions
} from "../services/learningPathModel.js";
import {
  completePathLesson,
  loadLearningPathState,
  recordCategoryExam,
  recordSimanExam,
  saveLearningPathState
} from "../services/learningPathProgress.js";

export const useLearningPath = () => {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [curricula, setCurricula] = useState({});
  const [pathState, setPathState] = useState(loadLearningPathState);

  useEffect(() => {
    let isMounted = true;

    const loadCurricula = async () => {
      setStatus("loading");
      try {
        const entries = await Promise.all(AVAILABLE_LEARNING_SIMANS.map(async (config) => {
          const knowledgeData = await fetchKnowledgeForSiman(config.id);
          if (!knowledgeData) throw new Error(`Données manquantes pour ${config.id}`);
          return [config.id, buildSimanCurriculum(config, knowledgeData)];
        }));

        if (!isMounted) return;
        setCurricula(Object.fromEntries(entries));
        setStatus("ready");
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError);
        setStatus("error");
      }
    };

    loadCurricula();
    return () => { isMounted = false; };
  }, []);

  const updateState = (updater) => {
    setPathState((current) => saveLearningPathState(updater(current)));
  };

  const completeLesson = (simanId, lessonId) => {
    const alreadyComplete = pathState.simans[simanId]?.completedLessons.includes(lessonId);
    updateState((current) => completePathLesson(current, simanId, lessonId));
    return !alreadyComplete;
  };

  const submitSimanExam = (simanId, correct, total) => {
    const wasPassed = pathState.simans[simanId]?.examPassed === true;
    updateState((current) => recordSimanExam(current, simanId, correct, total));
    return correct === total && !wasPassed;
  };

  const submitCategoryExam = (correct, total) => {
    const wasPassed = pathState.categoryExam.passed;
    updateState((current) => recordCategoryExam(current, correct, total));
    return correct === total && !wasPassed;
  };

  const simanExams = useMemo(() => Object.fromEntries(
    Object.entries(curricula).map(([simanId, curriculum]) => [
      simanId,
      buildSimanExamQuestions(curriculum)
    ])
  ), [curricula]);

  const categoryExam = useMemo(() => buildCategoryExamQuestions(curricula), [curricula]);

  return {
    status,
    error,
    curricula,
    pathState,
    simanExams,
    categoryExam,
    completeLesson,
    submitSimanExam,
    submitCategoryExam
  };
};
