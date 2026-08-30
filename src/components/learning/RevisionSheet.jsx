import React, { useMemo, useState } from "react";
import { LEARNING_CATEGORY } from "../../services/learningPathModel.js";
import SourceReferenceModal from "./SourceReferenceModal.jsx";

const RevisionSheet = ({ curricula, onBack }) => {
  const [selectedSimanId, setSelectedSimanId] = useState(LEARNING_CATEGORY.simanIds[0]);
  const [query, setQuery] = useState("");
  const [referenceItem, setReferenceItem] = useState(null);
  const curriculum = curricula[selectedSimanId];
  const items = useMemo(() => curriculum.lessons.flatMap((lesson) => lesson.items).filter((item) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return !normalizedQuery || `${item.title} ${item.coreText}`.toLocaleLowerCase("fr").includes(normalizedQuery);
  }), [curriculum, query]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8" data-testid="revision-sheet">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-emerald-600">← Retour au parcours</button>
        <button type="button" onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-xs font-black">Imprimer la fiche</button>
      </div>

      <section className="mt-5 rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-8 shadow-xl">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Fiche de révision obtenue</span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-serif font-black">{LEARNING_CATEGORY.title}</h1>
        <p className="mt-3 text-sm text-emerald-50/90">Toutes les notions apprises, réunies sans avoir à retourner dans le texte intégral.</p>
      </section>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Choisir le Siman à réviser">
        {LEARNING_CATEGORY.simanIds.map((simanId) => {
          const siman = curricula[simanId];
          return (
            <button
              type="button"
              key={simanId}
              aria-pressed={selectedSimanId === simanId}
              onClick={() => setSelectedSimanId(simanId)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-black border ${
                selectedSimanId === simanId
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              }`}
            >
              Siman {siman.simanNumber}
            </button>
          );
        })}
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher une notion…"
        className="mt-3 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-emerald-500"
      />

      <div className="mt-6">
        <h2 className="text-xl font-serif font-black">Siman {curriculum.simanNumber} · {curriculum.title}</h2>
        <p className="mt-1 text-xs text-zinc-500">{items.length} notion{items.length > 1 ? "s" : ""}</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm break-inside-avoid">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Paragraphe {item.sourceParagraph}</span>
            <h3 className="mt-1.5 font-serif font-black text-base">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{item.coreText}</p>
            {item.explanation && <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-blue-700 dark:text-blue-300">{item.explanation}</p>}
            {item.references.length > 0 && (
              <button
                type="button"
                onClick={() => setReferenceItem(item)}
                className="mt-4 w-full rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/25 px-3 py-2.5 text-xs font-black text-amber-900 dark:text-amber-200"
              >
                📜 Voir la loi source en français
              </button>
            )}
          </article>
        ))}
      </div>

      {referenceItem && <SourceReferenceModal item={referenceItem} onClose={() => setReferenceItem(null)} />}
    </div>
  );
};

export default RevisionSheet;
