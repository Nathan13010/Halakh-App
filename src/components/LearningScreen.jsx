import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import ConfettiCanvas from "./ConfettiCanvas";
import ActivityRenderer from "./learning/ActivityRenderer";
import { useLearningSession } from "../hooks/useLearningSession";
import { getAllProgressions } from "../services/progressionTracker";
import {
  AVAILABLE_LEARNING_SIMANS,
  DEFAULT_LEARNING_SIMAN_ID,
  getLearningSimanConfig
} from "../data/learningSimans";

const LearningScreen = ({
  xp = 0,
  onAddXp,
  onCompleteDay,
  streak = 0,
  simanId = DEFAULT_LEARNING_SIMAN_ID
}) => {
  const [selectedSimanId, setSelectedSimanId] = useState(() => {
    if (typeof window === "undefined") return simanId;
    const storedSimanId = window.localStorage.getItem("halakhapp_learning_siman_id");
    return AVAILABLE_LEARNING_SIMANS.some((config) => config.id === storedSimanId)
      ? storedSimanId
      : simanId;
  });
  const session = useLearningSession(selectedSimanId, 5);
  const simanConfig = getLearningSimanConfig(selectedSimanId);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [simanProgress, setSimanProgress] = useState(0);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const rewardedSessionRef = useRef(false);

  const meta = session.knowledgeData?.meta;
  const simanNumber = meta?.siman ?? simanConfig.simanNumber;
  const simanTitle = meta?.title || simanId;

  useEffect(() => {
    const knowledgePoints = session.knowledgeData?.knowledge_points || [];
    if (knowledgePoints.length === 0) {
      setSimanProgress(0);
      return;
    }

    const progressions = getAllProgressions();
    const isExposureOnly = session.knowledgeData?.meta?.learning_mode === "exposure_only";
    const completedCount = knowledgePoints
      .filter((kp) => isExposureOnly
        ? progressions[kp.id] && progressions[kp.id].status !== "non_started"
        : progressions[kp.id]?.status === "mastered")
      .length;
    setSimanProgress(Math.round((completedCount / knowledgePoints.length) * 100));
  }, [session.knowledgeData, session.status]);

  const selectSiman = (nextSimanId) => {
    window.localStorage.setItem("halakhapp_learning_siman_id", nextSimanId);
    setSelectedSimanId(nextSimanId);
  };

  useEffect(() => {
    if (session.status === "active") rewardedSessionRef.current = false;

    if (session.status === "completed" && !rewardedSessionRef.current) {
      rewardedSessionRef.current = true;
      setShowVictoryModal(true);
      setShowConfetti(true);
      onAddXp?.(session.sessionScore);
      onCompleteDay?.();
    }
  }, [onAddXp, onCompleteDay, session.sessionScore, session.status]);

  const closeVictory = () => {
    setShowVictoryModal(false);
    setShowConfetti(false);
    session.restartSession();
  };

  const debugActivity = session.currentDebugInfo?.act;
  const debugKp = session.currentDebugInfo?.kp;
  const debugProgression = session.currentProgression;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 select-none overflow-hidden relative">
      {showConfetti && <ConfettiCanvas onComplete={() => setShowConfetti(false)} />}

      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-5 py-3 flex justify-between items-center shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 text-xs shadow-inner">
            <span className="text-base">⚡</span>
            <span>{xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 font-bold bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/30 text-xs shadow-inner">
            <span className="text-base">🔥</span>
            <span>{streak} Jours</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {import.meta.env.DEV && (
            <button
              onClick={() => setIsDebugMode((enabled) => !enabled)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                isDebugMode ? "bg-red-500 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
              }`}
            >
              DEBUG
            </button>
          )}
          <button
            onClick={() => setShowBadgesModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer"
          >
            <span className="text-sm">🏆</span>
            <span className="hidden sm:inline">Badges</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-zinc-100 via-amber-100/30 to-zinc-100 dark:from-zinc-900 dark:via-amber-950/20 dark:to-zinc-900 border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider whitespace-nowrap">
            Siman {simanNumber}
          </span>
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">• {simanTitle}</span>
        </div>
        <div className="flex items-center gap-3 w-1/3 max-w-[200px]">
          <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${simanProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">{simanProgress}%</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 shrink-0 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 min-w-max" aria-label="Choisir un Siman">
          {AVAILABLE_LEARNING_SIMANS.map((config) => {
            const isSelected = config.id === selectedSimanId;
            return (
              <button
                key={config.id}
                type="button"
                onClick={() => selectSiman(config.id)}
                disabled={session.status === "active"}
                aria-pressed={isSelected}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-blue-400"
                }`}
              >
                {config.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 relative flex flex-col items-center justify-center custom-scrollbar">
        <div className="z-10 w-full max-w-md">
          <div className="bg-white/95 dark:bg-zinc-900/90 border border-blue-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-blue-200 dark:border-blue-800">
              📚
            </div>
            <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Parcours dynamique
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 px-4">
              La session utilise exclusivement les activités validées du Knowledge JSON de ce Siman.
            </p>

            {session.status === "error" && (
              <p className="mb-4 text-sm font-semibold text-red-600 dark:text-red-400">
                Aucune activité admissible n’est disponible pour ce Siman.
              </p>
            )}

            <button
              onClick={session.startSession}
              disabled={["loading", "error"].includes(session.status)}
              className="w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl border-b-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 border-indigo-800 text-white active:translate-y-1 active:border-b-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {session.status === "loading" ? "Chargement..." : "Commencer la session ➔"}
            </button>
          </div>
        </div>
      </div>

      {session.status === "active" && session.currentActivity && (
        <>
          <ActivityRenderer
            key={session.currentActivity.id}
            activity={session.currentActivity}
            feedback={session.currentFeedback}
            onSubmit={session.submitAnswer}
            onNext={session.nextActivity}
            progress={(session.currentIndex / session.totalActivities) * 100}
            onClose={session.closeSession}
            currentIndex={session.currentIndex}
            totalActivities={session.totalActivities}
          />

          {import.meta.env.DEV && isDebugMode && debugActivity && debugKp && debugProgression && (
            <div className="fixed top-20 left-4 z-[100] bg-black/90 text-green-400 p-4 rounded-xl font-mono text-[10px] w-72 max-h-[75vh] overflow-y-auto shadow-2xl border border-green-500/30 break-words">
              <h4 className="font-bold text-white mb-2 pb-2 border-b border-white/20">DEBUG LEARNING CORE</h4>
              <div className="space-y-1">
                <p><span className="text-white/50">SIMAN:</span> {selectedSimanId}</p>
                <p><span className="text-white/50">SEIF:</span> {debugActivity.source_seif}</p>
                <p><span className="text-white/50">KP:</span> {debugKp.id}</p>
                <p><span className="text-white/50">ACTIVITY:</span> {debugActivity.activity_id}</p>
                <p><span className="text-white/50">RAW TYPE:</span> {debugActivity.rawType}</p>
                <p><span className="text-white/50">UI TYPE:</span> {debugActivity.type}</p>
                <p><span className="text-white/50">ASSESSMENT MODE:</span> {debugActivity.assessmentMode}</p>
                <p><span className="text-white/50">HALAKHA STATUS:</span> {debugKp.halakha_status}</p>
                <p><span className="text-white/50">STATUS:</span> {debugProgression.status}</p>
                <p><span className="text-white/50">ATTEMPTS:</span> {debugProgression.attempts}</p>
                <p><span className="text-white/50">CORRECT:</span> {debugProgression.correct}</p>
                <p><span className="text-white/50">WRONG:</span> {debugProgression.wrong}</p>
                <p><span className="text-white/50">STREAK:</span> {debugProgression.streak}</p>
                <p><span className="text-white/50">MASTERED ACTIVITIES:</span> {debugProgression.activities_mastered.map((activity) => activity.id).join(", ") || "—"}</p>
                <p><span className="text-white/50">LAST FAILED:</span> {debugProgression.last_failed_activity_id || "—"}</p>
              </div>
            </div>
          )}
        </>
      )}

      {showVictoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <ConfettiCanvas active />
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-amber-500/50 rounded-3xl p-6 text-center space-y-6 shadow-2xl relative z-10 animate-scale-up">
            <div className="text-5xl animate-bounce">🏆</div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Session complétée</span>
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-1">Félicitations !</h2>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase">Points gagnés</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">+{session.sessionScore} XP</span>
            </div>
            <button
              onClick={closeVictory}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-base shadow-xl"
            >
              Continuer mon parcours ➔
            </button>
          </div>
        </div>
      )}

      {showBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Mes Badges</h3>
              <button onClick={() => setShowBadgesModal(false)}><Icon name="close" className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-zinc-500">Bientôt disponible.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningScreen;
