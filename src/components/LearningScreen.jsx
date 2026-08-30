import React, { useState } from "react";
import ConfettiCanvas from "./ConfettiCanvas";
import LearningPathMap from "./learning/LearningPathMap.jsx";
import LessonPlayer from "./learning/LessonPlayer.jsx";
import QuizFlow from "./learning/QuizFlow.jsx";
import RevisionSheet from "./learning/RevisionSheet.jsx";
import SimanPathView from "./learning/SimanPathView.jsx";
import { useLearningPath } from "../hooks/useLearningPath.js";

const LearningScreen = ({ xp = 0, onAddXp, onCompleteDay, streak = 0 }) => {
  const learningPath = useLearningPath();
  const [view, setView] = useState({ type: "path" });
  const [showConfetti, setShowConfetti] = useState(false);

  const curriculum = view.simanId ? learningPath.curricula[view.simanId] : null;
  const lesson = curriculum?.lessons.find((candidate) => candidate.id === view.lessonId);

  const award = (amount) => {
    onAddXp?.(amount);
    onCompleteDay?.();
    setShowConfetti(true);
  };

  const completeLesson = () => {
    if (!curriculum || !lesson) return;
    const newlyCompleted = learningPath.completeLesson(curriculum.id, lesson.id);
    if (newlyCompleted) award(30);
    setView({ type: "siman", simanId: curriculum.id });
  };

  const recordSimanAttempt = (correct, total) => {
    if (!curriculum) return;
    const newlyPassed = learningPath.submitSimanExam(curriculum.id, correct, total);
    if (newlyPassed) award(100);
  };

  const recordCategoryAttempt = (correct, total) => {
    const newlyPassed = learningPath.submitCategoryExam(correct, total);
    if (newlyPassed) award(250);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden relative">
      {showConfetti && <ConfettiCanvas onComplete={() => setShowConfetti(false)} />}

      <header className="shrink-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-sm">
        <button
          type="button"
          onClick={() => setView({ type: "path" })}
          className="min-w-0 text-left"
          aria-label="Retourner au parcours d'apprentissage"
        >
          <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Mon parcours</span>
          <span className="block text-sm font-serif font-black truncate">הלכות הנהגת אדם בבוקר</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {learningPath.pathState.revisionSheetUnlocked && (
            <button
              type="button"
              onClick={() => setView({ type: "revision" })}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-black"
            >
              📖 Ma fiche
            </button>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-[11px] font-black">⚡ {xp} XP</span>
          <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-700 dark:text-orange-400 text-[11px] font-black">🔥 {streak}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {learningPath.status === "loading" && (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <p className="text-sm font-bold text-zinc-500">Préparation du parcours dans l'ordre…</p>
          </div>
        )}

        {learningPath.status === "error" && (
          <div className="h-full flex items-center justify-center px-6">
            <div className="max-w-md rounded-3xl bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-800 p-6 text-center">
              <div className="text-4xl">⚠️</div>
              <h2 className="mt-3 font-black">Le parcours n'a pas pu être chargé</h2>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">{learningPath.error?.message || "Données indisponibles"}</p>
            </div>
          </div>
        )}

        {learningPath.status === "ready" && view.type === "path" && (
          <LearningPathMap
            curricula={learningPath.curricula}
            pathState={learningPath.pathState}
            onOpenSiman={(simanId) => setView({ type: "siman", simanId })}
            onOpenCategoryExam={() => setView({ type: "categoryExam" })}
            onOpenRevision={() => setView({ type: "revision" })}
          />
        )}

        {learningPath.status === "ready" && curriculum && ["siman", "lesson", "simanExam"].includes(view.type) && (
          <SimanPathView
            curriculum={curriculum}
            pathState={learningPath.pathState}
            onBack={() => setView({ type: "path" })}
            onOpenLesson={(lessonId) => setView({ type: "lesson", simanId: curriculum.id, lessonId })}
            onOpenExam={() => setView({ type: "simanExam", simanId: curriculum.id })}
          />
        )}

        {learningPath.status === "ready" && view.type === "revision" && (
          <RevisionSheet curricula={learningPath.curricula} onBack={() => setView({ type: "path" })} />
        )}
      </main>

      {view.type === "lesson" && lesson && curriculum && (
        <LessonPlayer
          lesson={lesson}
          simanNumber={curriculum.simanNumber}
          alreadyCompleted={learningPath.pathState.simans[curriculum.id].completedLessons.includes(lesson.id)}
          onClose={() => setView({ type: "siman", simanId: curriculum.id })}
          onComplete={completeLesson}
        />
      )}

      {view.type === "simanExam" && curriculum && (
        <QuizFlow
          questions={learningPath.simanExams[curriculum.id]}
          title={`Examen final · Siman ${curriculum.simanNumber}`}
          subtitle="Le Siman est validé uniquement si toutes les réponses sont justes dans la même tentative."
          onClose={() => setView({ type: "siman", simanId: curriculum.id })}
          onAttempt={recordSimanAttempt}
          onPassed={() => setView({ type: "path" })}
          successLabel="Valider le Siman et revenir au parcours"
        />
      )}

      {view.type === "categoryExam" && (
        <QuizFlow
          questions={learningPath.categoryExam}
          title="Test final · הלכות הנהגת אדם בבוקר"
          subtitle="Deux questions de chaque Siman. Un sans-faute débloque ta fiche permanente."
          onClose={() => setView({ type: "path" })}
          onAttempt={recordCategoryAttempt}
          onPassed={() => setView({ type: "revision" })}
          successLabel="Ouvrir ma fiche de révision"
        />
      )}
    </div>
  );
};

export default LearningScreen;
