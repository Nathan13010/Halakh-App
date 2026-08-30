import React, { useState, useRef } from 'react';

/**
 * ClassicQuiz.jsx
 *
 * Mini-jeu pour le type 'multiple_choice'.
 * Respecte strictement la Halakha: n'invente rien, affiche le JSON.
 */
const ClassicQuiz = ({ activity, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [isNextClicked, setIsNextClicked] = useState(false);
  const hasSubmittedRef = useRef(false);
  const hasSelectedOptionRef = useRef(false);

  const handleSubmit = (optIdx, optText) => {
    if (isSubmitted || hasSelectedOptionRef.current) return;
    hasSelectedOptionRef.current = true;

    setSelectedOption(optIdx);
    setIsSubmitted(true);

    const correct = optText === activity.correct_answer;
    setIsCorrect(correct);
  };

  const handleNext = () => {
    if (hasSubmittedRef.current || isNextClicked) return;
    hasSubmittedRef.current = true;
    setIsNextClicked(true);
    onSubmit(isCorrect);
  };

  // Cadre spécifique pour les opinions multiples
  const isMultipleOpinions = activity.halakha_status === 'multiple_opinions';
  const isConditional = activity.halakha_status === 'conditional';

  return (
    <div data-testid="classic-quiz" className="flex flex-col h-full w-full max-w-xl mx-auto animate-fade-in pb-4">

      {/* Zone de Question */}
      <div className="space-y-4 px-2">
        {/* Encadré d'opinion multiple */}
        {isMultipleOpinions && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-3 rounded-r-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1">
              Selon l'opinion mentionnée :
            </div>
            {/* Si le JSON précise le contexte de l'opinion dans la question, on le laisse. */}
          </div>
        )}

        {/* Encadré de condition */}
        {isConditional && activity.conditions && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1">
              Condition :
            </div>
            <div className="text-sm font-medium text-blue-900 dark:text-blue-200">
              {activity.conditions}
            </div>
          </div>
        )}

        <div className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          Question
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
          {activity.question}
        </h3>
      </div>

      {/* Zone d'Options */}
      <div className="space-y-3 mt-8 px-2 flex-1">
        {activity.options.map((optText, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isThisOptionCorrect = optText === activity.correct_answer;

          let optionStyle = "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md";
          let letterStyle = "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400";

          if (isSelected && !isSubmitted) {
            optionStyle = "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20";
            letterStyle = "bg-blue-500 border-blue-600 text-white";
          } else if (isSubmitted) {
            if (isThisOptionCorrect) {
              optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20 z-10";
              letterStyle = "bg-emerald-500 border-emerald-600 text-white";
            } else if (isSelected && !isThisOptionCorrect) {
              optionStyle = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 opacity-90";
              letterStyle = "bg-red-500 border-red-600 text-white";
            } else {
              optionStyle = "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 opacity-50";
              letterStyle = "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600";
            }
          }

          return (
            <button
              key={optIdx}
              disabled={isSubmitted}
              onClick={() => handleSubmit(optIdx, optText)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 cursor-pointer relative overflow-hidden group ${optionStyle}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 border transition-colors ${letterStyle}`}>
                {String.fromCharCode(65 + optIdx)}
              </div>
              <span className="text-base font-medium flex-1 pt-0.5">{optText}</span>
            </button>
          );
        })}
      </div>

      {/* Zone de Feedback & Action */}
      {isSubmitted && (
        <div className="mt-6 animate-slide-up px-2 space-y-4">
          <div className={`p-5 rounded-2xl border ${
            isCorrect
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-500/30"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30"
          }`}>
            <div className={`font-black text-lg mb-2 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
              {isCorrect ? "🎉 Bonne réponse !" : "❌ Ce n'est pas la bonne réponse"}
            </div>

            {/* Si c'est faux, on peut rappeler la bonne réponse */}
            {!isCorrect && (
              <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
                La bonne réponse était : <span className="text-emerald-600 dark:text-emerald-400">{activity.correct_answer}</span>
              </div>
            )}

            {/* Explication stricte tirée du JSON */}
            {activity.explanation && (
              <p className="text-sm leading-relaxed font-medium text-zinc-700 dark:text-zinc-300">
                {activity.explanation}
              </p>
            )}

            {/* Metadonnées de debug si besoin (caché en prod, géré par le wrapper parent) */}
          </div>

          <button
            onClick={handleNext}
            disabled={isNextClicked}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all ${
              isNextClicked
                ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 active:scale-95 cursor-pointer'
            }`}
          >
            Continuer ➔
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassicQuiz;
