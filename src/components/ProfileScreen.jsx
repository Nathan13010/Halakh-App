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
  onReset,
  currentUser = null,
  syncCode = "",
  isSyncing = false,
  lastSyncTime = null,
  onLoginGoogle,
  onLogout,
  onGenerateSyncCode,
  onRestoreSyncCode,
  onDisconnectSyncCode
}) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [previewClickedWord, setPreviewClickedWord] = useState(null);

  // Option B (Code Secret) states
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

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
        {currentUser?.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt={currentUser.displayName || "Avatar"} 
            className="w-20 h-20 rounded-3xl object-cover border-2 border-amber-300 shadow-lg shadow-amber-500/20 shrink-0" 
          />
        ) : (
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-600 border-2 border-amber-300 shadow-lg shadow-amber-500/20 flex items-center justify-center text-4xl shrink-0">
            🦁
          </div>
        )}

        <div className="flex-1 text-center sm:text-left space-y-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              {currentUser ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isSyncing ? "Synchronisation..." : "Compte Google Synchronisé"}
                </span>
              ) : syncCode ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isSyncing ? "Synchronisation..." : "Sauvegardé via Code Secret"}
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Compte Local (Invité)
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {currentUser?.displayName || (syncCode ? "Profil Synchronisé (Code)" : "Mon Profil & Réglages")}
              </h2>
              {currentUser?.email ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  {currentUser.email}
                </p>
              ) : syncCode ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium font-mono">
                  Code actif : {syncCode}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2 justify-center sm:justify-end">
              {currentUser ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold transition"
                >
                  Se déconnecter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onLoginGoogle}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Connexion Google
                </button>
              )}
            </div>
          </div>

          {/* Si déconnecté de Google : Affichage du Code Actif OU Options de Sauvegarde (Google & Code Secret) */}
          {!currentUser && (
            <div className="mt-4 space-y-3">
              {syncCode ? (
                /* Carte Code Secret Actif */
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3 text-left">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xl shrink-0">
                        🔑
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Votre Code Secret de Sauvegarde</div>
                        <div className="text-[11px] text-zinc-600 dark:text-zinc-400">Conservez ce code pour restaurer vos leçons et XP sur un autre appareil.</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-700 font-mono font-bold text-sm tracking-wider text-emerald-700 dark:text-emerald-300 select-all">
                        {syncCode}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(syncCode);
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shrink-0"
                      >
                        {copiedCode ? "✓ Copié" : "📋 Copier"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200/50 dark:border-emerald-900/40 text-[11px]">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Sauvegarde Cloud active en arrière-plan
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsRestoreModalOpen(true)}
                        className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline font-semibold"
                      >
                        Changer de code
                      </button>
                      <span className="text-zinc-300 dark:text-zinc-750">•</span>
                      <button
                        type="button"
                        onClick={onDisconnectSyncCode}
                        className="text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition font-medium"
                      >
                        Dissocier
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Carte Choix des 2 Options */
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-amber-50/40 dark:from-blue-950/20 dark:to-amber-950/10 border border-blue-200/60 dark:border-blue-900/40 space-y-3.5 text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0">☁️</span>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Sauvegardez votre progression</div>
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400">Choisissez votre méthode de synchronisation préférée :</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* Option A : Google */}
                    <button
                      type="button"
                      onClick={onLoginGoogle}
                      className="p-3 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-800 transition shadow-sm flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition">Option A • Google</div>
                          <div className="text-[10px] text-zinc-500">1-clic avec votre compte</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Lier →</span>
                    </button>

                    {/* Option B : Code Secret Anonyme */}
                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between gap-2 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Option B • Sans compte</div>
                          <div className="text-[10px] text-zinc-500">Code secret anonyme</div>
                        </div>
                        <span className="text-base">🔑</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={async () => {
                            setIsActionLoading(true);
                            try {
                              await onGenerateSyncCode();
                            } finally {
                              setIsActionLoading(false);
                            }
                          }}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition text-center shadow-xs"
                        >
                          Créer un code
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsRestoreModalOpen(true)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] font-semibold transition"
                        >
                          J'ai un code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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

      {/* 🔑 MODALE DE RESTAURATION VIA CODE SECRET */}
      {isRestoreModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Restaurer un Code Secret
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRestoreModalOpen(false);
                  setEnteredCode("");
                }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Entrez votre code secret de sauvegarde (ex: <span className="font-mono font-bold">HLK-84K-92M</span>) pour récupérer votre progression sur cet appareil.
            </p>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Code de sauvegarde
              </label>
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                placeholder="HLK-XXX-XXX"
                className="w-full uppercase font-mono tracking-widest text-center text-sm py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRestoreModalOpen(false);
                  setEnteredCode("");
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isActionLoading || enteredCode.trim().length < 5}
                onClick={async () => {
                  setIsActionLoading(true);
                  try {
                    const success = await onRestoreSyncCode(enteredCode);
                    if (success) {
                      setIsRestoreModalOpen(false);
                      setEnteredCode("");
                    }
                  } finally {
                    setIsActionLoading(false);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white transition shadow-sm cursor-pointer"
              >
                {isActionLoading ? "Vérification..." : "Restaurer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] text-zinc-600 dark:text-zinc-400 pt-2">
        Halakh'App v2.0 • Yalkout Yossef Édition Bilingue
      </p>

    </div>
  );
};

export default ProfileScreen;
