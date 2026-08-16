import React, { useState } from 'react';
import Icon from './Icon';

const DEFAULT_HEBREW_FONTS = [
  { id: 'noto-serif-hebrew', name: 'Noto Serif Hebrew', family: "'Noto Serif Hebrew', serif", style: 'Traditionnel • Torah' },
  { id: 'frank-ruhl', name: 'Frank Ruhl Libre', family: "'Frank Ruhl Libre', serif", style: 'Classique Rabbinique' },
  { id: 'david-libre', name: 'David Libre', family: "'David Libre', serif", style: 'Élégant • Sidour' },
  { id: 'alef', name: 'Alef', family: "'Alef', sans-serif", style: 'Moderne & Doux' },
  { id: 'rubik', name: 'Rubik', family: "'Rubik', sans-serif", style: 'Arrondi & Fluide' },
  { id: 'heebo', name: 'Heebo', family: "'Heebo', sans-serif", style: 'Sans-Serif Épuré' },
];

const DEFAULT_FRENCH_FONTS = [
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", style: 'Moderne & Net' },
  { id: 'lora', name: 'Lora', family: "'Lora', serif", style: 'Littéraire & Roman' },
  { id: 'merriweather', name: 'Merriweather', family: "'Merriweather', serif", style: 'Éditorial Confort' },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif", style: 'Prestige & Titres' },
  { id: 'outfit', name: 'Outfit', family: "'Outfit', sans-serif", style: 'Géométrique Aéré' },
];

