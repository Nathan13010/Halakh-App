import React, { useEffect, useState } from "react";
import QuizFlow from "./QuizFlow.jsx";
import SourceReferenceModal from "./SourceReferenceModal.jsx";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const GlossaryDefinition = ({ entry }) => {
  const emphasis = [...(entry.emphasis || [])].sort((left, right) => right.length - left.length);
  if (emphasis.length === 0) return entry.definition;
  const parts = entry.definition.split(new RegExp(`(${emphasis.map(escapeRegExp).join("|")})`, "g"));
  return parts.map((part, index) => (
    emphasis.includes(part)
      ? <strong key={`${part}-${index}`} className="text-violet-800 dark:text-violet-200">{part}</strong>
      : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
  ));
};

const LessonPlayer = ({ lesson, simanNumber, alreadyCompleted, onClose, onComplete }) => {
  const [phase, setPhase] = useState("learning");
  const [itemIndex, setItemIndex] = useState(0);
  const [showReference, setShowReference] = useState(false);

  useEffect(() => {
    setPhase("learning");
    setItemIndex(0);
    setShowReference(false);
  }, [lesson.id]);

  const item = lesson.items[itemIndex];
  const glossary = item.vocabulary || [];

  if (phase === "quiz") {
    return (
      <QuizFlow
        questions={lesson.questions}
        title={`Leçon ${lesson.number} · Siman ${simanNumber}`}
        subtitle={null}
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
            <span className="text-[10px] font-bold text-zinc-400">Paragraphe {item.sourceParagraph}</span>
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-serif font-black leading-tight">{item.title}</h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed font-medium text-zinc-700 dark:text-zinc-200">
            {item.coreText}
          </p>

          {item.explanation && (
            <div className="mt-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4 flex items-start gap-3">
              <span aria-hidden="true" className="text-lg">💡</span>
              <p className="whitespace-pre-line text-sm leading-relaxed text-blue-950 dark:text-blue-100">{item.explanation}</p>
            </div>
          )}

          {glossary.length > 0 && (
            <div className="mt-5 space-y-2" data-testid="lesson-glossary">
              <span className="text-[9px] font-black uppercase tracking-widest text-violet-700 dark:text-violet-300">
                {glossary.every((entry) => entry.exposure === 2) ? "Rappel vocabulaire" : "Vocabulaire utile"}
              </span>
              {glossary.map((entry) => (
                <div key={entry.term} className="rounded-2xl bg-violet-50 dark:bg-violet-950/25 border border-violet-200 dark:border-violet-900 px-4 py-3 text-sm">
                  <p className="text-zinc-600 dark:text-zinc-300"><GlossaryDefinition entry={entry} /></p>
                </div>
              ))}
            </div>
          )}

          {item.references.length > 0 && (
            <button
              type="button"
              onClick={() => setShowReference(true)}
              className="mt-5 w-full rounded-2xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/25 px-4 py-3.5 flex items-center justify-center gap-2 text-sm font-black text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/40"
            >
              <span aria-hidden="true">📜</span>
              Voir la loi complète en français
            </button>
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

      {showReference && <SourceReferenceModal item={item} onClose={() => setShowReference(false)} />}
    </div>
  );
};

export default LessonPlayer;
