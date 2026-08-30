/**
 * @deprecated LEGACY EN QUARANTAINE — le Learning Core actif utilise
 * learning/ActivityRenderer et ne doit pas reconnecter ce composant.
 */
import React, { useState } from 'react';
import Icon from './Icon';
import LearningCard from './LearningCard';

const ActivityModal = ({ 
  activity, 
  feedback, 
  onSubmit, 
  onNext, 
  progress, 
  onClose,
  currentIndex,
  totalActivities
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = () => {
    if (activity.type === 'card') {
      onSubmit(true);
      return;
    }
    const isCorrect = selectedOption === activity.correctIndex;
    onSubmit(isCorrect);
  };

  const handleNext = () => {
    setSelectedOption(null);
    onNext();
  };

  const isSubmitted = feedback !== null;
  const isCorrect = feedback === 'correct';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh]">
        
        {/* En-tête de progression */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 shrink-0">
          <div className="flex items-center gap-3 flex-1 mr-4">
            <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
              <div 
                className="bg-gradient-to-r from-blue-500 to-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
              {currentIndex + 1}/{totalActivities}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu de l'activité */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {activity.type === 'card' && <LearningCard activity={activity} />}
          
          {(activity.type === 'quiz' || activity.type === 'true_false') && (
            <div className="space-y-4">
              <div className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Question
              </div>
              
              <h3 className="text-base sm:text-lg font-serif font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed pt-2">
                {activity.question}
              </h3>

              <div className="space-y-3 pt-2">
                {activity.options.map((optText, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let optionStyle = "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-800 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50";
                  
                  if (isSelected) {
                    optionStyle = "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/30";
                  }
                  if (isSubmitted && isSelected) {
                    optionStyle = isCorrect 
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40"
                      : "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-900 dark:text-red-200 ring-2 ring-red-500/40";
                  }

                  // Surbrillance de la bonne réponse si l'utilisateur s'est trompé
                  if (isSubmitted && !isCorrect && optIdx === activity.correctIndex) {
                    optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40 opacity-80";
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${optionStyle}`}
                    >
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                        isSelected 
                          ? (isSubmitted ? (isCorrect ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white') : 'bg-blue-500 border-blue-400 text-white')
                          : (isSubmitted && !isCorrect && optIdx === activity.correctIndex) 
                            ? 'bg-emerald-500 border-emerald-400 text-white' 
                            : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm font-medium leading-snug pt-0.5">{optText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Barre d'action et feedback */}
        <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0">
          {!isSubmitted ? (
            <button
              disabled={activity.type !== 'card' && selectedOption === null}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg cursor-pointer ${
                (activity.type === 'card' || selectedOption !== null)
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 scale-[1.01] active:scale-95"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none"
              }`}
            >
              {activity.type === 'card' ? "J'ai compris" : "Vérifier ma réponse"}
            </button>
          ) : (
            <div className="space-y-4 animate-slide-up">
              {activity.type !== 'card' && (
                <div className={`p-4 rounded-2xl border ${
                  isCorrect 
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200" 
                    : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/40 text-red-900 dark:text-red-200"
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    <span>{isCorrect ? "🎉 Excellent !" : "❌ Pas tout à fait..."}</span>
                  </div>
                  {activity.explanation && (
                    <p className="text-xs leading-relaxed font-medium text-zinc-700 dark:text-zinc-300">
                      {activity.explanation}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-base shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Continuer ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
