import React, { useEffect, useState } from "react";
import { getGlossaryForText } from "../../data/learningGlossary.js";
import QuizFlow from "./QuizFlow.jsx";

const LessonPlayer = ({ lesson, simanNumber, alreadyCompleted, onClose, onComplete }) => {
  const [phase, setPhase] = useState("learning");
  const [itemIndex, setItemIndex] = useState(0);

  useEffect(() => {
    setPhase("learning");
    setItemIndex(0);
  }, [lesson.id]);

  const item = lesson.items[itemIndex];
  const glossary = getGlossaryForText(`${item.title} ${item.coreText}`);

  if (phase === "quiz") {
    return (
      <QuizFlow
        questions={lesson.questions}
        title={`Leçon ${lesson.number} · Siman ${simanNumber}`}
        subtitle="Les questions portent uniquement sur les notions que tu viens de découvrir."
        onClose={onClose}
        onPassed={() => setPhase("success")}
        successLabel="Valider cette leçon"
      />
    );
  }

  if (phase === "success") {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4" data-testid="lesson-success">
        <div className="w-full max-w-md rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 text-center shadow-2xl">
          <div className="text-6xl">🌟</div>
          <span className="block mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Leçon terminée</span>
          <h2 className="mt-2 text-2xl font-serif font-black">{lesson.title}</h2>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Les {lesson.items.length} notions ont été apprises et vérifiées sans faute.
          </p>
          <button
            type="button"
            onClick={onComplete}
            className="mt-7 w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black"
          >
            {alreadyCompleted ? "Retour au Siman" : "Débloquer la leçon suivante · +30 XP"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-100 dark:bg-zinc-950 flex flex-col" data-testid="lesson-player" data-item-id={item.id}>
      <header className="shrink-0 bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button type="button" onClick={onClose} aria-label="Fermer la leçon" className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-black">×</button>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span>Leçon {lesson.number} · {lesson.title}</span>
              <span>{itemIndex + 1}/{lesson.items.length}</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all" style={{ width: `${((itemIndex + 1) / lesson.items.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:py-10 custom-scrollbar">
        <article className="w-full max-w-2xl mx-auto rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xl">
          <div className="flex justify-between items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-full">
              Notion {itemIndex + 1} sur {lesson.items.length}
            </span>
            <span className="text-[10px] font-bold text-zinc-400">Paragraphe {item.sourceSeif}</span>
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-serif font-black leading-tight">{item.title}</h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed font-medium text-zinc-700 dark:text-zinc-200">
            {item.coreText}
          </p>

          {item.explanation && (
            <div className="mt-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">En mots simples</span>
              <p className="mt-1.5 text-sm leading-relaxed text-blue-950 dark:text-blue-100">{item.explanation}</p>
            </div>
          )}

          {glossary.length > 0 && (
            <div className="mt-5 space-y-2" data-testid="lesson-glossary">
              <span className="text-[9px] font-black uppercase tracking-widest text-violet-700 dark:text-violet-300">Vocabulaire utile</span>
              {glossary.map((entry) => (
                <div key={entry.term} className="rounded-2xl bg-violet-50 dark:bg-violet-950/25 border border-violet-200 dark:border-violet-900 px-4 py-3 text-sm">
                  <strong className="text-violet-800 dark:text-violet-200">{entry.term}</strong>
                  <span className="text-zinc-600 dark:text-zinc-300"> — {entry.definition}</span>
                </div>
              ))}
            </div>
          )}

          {item.fullText && (
            <details className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-4">
              <summary className="cursor-pointer text-xs font-black text-zinc-600 dark:text-zinc-300">Voir la règle complète et ses nuances</summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{item.fullText}</p>
            </details>
          )}

          <button
            type="button"
            onClick={() => {
              if (itemIndex < lesson.items.length - 1) setItemIndex((index) => index + 1);
              else setPhase("quiz");
            }}
            className="mt-7 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black shadow-lg shadow-blue-600/20"
          >
            {itemIndex < lesson.items.length - 1 ? "Notion suivante" : "Vérifier ce que j'ai appris"}
          </button>
        </article>
      </main>
    </div>
  );
};

export default LessonPlayer;
