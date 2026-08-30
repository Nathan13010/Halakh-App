import React, { useState } from 'react';
import Icon from './Icon';

const ProfileScreen = ({
  streak = 0,
  xp = 0,
  favoritesCount = 0,
  bookmarksCount = 0,
  theme,
  setTheme,
  textSize,
  setTextSize,
  hebrewFont,
  setHebrewFont,
  frenchFont,
  setFrenchFont,
  hebrewFontsList = [],
  frenchFontsList = [],
  onReset
}) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [previewClickedWord, setPreviewClickedWord] = useState(null);

  const selectedHebrew = hebrewFontsList.find(f => f.id === hebrewFont) || hebrewFontsList[0] || { name: 'Noto Serif Hebrew', family: "'Noto Serif Hebrew', serif" };
  const selectedFrench = frenchFontsList.find(f => f.id === frenchFont) || frenchFontsList[0] || { name: 'Inter', family: "'Inter', sans-serif" };

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
    <div className="min-h-[calc(100vh-8rem)] text-zinc-900 dark:text-[#E4E4E7] flex flex-col py-6 px-4 md:px-8 max-w-4xl mx-auto w-full font-sans space-y-6 pb-24">
      
      {/* 👤 Profile Header & Stats */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-600 border-2 border-amber-300 shadow-lg shadow-amber-500/20 flex items-center justify-center text-4xl shrink-0">
          🦁
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Compte Étudiant
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                Mon Profil & Réglages
              </h2>
            </div>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              Yalkout Yossef Édition Bilingue
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 text-center">
              <span className="text-base">🔥</span>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400">{streak} Jours</div>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold">Série active</span>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 text-center">
              <span className="text-base">⚡</span>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400">{xp} XP</div>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold">Points d'étude</span>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 text-center">
              <span className="text-base">⭐</span>
              <div className="text-lg font-black text-zinc-800 dark:text-zinc-200">{favoritesCount}</div>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold">Favoris</span>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 text-center">
              <span className="text-base">🔖</span>
              <div className="text-lg font-black text-zinc-800 dark:text-zinc-200">{bookmarksCount}</div>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold">Repères</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 ÉCRAN DE PRÉVISUALISATION EN DIRECT */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Aperçu des Polices en Direct
          </span>
          <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
            {selectedHebrew.name} • {selectedFrench.name}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-2 border-amber-500/30 shadow-inner space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">
                Seïf 2
              </span>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                L'empressement pour les Mitsvot
              </span>
            </div>
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold">Siman 318</span>
          </div>

          {/* Hebrew Live Sample */}
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

          {/* French Live Sample */}
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
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <span>✡ Police Hébreu (עברית)</span>
          </h3>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            {selectedHebrew.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {hebrewFontsList.map((f) => {
            const isSelected = f.id === hebrewFont;
            return (
              <button
                key={f.id}
                onClick={() => setHebrewFont && setHebrewFont(f.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-sm ring-1 ring-amber-500/30'
                    : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {f.name}
                  </span>
                  {isSelected && <span className="text-amber-500 text-xs font-bold">✓</span>}
                </div>
                
                <div 
                  className="text-right text-lg text-zinc-900 dark:text-zinc-100 leading-none pt-1 truncate select-none" 
                  dir="rtl"
                  style={{ fontFamily: f.family }}
                >
                  שַׁבָּת שָׁלוֹם
                </div>

                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate">
                  {f.style}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🇫🇷 CHOIX DE LA POLICE FRANÇAISE */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <span>📖 Police Français</span>
          </h3>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            {selectedFrench.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {frenchFontsList.map((f) => {
            const isSelected = f.id === frenchFont;
            return (
              <button
                key={f.id}
                onClick={() => setFrenchFont && setFrenchFont(f.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-sm ring-1 ring-amber-500/30'
                    : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {f.name}
                  </span>
                  {isSelected && <span className="text-amber-500 text-xs font-bold">✓</span>}
                </div>

                <div 
                  className="text-left text-sm text-zinc-900 dark:text-zinc-100 leading-tight pt-1 truncate select-none"
                  style={{ fontFamily: f.family }}
                >
                  Yalkout Yossef
                </div>

                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate">
                  {f.style}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ☀️ / 🌙 APPARENCE (THÈME) & TAILLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Apparence */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Apparence</h3>
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
              {theme === 'system' ? 'Synchro iPhone 📱' : theme === 'light' ? 'Mode Clair ☀️' : 'Mode Sombre 🌙'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 bg-zinc-100 dark:bg-zinc-800/70 rounded-2xl p-1.5 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setTheme('system')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
              className={`flex items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
              className={`flex items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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

        {/* Taille du Texte */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Taille du Texte (Lecteur)</h3>
          <div className="flex bg-zinc-100 dark:bg-zinc-800/70 rounded-2xl p-1.5 border border-zinc-200 dark:border-zinc-700">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => setTextSize(size)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
      </div>

      {/* ⚠️ AIDE & SIGNALEMENT */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Aide & Contact</h3>
        {!reportOpen ? (
          <button 
            onClick={() => setReportOpen(true)}
            className="w-full flex items-center gap-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors text-left cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <span>Signaler une coquille ou une erreur de traduction</span>
          </button>
        ) : (
          <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 space-y-3">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Une erreur de traduction ou un bug technique ? Décrivez-le ci-dessous.
            </p>
            <textarea 
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Ex: Au Siman 318 Seif 1, le mot '...' est mal traduit."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-amber-500 transition-colors h-24 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={() => setReportOpen(false)} className="flex-1 py-2.5 rounded-xl text-xs font-medium text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                Annuler
              </button>
              <button onClick={handleSendReport} disabled={reportText.trim().length === 0} className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white transition-colors cursor-pointer">
                {reportSent ? "Envoyé !" : "Envoyer"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🛑 ZONE DANGER */}
      <div className="bg-white dark:bg-zinc-900 border border-red-500/20 rounded-3xl p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-red-500">Zone de Réinitialisation</h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Remettre à zéro votre apprentissage, votre série de jours d'étude (Streak) et vos points d'XP.
        </p>
        <button 
          onClick={onReset}
          className="w-full py-3 rounded-2xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
        >
          Réinitialiser ma progression (Apprentissage, Streak & XP)
        </button>
      </div>

      <p className="text-center text-[10px] text-zinc-600 dark:text-zinc-400 pt-2">
        Halakh'App v2.0 • Yalkout Yossef Édition Bilingue
      </p>

    </div>
  );
};

export default ProfileScreen;