const SettingsModal = ({ 
  theme, 
  setTheme, 
  textSize, 
  setTextSize, 
  hebrewFont = 'noto-serif-hebrew',
  setHebrewFont,
  frenchFont = 'inter',
  setFrenchFont,
  hebrewFontsList = DEFAULT_HEBREW_FONTS,
  frenchFontsList = DEFAULT_FRENCH_FONTS,
  onClose, 
  onReset 
}) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [previewClickedWord, setPreviewClickedWord] = useState(null);

  const selectedHebrew = hebrewFontsList.find(f => f.id === hebrewFont) || hebrewFontsList[0];
  const selectedFrench = frenchFontsList.find(f => f.id === frenchFont) || frenchFontsList[0];

  const handleSendReport = () => {
    if (reportText.trim().length === 0) return;
    setReportSent(true);
    setTimeout(() => {
      setReportOpen(false);
      setReportSent(false);
      setReportText("");
    }, 2000);
  };

  const previewFontSize = textSize === 'small' ? 16 : textSize === 'large' ? 22 : 19;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md shrink-0">
          <h2 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>Réglages & Typographie</span>
          </h2>
          <button onClick={onClose} className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors cursor-pointer">
            <Icon name="close" className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* 🌟 ÉCRAN DE PRÉVISUALISATION EN DIRECT */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Aperçu du Rendu en Direct
              </span>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">
                {selectedHebrew.name} • {selectedFrench.name}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border-2 border-amber-500/30 shadow-inner space-y-3 relative overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">
                    Seïf 2
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">
                    L'empressement pour les Mitsvot
                  </span>
                </div>
                <span className="text-[9px] text-zinc-500 dark:text-zinc-400 uppercase font-bold">Siman 318</span>
              </div>

              {/* Hebrew Sample with live font family */}
              <div 
                className="text-right leading-relaxed text-zinc-900 dark:text-zinc-100 select-none transition-all duration-300 pt-1" 
                dir="rtl"
                style={{ 
                  fontFamily: selectedHebrew.family, 
                  fontSize: `${previewFontSize + 2}px` 
                }}
              >
                {['ב.', 'צָרִיךְ', 'הָאָדָם', 'שֶׁיִּהְיֶה', 'אֶצְלוֹ', 'בְּטֶבַע', 'וְהֶרְגֵּל', 'תָּמִיד', 'לָרוּץ', 'לִדְבַר', 'מִצְוָה.'].map((mot, i) => {
                  const isWordActive = previewClickedWord === i;
                  return (
                    <span
                      key={i}
                      onClick={() => setPreviewClickedWord(isWordActive ? null : i)}
                      className={`inline-block px-1 py-0.5 mx-0.5 rounded cursor-pointer transition-colors border-b-2 ${
                        isWordActive 
                          ? 'text-amber-600 dark:text-amber-500 bg-amber-500/20 border-amber-500 font-bold scale-105' 
                          : 'hover:bg-amber-500/10 border-transparent'
                      }`}
                    >
                      {mot}
                    </span>
                  );
                })}
              </div>

              {/* French Sample with live font family */}
              <div 
                className="text-left leading-relaxed text-zinc-700 dark:text-zinc-300 italic pt-2 border-t border-zinc-200 dark:border-zinc-800/80 transition-all duration-300"
                style={{ 
                  fontFamily: selectedFrench.family, 
                  fontSize: `${previewFontSize - 3}px` 
                }}
              >
                « L'homme doit s'efforcer d'adopter pour habitude naturelle de courir pour accomplir une mitsva avec ferveur et promptitude. »
              </div>
            </div>
          </div>

          {/* 📜 CHOIX DE LA POLICE HÉBRAÏQUE */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <span>✡ Police Hébreu (עברית)</span>
              </h3>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                {selectedHebrew.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hebrewFontsList.map((f) => {
                const isSelected = f.id === hebrewFont;
                return (
                  <button
                    key={f.id}
                    onClick={() => setHebrewFont && setHebrewFont(f.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-sm ring-1 ring-amber-500/30'
                        : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {f.name}
                      </span>
                      {isSelected && <span className="text-amber-500 text-xs font-bold">✓</span>}
                    </div>
                    
                    {/* Live Hebrew sample snippet in that specific font */}
                    <div 
                      className="text-right text-base text-zinc-900 dark:text-zinc-100 leading-none pt-0.5 truncate select-none" 
                      dir="rtl"
                      style={{ fontFamily: f.family }}
                    >
                      שַׁבָּת שָׁלוֹם
                    </div>

                    <span className="text-[9px] text-zinc-600 dark:text-zinc-400 truncate">
                      {f.style}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🇫🇷 CHOIX DE LA POLICE FRANÇAISE */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <span>📖 Police Français</span>
              </h3>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                {selectedFrench.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {frenchFontsList.map((f) => {
                const isSelected = f.id === frenchFont;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFrenchFont && setFrenchFont(f.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-sm ring-1 ring-amber-500/30'
                        : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {f.name}
                      </span>
                      {isSelected && <span className="text-amber-500 text-xs font-bold">✓</span>}
                    </div>

                    {/* Live French sample snippet in that specific font */}
                    <div 
                      className="text-left text-xs text-zinc-900 dark:text-zinc-100 leading-tight pt-0.5 truncate select-none"
                      style={{ fontFamily: f.family }}
                    >
                      Yalkout Yossef
                    </div>

                    <span className="text-[9px] text-zinc-600 dark:text-zinc-400 truncate">
                      {f.style}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ☀️ / 🌙 THEME */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Apparence</h3>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
                {theme === 'system' ? 'Synchro iPhone 📱' : theme === 'light' ? 'Mode Clair ☀️' : 'Mode Sombre 🌙'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-zinc-100 dark:bg-zinc-800/70 rounded-xl p-1.5 border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'system' 
                    ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                <span>Auto</span>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'light' 
                    ? 'bg-white text-amber-600 shadow-sm border border-zinc-200 font-bold' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                <span>Clair</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-zinc-900 text-amber-400 shadow-sm border border-zinc-700 font-bold' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                <span>Sombre</span>
              </button>
            </div>
          </div>

          {/* 🔍 TAILLE DU TEXTE */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Taille du Texte</h3>
            <div className="flex bg-zinc-100 dark:bg-zinc-800/70 rounded-xl p-1.5 border border-zinc-200 dark:border-zinc-700">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    textSize === size 
                      ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm border border-zinc-200 dark:border-zinc-700 font-bold' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {size === 'small' ? 'Petit (16px)' : size === 'medium' ? 'Moyen (19px)' : 'Grand (22px)'}
                </button>
              ))}
            </div>
          </div>

          {/* ⚠️ AIDE & SIGNALEMENT */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Aide & Contact</h3>
            {!reportOpen ? (
              <button 
                onClick={() => setReportOpen(true)}
                className="w-full flex items-center gap-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors text-left cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                Signaler une coquille ou une erreur de traduction
              </button>
            ) : (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 space-y-3">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Une erreur de traduction ou un bug ? Décrivez-le ci-dessous.
                </p>
                <textarea 
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Ex: Au Siman 318 Seif 1, le mot '...' est mal traduit."
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-amber-500 transition-colors h-20 resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setReportOpen(false)} className="flex-1 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    Annuler
                  </button>
                  <button onClick={handleSendReport} disabled={reportText.trim().length === 0} className="flex-1 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white transition-colors">
                    {reportSent ? "Envoyé !" : "Envoyer"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 🛑 ZONE DANGER */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <button 
              onClick={onReset}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              Réinitialiser ma progression (Streak & XP)
            </button>
          </div>
          
          <p className="text-center text-[10px] text-zinc-600 dark:text-zinc-400 pt-1">
            Halakh'App v2.0 • Yalkout Yossef Édition Bilingue
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
