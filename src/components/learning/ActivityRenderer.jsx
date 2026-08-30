import React from 'react';
import Icon from '../Icon';
import LearningCard from '../LearningCard';
import ClassicQuiz from './minigames/ClassicQuiz';
import SwipeGame from './minigames/SwipeGame';
import ScenarioGame from './minigames/ScenarioGame';

/**
 * ActivityRenderer.jsx
 *
 * Routeur de présentation pour les activités d'apprentissage.
 * Gère l'enveloppe UI (Modale, Barre de progression) et délègue le contenu
 * au mini-jeu approprié selon le type de l'activité.
 */
const ActivityRenderer = ({
  activity,
  feedback, // Peut-être ignoré par les nouveaux mini-jeux qui gèrent leur feedback
  onSubmit, // <=> session.submitAnswer
  onNext,   // <=> session.nextActivity
  progress,
  onClose,
  currentIndex,
  totalActivities
}) => {

  // Pour les nouveaux mini-jeux qui gèrent eux-mêmes leurs étapes (Question -> Feedback -> Continuer),
  // l'action de "Terminer le jeu" équivaut à soumettre la réponse ET passer au suivant.
  const handleMiniGameSubmit = (isCorrect) => {
    const submission = onSubmit(isCorrect);
    onNext(submission);
  };

  // Ancien fallback pour Flashcard (en attendant DiscoveryCard)
  const renderLegacyCard = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <LearningCard activity={activity} />
        </div>
        <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
          <button
            onClick={() => handleMiniGameSubmit(true)}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 scale-[1.01] active:scale-95"
          >
            J'ai compris
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!activity) return null;

    switch (activity.type) {
      case 'multiple_choice':
      case 'quiz': // Pour la compatibilité si rawType est quiz
        return <ClassicQuiz key={activity.id} activity={activity} onSubmit={handleMiniGameSubmit} />;

      case 'true_false':
        return <SwipeGame key={activity.id} activity={activity} onSubmit={handleMiniGameSubmit} />;

      case 'practical_situation':
        return <ScenarioGame key={activity.id} activity={activity} onSubmit={handleMiniGameSubmit} />;

      case 'card':
      case 'flashcard':
        // En attendant DiscoveryCard, on réutilise l'ancien design
        return renderLegacyCard();

      default:
        // Fallback propre pour les types non encore implémentés
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
            <div className="text-4xl">🚧</div>
            <h3 className="text-lg font-bold">Type d'activité non disponible</h3>
            <p className="text-sm text-zinc-500">
              Le mini-jeu pour le type <code>{activity.type}</code> est en cours de développement.
            </p>
            <button
              onClick={() => handleMiniGameSubmit(true)}
              className="mt-4 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 rounded-xl font-medium"
            >
              Passer cette activité
            </button>
          </div>
        );
    }
  };

  return (
    <div
      data-testid="activity-renderer"
      data-activity-id={activity?.activity_id}
      data-instance-id={activity?.id}
      data-raw-type={activity?.rawType}
      data-ui-type={activity?.type}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh]">

        {/* En-tête de progression */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 shrink-0">
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
            aria-label="Fermer la session"
            className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu de l'activité (Routeur) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col">
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default ActivityRenderer;
