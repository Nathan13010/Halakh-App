import React, { useState, useRef } from 'react';

/**
 * ScenarioGame.jsx
 *
 * Mini-jeu pour le type 'practical_situation'.
 * Respecte strictement la Halakha: ne génère aucune donnée, affiche uniquement le JSON.
 * Gère à la fois les situations avec options (QCM de situation) et sans options (auto-évaluation).
 */
const ScenarioGame = ({ activity, onSubmit }) => {
  // Etapes: 1 = Situation, 2 = Question (+ Choix si existants), 3 = Feedback
  const [step, setStep] = useState(1);

  // Pour les situations avec options
  const [selectedOption, setSelectedOption] = useState(null);

  // Résultat de l'activité (vrai/faux)
  const [isCorrect, setIsCorrect] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isNextClicked, setIsNextClicked] = useState(false);
  const hasSubmittedRef = useRef(false);
  const hasSelectedOptionRef = useRef(false);

  const hasOptions = Array.isArray(activity.options) && activity.options.length >= 2;

  // Passage à l'étape de la question
  const handleGoToQuestion = () => {
    setStep(2);
  };

  // Passage à l'étape de feedback (réponse avec options)
  const handleSelectOption = (optIdx, optText) => {
    if (step !== 2 || hasSelectedOptionRef.current) return;
    hasSelectedOptionRef.current = true;

    setSelectedOption(optIdx);
    setIsCorrect(optText === activity.correct_answer);
    setStep(3);
  };

  // Passage à l'étape de feedback (réponse sans options, on révèle juste la réponse)
  const handleRevealAnswer = () => {
    if (step !== 2) return;
    setStep(3);
  };

  // Soumission finale au système
  const handleFinalSubmit = (correctState) => {
    if (hasSubmittedRef.current || isNextClicked) return;
    hasSubmittedRef.current = true;
    setIsNextClicked(true);
    setIsSubmitted(true); // Pour désactiver l'UI visuellement si nécessaire
    onSubmit(correctState);
  };

  // Cadre spécifique pour les opinions multiples et conditions
  const isMultipleOpinions = activity.halakha_status === 'multiple_opinions';
  const isConditional = activity.halakha_status === 'conditional';

  return (
    <div data-testid="scenario-game" className="flex flex-col h-full w-full max-w-xl mx-auto animate-fade-in pb-4">

      {/* --- En-tête Fixe : Contextes Halakhiques --- */}
      <div className="space-y-4 px-2 shrink-0">
        {isMultipleOpinions && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-3 rounded-r-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1">
              Plusieurs opinions (Cadre d'application)
            </div>
          </div>
        )}

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
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 mt-4 space-y-6">

        {/* --- ETAPE 1 : LA SITUATION --- */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Situation Pratique
          </div>
          <p className="text-lg sm:text-xl font-serif text-slate-900 dark:text-slate-100 leading-relaxed">
            {activity.situation}
          </p>
        </div>

        {/* --- ETAPE 2 : LA QUESTION (Révélée après l'étape 1) --- */}
        {step >= 2 && (
          <div className="animate-slide-up space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-md border-l-4 border-l-amber-500">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2">
                Question
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {activity.question}
              </h3>
            </div>

            {/* S'il y a des options, on les affiche à l'étape 2 */}
            {hasOptions && step === 2 && (
              <div className="space-y-3">
                {activity.options.map((optText, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx, optText)}
                    className="w-full text-left p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200"
                  >
                    {optText}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- ETAPE 3 : FEEDBACK --- */}
        {step >= 3 && (
          <div className="animate-slide-up space-y-4">
            {/* Si c'était un QCM avec options, on affiche le feedback de la réponse */}
            {hasOptions && (
              <div className={`p-5 rounded-2xl border ${
                isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-500/30"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30"
              }`}>
                <div className={`font-black text-lg mb-2 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isCorrect ? "🎉 Bonne conduite !" : "❌ Mauvaise décision"}
                </div>
                {!isCorrect && (
                  <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
                    La bonne décision était : <span className="text-emerald-600 dark:text-emerald-400">{activity.correct_answer}</span>
                  </div>
                )}
                {activity.explanation && (
                  <p className="text-sm leading-relaxed font-medium text-zinc-700 dark:text-zinc-300">
                    {activity.explanation}
                  </p>
                )}
              </div>
            )}

            {/* Si c'était sans options, on affiche la réponse et on demande l'auto-évaluation */}
            {!hasOptions && (
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-800 rounded-3xl p-6">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 mb-2">
                  Conduite Halakhique (Réponse)
                </div>
                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-4">
                  {activity.answer}
                </p>

                {activity.explanation && activity.explanation !== "-" && (
                  <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/50">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600/70 dark:text-emerald-500/70 mb-2">
                      Explication
                    </div>
                    <p className="text-sm leading-relaxed font-medium text-emerald-800 dark:text-emerald-200">
                      {activity.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Zone d'Action (Footer Fixe) --- */}
      <div className="pt-4 px-2 shrink-0">
        {step === 1 && (
          <button
            onClick={handleGoToQuestion}
            className="w-full py-4 rounded-2xl font-black text-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white active:scale-95 transition-all shadow-lg"
          >
            Analyser la situation ➔
          </button>
        )}

        {step === 2 && !hasOptions && (
          <button
            onClick={handleRevealAnswer}
            className="w-full py-4 rounded-2xl font-black text-lg bg-blue-600 text-white hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            Révéler la conduite à tenir ➔
          </button>
        )}

        {/* Etape 3 : Si on a des options, on affiche juste Continuer (le résultat a déjà été évalué) */}
        {step === 3 && hasOptions && (
          <button
            onClick={() => handleFinalSubmit(isCorrect)}
            disabled={isNextClicked}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all ${
              isNextClicked
                ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 active:scale-95 cursor-pointer'
            }`}
          >
            Continuer ➔
          </button>
        )}

        {/* Etape 3 : Si PAS d'options, on a révélé la réponse. On affiche juste Continuer. */}
        {step === 3 && !hasOptions && (
          <button
            onClick={() => handleFinalSubmit(null)}
            disabled={isNextClicked}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all ${
              isNextClicked
                ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white active:scale-95 cursor-pointer'
            }`}
          >
            Continuer ➔
          </button>
        )}
      </div>

    </div>
  );
};

export default ScenarioGame;
