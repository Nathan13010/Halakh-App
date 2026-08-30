import React, { useEffect, useMemo, useRef, useState } from "react";

const QuizFlow = ({
  questions,
  title,
  subtitle,
  onClose,
  onAttempt,
  onPassed,
  successLabel = "Continuer le parcours"
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [view, setView] = useState("quiz");
  const reportedAttemptRef = useRef(false);
  const question = questions[questionIndex];
  const isCorrect = selectedAnswer === question?.correctAnswer;
  const isTrueFalse = question?.kind === "true_false";
  const correctCount = useMemo(() => answers.filter(Boolean).length, [answers]);

  useEffect(() => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setView("quiz");
    reportedAttemptRef.current = false;
  }, [questions]);

  const continueAfterAnswer = () => {
    if (selectedAnswer === null) return;
    const nextAnswers = [...answers, isCorrect];

    if (questionIndex === questions.length - 1) {
      setAnswers(nextAnswers);
      setView("result");
      if (!reportedAttemptRef.current) {
        reportedAttemptRef.current = true;
        onAttempt?.(nextAnswers.filter(Boolean).length, questions.length);
      }
      return;
    }

    setAnswers(nextAnswers);
    setQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
  };

  const retry = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setView("quiz");
    reportedAttemptRef.current = false;
  };

  const perfect = view === "result" && correctCount === questions.length;

  if (view === "result") {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4" data-testid="quiz-result">
        <div className="w-full max-w-md rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 text-center shadow-2xl">
          <div className="text-6xl">{perfect ? "🏆" : "💪"}</div>
          <span className={`inline-block mt-5 text-[10px] font-black uppercase tracking-[0.2em] ${
            perfect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
          }`}>
            {perfect ? "Parcours sans faute" : "Encore un petit effort"}
          </span>
          <h2 className="mt-2 text-2xl font-serif font-black">
            {perfect ? "Tout est juste !" : `${correctCount}/${questions.length} bonnes réponses`}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {perfect
              ? "Tu as répondu correctement à toutes les questions."
              : "Relis les explications affichées après chaque réponse, puis recommence pour atteindre 100 %."}
          </p>
          <button
            type="button"
            onClick={perfect ? onPassed : retry}
            className={`mt-7 w-full py-4 rounded-2xl font-black text-base ${
              perfect
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-amber-400 hover:bg-amber-300 text-zinc-950"
            }`}
          >
            {perfect ? successLabel : "Recommencer le test"}
          </button>
          <button type="button" onClick={onClose} className="mt-3 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            Quitter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-100 dark:bg-zinc-950 flex flex-col" data-testid="quiz-flow" data-question-id={question.id}>
      <header className="shrink-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button type="button" onClick={onClose} aria-label="Fermer le quiz" className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-black">×</button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span className="truncate">{title}</span>
              <span>{questionIndex + 1}/{questions.length}</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:py-10 custom-scrollbar">
        <div className="w-full max-w-2xl mx-auto">
          {subtitle && <p className="text-center text-xs font-bold text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
          <section className={`${subtitle ? "mt-5" : ""} rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-7 shadow-xl`}>
            <span className="inline-flex text-[9px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
              {question.eyebrow}
            </span>
            {question.conditions && (
              <p className="mt-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 px-4 py-3 text-xs font-semibold text-blue-900 dark:text-blue-200">
                Condition : {question.conditions}
              </p>
            )}
            {question.context && (
              <blockquote className="mt-5 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900 p-4 text-sm leading-relaxed font-medium text-zinc-700 dark:text-zinc-200">
                « {question.context} »
              </blockquote>
            )}
            <h2 className="mt-5 text-xl sm:text-2xl font-serif font-black leading-snug">{question.prompt}</h2>

            <div className={`mt-7 ${isTrueFalse ? "grid grid-cols-2 gap-3" : "space-y-3"}`}>
              {question.options.map((option, optionIndex) => {
                const selected = selectedAnswer === option;
                const correctOption = option === question.correctAnswer;
                let style = "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 hover:border-blue-400";
                if (selectedAnswer !== null) {
                  if (correctOption) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100";
                  else if (selected) style = "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100";
                  else style = "border-zinc-200 dark:border-zinc-800 opacity-50";
                }

                return (
                  <button
                    type="button"
                    key={`${question.id}-${optionIndex}`}
                    data-testid="quiz-option"
                    disabled={selectedAnswer !== null}
                    onClick={() => setSelectedAnswer(option)}
                    className={`w-full rounded-2xl border-2 p-4 flex items-center gap-3 transition-all ${
                      isTrueFalse ? "min-h-24 flex-col justify-center text-center" : "text-left"
                    } ${style}`}
                  >
                    <span className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-white/70 dark:bg-zinc-800 border border-current/10 text-xs font-black">
                      {isTrueFalse ? (option === "Vrai" ? "✓" : "×") : String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="text-sm sm:text-base font-bold leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div className={`mt-6 rounded-2xl border p-4 ${
                isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
              }`}>
                <p className={`font-black ${isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                  {isCorrect ? "✓ Bonne réponse" : "✕ À revoir"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{question.explanation}</p>
                <button
                  type="button"
                  onClick={continueAfterAnswer}
                  className="mt-4 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black"
                >
                  Continuer
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default QuizFlow;
