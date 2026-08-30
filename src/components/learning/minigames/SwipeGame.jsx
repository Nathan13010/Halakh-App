import React, { useState, useRef } from 'react';

/**
 * SwipeGame.jsx
 *
 * Mini-jeu pour le type 'true_false'.
 * Mobile-first avec support de swipe (gauche=FAUX, droite=VRAI) et boutons.
 * Respecte strictement la Halakha: n'invente rien, affiche le JSON.
 */
const SwipeGame = ({ activity, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null); // true pour VRAI, false pour FAUX
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const [isNextClicked, setIsNextClicked] = useState(false);
  const hasSubmittedRef = useRef(false);
  const hasSelectedOptionRef = useRef(false);

  // Touch references for swiping
  const touchStartRef = useRef(null);
  const swipeOffsetRef = useRef(0);

  const handleSubmit = (choice) => {
    if (isSubmitted || hasSelectedOptionRef.current) return;
    hasSelectedOptionRef.current = true;

    setSelectedOption(choice);
    setIsSubmitted(true);
    setSwipeOffset(0); // Reset visual offset
    swipeOffsetRef.current = 0;

    const correct = choice === activity.is_true;
    setIsCorrect(correct);
  };

  const handleNext = () => {
    if (hasSubmittedRef.current || isNextClicked) return;
    hasSubmittedRef.current = true;
    setIsNextClicked(true);
    onSubmit(isCorrect);
  };

  // --- Gestion du Swipe ---
  const handleTouchStart = (e) => {
    if (isSubmitted) return;
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchMove = (e) => {
    if (isSubmitted || touchStartRef.current === null) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;

    const diffX = currentX - touchStartRef.current.x;
    const diffY = currentY - touchStartRef.current.y;

    // Si le mouvement est majoritairement vertical, on l'ignore (c'est un scroll de la page)
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(swipeOffset) < 10) {
      return;
    }

    // Limiter l'effet visuel de base pour ne pas sortir de l'écran
    const nextOffset = Math.max(-150, Math.min(150, diffX));
    swipeOffsetRef.current = nextOffset;
    setSwipeOffset(nextOffset);
  };

  const handleTouchEnd = () => {
    if (isSubmitted || touchStartRef.current === null) return;

    if (swipeOffsetRef.current > 80) {
      // Swipe Right -> VRAI
      handleSubmit(true);
    } else if (swipeOffsetRef.current < -80) {
      // Swipe Left -> FAUX
      handleSubmit(false);
    } else {
      // Pas assez de swipe, on remet au centre
      setSwipeOffset(0);
      swipeOffsetRef.current = 0;
    }

    touchStartRef.current = null;
  };

  // Cadre spécifique pour les opinions multiples
  const isMultipleOpinions = activity.halakha_status === 'multiple_opinions';
  const isConditional = activity.halakha_status === 'conditional';

  return (
    <div data-testid="swipe-game" className="flex flex-col h-full w-full max-w-xl mx-auto animate-fade-in pb-4 overflow-hidden">

      {/* Zone d'en-tête (opinions et conditions) */}
      <div className="space-y-4 px-2">
        {isMultipleOpinions && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-3 rounded-r-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1">
              Selon l'opinion mentionnée :
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

        <div className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
          Vrai ou Faux
        </div>
      </div>

      {/* Zone Centrale (Carte d'affirmation) */}
      <div className="flex-1 flex flex-col justify-center items-center mt-6 px-4 relative min-h-[250px]">
        {/* Indicateurs de fond (apparaissent quand on swipe) */}
        {!isSubmitted && (
          <>
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-2xl transition-opacity duration-200 ${swipeOffset < -20 ? 'opacity-100' : 'opacity-0'}`}>
              FAUX
            </div>
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-2xl transition-opacity duration-200 ${swipeOffset > 20 ? 'opacity-100' : 'opacity-0'}`}>
              VRAI
            </div>
          </>
        )}

        <div
          data-testid="swipe-card"
          className={`w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border-2 transition-all flex items-center justify-center min-h-[200px] select-none touch-pan-y
            ${isSubmitted ?
                (selectedOption === true
                  ? (isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-emerald-500/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-red-500/20')
                  : selectedOption === false
                    ? (isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-emerald-500/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-red-500/20')
                    : 'border-zinc-200 dark:border-zinc-800')
              : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-grab active:cursor-grabbing z-10'
            }`}
          style={{
            transform: !isSubmitted ? `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.05}deg)` : 'none',
            transition: swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 leading-relaxed text-center pointer-events-none">
            {activity.statement}
          </h3>
        </div>
      </div>

      {/* Boutons (pour desktop ou ceux qui ne veulent pas swiper) */}
      {!isSubmitted && (
        <div className="flex gap-4 px-4 mt-8 justify-center">
          <button
            onClick={() => handleSubmit(false)}
            className="flex-1 py-4 rounded-2xl font-black text-lg text-red-600 bg-red-50 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40 transition-all active:scale-95"
          >
            FAUX
          </button>
          <button
            onClick={() => handleSubmit(true)}
            className="flex-1 py-4 rounded-2xl font-black text-lg text-emerald-600 bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-all active:scale-95"
          >
            VRAI
          </button>
        </div>
      )}

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

            {!isCorrect && (
              <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
                L'affirmation était : <span className="text-emerald-600 dark:text-emerald-400">{activity.is_true ? "VRAIE" : "FAUSSE"}</span>
              </div>
            )}

            {/* Explication stricte tirée du JSON */}
            {activity.explanation && (
              <p className="text-sm leading-relaxed font-medium text-zinc-700 dark:text-zinc-300">
                {activity.explanation}
              </p>
            )}
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

export default SwipeGame;
