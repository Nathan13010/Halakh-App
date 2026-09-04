import React from "react";
import { LEARNING_CATEGORY } from "../../services/learningPathModel.js";
import {
  isCategoryExamUnlocked,
  isSimanUnlocked
} from "../../services/learningPathProgress.js";

const SimanNode = ({ curriculum, pathState, index, onOpen }) => {
  const simanState = pathState.simans[curriculum.id];
  const unlocked = isSimanUnlocked(pathState, curriculum.id);
  const completed = simanState.examPassed;
  const completedLessons = simanState.completedLessons.length;
  const totalLessons = curriculum.lessons.length;
  const progress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const alignRight = index % 2 === 1;

  return (
    <div className={`relative flex ${alignRight ? "justify-end" : "justify-start"}`}>
      {index > 0 && (
        <div
          aria-hidden="true"
          className={`absolute -top-14 h-16 w-24 border-dashed border-blue-300/70 dark:border-blue-700/60 ${
            alignRight
              ? "left-[24%] border-r-2 rounded-tr-[3rem]"
              : "right-[24%] border-l-2 rounded-tl-[3rem]"
          }`}
        />
      )}

      <article
        data-testid={`path-${curriculum.id}`}
        className={`relative w-[88%] sm:w-[78%] rounded-[2rem] border p-5 sm:p-6 transition-all ${
          completed
            ? "bg-emerald-50/95 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/5"
            : unlocked
              ? "bg-white dark:bg-zinc-900 border-blue-300 dark:border-blue-700 shadow-xl shadow-blue-900/10"
              : "bg-zinc-100/90 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 opacity-75"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-xl font-black border-b-4 ${
            completed
              ? "bg-emerald-500 text-white border-emerald-700"
              : unlocked
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-indigo-800"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700"
          }`}>
            {completed ? "✓" : unlocked ? curriculum.simanNumber : "🔒"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Étape {index + 1} · Siman {curriculum.simanNumber}
              </span>
              {completed && (
                <span className="text-[9px] font-black uppercase tracking-wider rounded-full px-2 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  Validé
                </span>
              )}
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">
              {curriculum.title}
            </h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {totalLessons} petites leçons · examen final à 100 %
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all ${completed ? "bg-emerald-500" : "bg-blue-500"}`}
              style={{ width: `${completed ? 100 : progress}%` }}
            />
          </div>
          <span className="text-[11px] font-black tabular-nums text-zinc-500 dark:text-zinc-400">
            {completed ? "100 %" : `${completedLessons}/${totalLessons}`}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpen(curriculum.id)}
          disabled={!unlocked}
          className={`mt-4 w-full py-3 rounded-2xl text-sm font-black transition-all ${
            completed
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : unlocked
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:translate-y-0.5"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
          }`}
        >
          {completed ? "Revoir ce Siman" : completedLessons > 0 ? "Continuer" : unlocked ? "Commencer" : "Termine le Siman précédent"}
        </button>
      </article>
    </div>
  );
};

const LearningPathMap = ({ curricula, pathState, onOpenSiman, onOpenCategoryExam, onOpenRevision }) => {
  const allCurricula = LEARNING_CATEGORY.simanIds.map((id) => curricula[id]).filter(Boolean);
  const completedSimans = allCurricula.filter((curriculum) => pathState.simans[curriculum.id].examPassed).length;
  const categoryUnlocked = isCategoryExamUnlocked(pathState);
  const categoryCompleted = pathState.categoryExam.passed;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10" data-testid="learning-path-map">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white p-6 sm:p-8 shadow-2xl shadow-indigo-950/20 mb-12">
        <div className="absolute -right-10 -top-12 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute right-20 -bottom-16 w-32 h-32 rounded-full bg-amber-300/15" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/15 px-3 py-1.5 rounded-full">
            Parcours guidé · {completedSimans}/{allCurricula.length} Simanim
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-black mt-4 text-left">
            {LEARNING_CATEGORY.title}
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-blue-50/90 leading-relaxed">
            Avance dans l'ordre : trois notions simples, un entraînement, puis un examen de Siman sans faute.
          </p>
          <div className="mt-6 h-3 rounded-full overflow-hidden bg-black/20 border border-white/15">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${allCurricula.length ? (completedSimans / allCurricula.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </section>

      <div className="space-y-14">
        {allCurricula.map((curriculum, index) => (
          <SimanNode
            key={curriculum.id}
            curriculum={curriculum}
            pathState={pathState}
            index={index}
            onOpen={onOpenSiman}
          />
        ))}

        <div className="relative flex justify-center pt-2">
          <div aria-hidden="true" className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 border-l-2 border-dashed border-amber-300 dark:border-amber-700" />
          <article className={`w-[92%] sm:w-[82%] rounded-[2rem] border-2 p-6 text-center ${
            categoryCompleted
              ? "bg-amber-50 dark:bg-amber-950/25 border-amber-400"
              : categoryUnlocked
                ? "bg-white dark:bg-zinc-900 border-amber-400 shadow-xl shadow-amber-900/10"
                : "bg-zinc-100 dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800 opacity-75"
          }`}>
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br from-amber-300 to-orange-500 border-b-4 border-orange-700 shadow-lg">
              {categoryCompleted ? "🏆" : categoryUnlocked ? "⭐" : "🔒"}
            </div>
            <span className="block mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Épreuve finale
            </span>
            <h3 className="mt-1 text-xl font-serif font-black">Test de la catégorie</h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Des questions issues de chacun des Simanim · réussite à 100 %
            </p>
            <button
              type="button"
              onClick={onOpenCategoryExam}
              disabled={!categoryUnlocked}
              className={`mt-5 w-full py-3 rounded-2xl text-sm font-black ${
                categoryUnlocked
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 hover:from-amber-300 hover:to-orange-400"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
              }`}
            >
              {categoryCompleted ? "Refaire le test final" : categoryUnlocked ? "Passer le test final" : "Valide d'abord tous les Simanim"}
            </button>
          </article>
        </div>

        {categoryCompleted && (
          <button
            type="button"
            onClick={onOpenRevision}
            className="w-full rounded-[2rem] p-5 flex items-center gap-4 text-left bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/20"
          >
            <span className="text-3xl">📖</span>
            <span className="flex-1">
              <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-100">Fiche obtenue</span>
              <span className="block mt-1 font-black">Ouvrir ma fiche de révision permanente</span>
            </span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LearningPathMap;
