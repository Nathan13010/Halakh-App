import React from 'react';
import Icon from './Icon';

const QuickSettingsPopover = ({
  isOpen,
  onClose,
  readingMode,
  setReadingMode,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  onOpenFullSettings
}) => {
  if (!isOpen) return null;

  const readingModes = [
    { id: 4, label: 'A', title: 'Français' },
    { id: 3, label: 'Aא', title: 'Bilingue' },
    { id: 1, label: 'א', title: 'Hébreu' },
    { id: 2, label: 'אַ', title: 'Nikoud' },
  ];

  return (
    <>
      {/* Invisible backdrop to capture outside clicks reliably on mobile & desktop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] animate-fade-in"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div 
        className="fixed right-3 sm:right-6 top-16 z-50 w-[310px] sm:w-[360px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-5 text-zinc-900 dark:text-zinc-100 animate-scale-up select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4">
          <span className="font-serif font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <span className="text-amber-500 font-bold text-base">Aa</span>
            <span>Options d'Affichage</span>
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* 1. Language / Mode de lecture (Style Sefaria à 4 choix) */}
          <div>
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-2 text-center">
              Language
            </label>
            <div className="grid grid-cols-4 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              {readingModes.map((m) => {
                const isActive = readingMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setReadingMode(m.id)}
                    className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isActive
                        ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold scale-[1.03]'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
                    }`}
                  >
                    <span className={`text-base leading-none font-serif ${m.id === 2 ? 'font-bold' : ''}`}>
                      {m.label}
                    </span>
                    <span className="text-[9px] mt-1 opacity-75 truncate max-w-full font-sans font-normal">
                      {m.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Color & Font Size in a 2-column grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Color (Style Sefaria Swatches) */}
            <div>
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-2 text-center">
                Color
              </label>
              <div className="flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 h-[48px]">
                {/* Light swatch */}
                <button
                  onClick={() => setTheme('light')}
                  title="Mode Clair"
                  className={`w-10 h-8 rounded-xl bg-white border-2 transition-all cursor-pointer flex items-center justify-center shadow-sm ${
                    theme === 'light' 
                      ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105' 
                      : 'border-zinc-300 hover:border-zinc-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  {theme === 'light' && <span className="text-amber-600 text-xs font-bold">✓</span>}
                </button>

                {/* Dark swatch */}
                <button
                  onClick={() => setTheme('dark')}
                  title="Mode Sombre"
                  className={`w-10 h-8 rounded-xl bg-zinc-900 border-2 transition-all cursor-pointer flex items-center justify-center shadow-sm ${
                    theme === 'dark' 
                      ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105' 
                      : 'border-zinc-700 hover:border-zinc-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  {theme === 'dark' && <span className="text-amber-400 text-xs font-bold">✓</span>}
                </button>

                {/* Auto swatch */}
                <button
                  onClick={() => setTheme('system')}
                  title="Auto (iPhone)"
                  className={`w-10 h-8 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-800 border-2 transition-all cursor-pointer flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                    theme === 'system' 
                      ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105 text-amber-300' 
                      : 'border-zinc-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  📱
                </button>
              </div>
            </div>

            {/* Font Size (Style Sefaria A / A buttons) */}
            <div>
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-2 text-center">
                Font Size
              </label>
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 h-[48px]">
                <button
                  onClick={() => setFontSize(p => Math.max(14, p - 2))}
                  className="flex-1 h-full rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 transition-all cursor-pointer active:scale-95"
                  title="Diminuer la police"
                >
                  <span className="font-serif text-sm">A</span>
                </button>
                <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700" />
                <button
                  onClick={() => setFontSize(p => Math.min(28, p + 2))}
                  className="flex-1 h-full rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 transition-all cursor-pointer active:scale-95"
                  title="Agrandir la police"
                >
                  <span className="font-serif text-lg font-bold">A</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Link to Full Settings */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => {
                onClose();
                if (onOpenFullSettings) onOpenFullSettings();
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                <span>Polices Hébreu & Français (Aperçu)</span>
              </div>
              <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform font-bold">➔</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickSettingsPopover;
