import React, { useState } from 'react';
import Icon from './Icon';

const SettingsModal = ({ theme, setTheme, textSize, setTextSize, onClose, onReset }) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const handleSendReport = () => {
    if (reportText.trim().length === 0) return;
    setReportSent(true);
    setTimeout(() => {
      setReportOpen(false);
      setReportSent(false);
      setReportText("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-serif font-bold text-lg dark:text-zinc-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Réglages
          </h2>
          <button onClick={onClose} className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors">
            <Icon name="close" className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-6">
          {/* Theme */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">Apparence</h3>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${theme === 'light' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                Clair
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${theme === 'dark' ? 'bg-zinc-900 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                Sombre
              </button>
            </div>
          </div>

          {/* Text Size */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">Taille du Texte (Lecteur)</h3>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              {['small', 'medium', 'large'].map((size, idx) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${textSize === size ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
                >
                  {size === 'small' ? 'Petit' : size === 'medium' ? 'Moyen' : 'Grand'}
                </button>
              ))}
            </div>
          </div>

          {/* Report Error */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">Aide & Contact</h3>
            {!reportOpen ? (
              <button 
                onClick={() => setReportOpen(true)}
                className="w-full flex items-center gap-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm text-zinc-700 dark:text-zinc-300 transition-colors text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                Signaler une erreur dans le texte
              </button>
            ) : (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 space-y-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Une erreur de traduction ou un bug technique ? Décrivez-le ci-dessous.
                </p>
                <textarea 
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Ex: Au Siman 318 Seif 1, le mot '...' est mal traduit."
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-amber-500 transition-colors h-24 resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setReportOpen(false)} className="flex-1 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    Annuler
                  </button>
                  <button onClick={handleSendReport} disabled={reportText.trim().length === 0} className="flex-1 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white transition-colors">
                    {reportSent ? "Envoyé !" : "Envoyer"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button 
              onClick={onReset}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
            >
              Réinitialiser ma progression (Streak & XP)
            </button>
          </div>
          
          <p className="text-center text-[10px] text-zinc-400 pt-2">
            Halakh'App v2.0 • Halakha Learning
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
