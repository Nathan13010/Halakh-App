import React from 'react';

const LearningCard = ({ activity }) => {
  const statusLabels = {
    conditional: 'Règle conditionnelle',
    multiple_opinions: 'Divergence d\'opinions',
    unclassified: 'Pilote source à revoir'
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
        Fiche d'Apprentissage
      </div>

      <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
        {activity.title}
      </h3>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-xl">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 leading-relaxed">
          {activity.rule}
        </p>
      </div>

      {activity.explanation && (
        <div className="space-y-2 mt-4">
          <h4 className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">Explication</h4>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {activity.explanation}
          </p>
        </div>
      )}

      {activity.practical_example && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl mt-4">
          <h4 className="text-xs font-bold uppercase text-amber-700 dark:text-amber-500 mb-1">Exemple Pratique</h4>
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            {activity.practical_example}
          </p>
        </div>
      )}

      {activity.halakha_status && activity.halakha_status !== 'clear' && (
        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">
          <span className="text-base">⚠️</span>
          {statusLabels[activity.halakha_status] || `Statut : ${activity.halakha_status}`}
        </div>
      )}
    </div>
  );
};

export default LearningCard;
