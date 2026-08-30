import React from "react";
import {
  isLessonUnlocked,
  isSimanExamUnlocked
} from "../../services/learningPathProgress.js";

const SimanPathView = ({ curriculum, pathState, onBack, onOpenLesson, onOpenExam }) => {
  const simanState = pathState.simans[curriculum.id];
  const lessonIds = curriculum.lessons.map((lesson) => lesson.id);
  const examUnlocked = isSimanExamUnlocked(pathState, curriculum.id, lessonIds);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8" data-testid="siman-path-view">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400"
      >
        ← Retour au parcours
      </button>

      <section className="mt-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 border-b-4 border-indigo-800 text-white text-2xl font-black">
            {curriculum.simanNumber}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Siman {curriculum.simanNumber}
            </span>
            <h1 className="mt-1 font-serif text-2xl font-black leading-tight">{curriculum.title}</h1>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {curriculum.lessons.length} leçons · 3 notions maximum par leçon
            </p>
          </div>
        </div>
        {curriculum.needsEditorialReview && (
          <div className="mt-5 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
            Version pilote : les règles affichées reprennent la source existante. Leur simplification éditoriale pourra être affinée après tes retours.
          </div>
        )}
      </section>

      <div className="mt-10 space-y-8">
        {curriculum.lessons.map((lesson, index) => {
          const completed = simanState.completedLessons.includes(lesson.id);
          const unlocked = isLessonUnlocked(pathState, curriculum.id, index, lessonIds);
          const alignRight = index % 2 === 1;

          return (
            <div key={lesson.id} className={`relative flex ${alignRight ? "justify-end" : "justify-start"}`}>
              {index > 0 && (
                <div aria-hidden="true" className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 border-l-2 border-dashed border-blue-300 dark:border-blue-700" />
              )}
              <button
                type="button"
                data-testid={`lesson-node-${lesson.number}`}
                onClick={() => onOpenLesson(lesson.id)}
                disabled={!unlocked}
                className={`w-[90%] sm:w-[76%] rounded-3xl border p-4 text-left transition-all ${
                  completed
                    ? "bg-emerald-50 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800"
                    : unlocked
                      ? "bg-white dark:bg-zinc-900 border-blue-300 dark:border-blue-700 hover:-translate-y-0.5 hover:shadow-xl"
                      : "bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 opacity-65 cursor-not-allowed"
                }`}
              >
                <div className="flex gap-4 items-center">
                  <span className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center font-black border-b-4 ${
                    completed
                      ? "bg-emerald-500 border-emerald-700 text-white"
                      : unlocked
                        ? "bg-blue-500 border-blue-700 text-white"
                        : "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500"
                  }`}>
                    {completed ? "✓" : unlocked ? lesson.number : "🔒"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                      Leçon {lesson.number} · {lesson.items.length} notion{lesson.items.length > 1 ? "s" : ""}
                    </span>
                    <span className="block mt-1 font-black text-sm sm:text-base leading-tight">{lesson.title}</span>
                    <span className="block mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {lesson.items.map((item) => item.title).join(" · ")}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-zinc-400">→</span>
                </div>
              </button>
            </div>
          );
        })}

        <div className="relative pt-3 flex justify-center">
          <div aria-hidden="true" className="absolute -top-5 left-1/2 h-8 border-l-2 border-dashed border-amber-300 dark:border-amber-700" />
          <button
            type="button"
            data-testid="siman-exam-node"
            onClick={onOpenExam}
            disabled={!examUnlocked}
            className={`w-[94%] rounded-[2rem] border-2 p-6 text-center transition-all ${
              simanState.examPassed
                ? "bg-amber-50 dark:bg-amber-950/25 border-amber-400"
                : examUnlocked
                  ? "bg-white dark:bg-zinc-900 border-amber-400 hover:shadow-xl"
                  : "bg-zinc-100 dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800 opacity-65 cursor-not-allowed"
            }`}
          >
            <span className="text-3xl">{simanState.examPassed ? "🏅" : examUnlocked ? "🎯" : "🔒"}</span>
            <span className="block mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">Examen du Siman</span>
            <span className="block mt-1 text-lg font-serif font-black">
              {simanState.examPassed ? "Siman validé à 100 %" : "Réponds juste à toutes les questions"}
            </span>
            {simanState.examAttempts > 0 && (
              <span className="block mt-2 text-xs text-zinc-500">Meilleur score : {simanState.bestExamScore} %</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimanPathView;
