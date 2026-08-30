import React from "react";

const SourceReferenceModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-zinc-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Référence française : ${item.title}`}
      data-testid="source-reference-modal"
    >
      <section className="w-full max-w-3xl max-h-[94vh] sm:max-h-[88vh] overflow-hidden flex flex-col rounded-t-[2rem] sm:rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <header className="shrink-0 px-5 sm:px-7 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl shrink-0 bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-xl">📜</div>
          <div className="min-w-0 flex-1">
            <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">Loi source en français</span>
            <h2 className="mt-1 font-serif text-xl font-black leading-tight">{item.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la référence"
            className="w-9 h-9 rounded-full shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-black"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 sm:px-7 py-6">
          <p className="rounded-2xl bg-blue-50 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-900 p-4 text-sm leading-relaxed text-blue-950 dark:text-blue-100">
            Voici le texte français complet dont cette notion est issue. Il permet de lire le contexte, les détails et les éventuelles exceptions.
          </p>

          <div className="mt-5 space-y-5">
            {item.references.map((reference) => (
              <article key={`${reference.siman}-${reference.paragraph}`} className="rounded-3xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6">
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
                  Siman {reference.siman} · Paragraphe {reference.paragraph}
                </span>
                <h3 className="mt-2 font-serif text-lg font-black">{reference.title}</h3>
                <p className="mt-4 whitespace-pre-line text-sm sm:text-base leading-7 text-zinc-700 dark:text-zinc-300">
                  {reference.french}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SourceReferenceModal;
