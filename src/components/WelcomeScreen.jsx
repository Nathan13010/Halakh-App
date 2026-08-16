import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import BookCover from './BookCover';
import ConfettiCanvas from './ConfettiCanvas';

const WelcomeScreen = ({ 
  books, 
  favorites = [], 
  bookmarks = [], 
  onSelectBook, 
  onSelectFavorite, 
  onRemoveFavorite, 
  onSelectBookmark, 
  onRemoveBookmark, 
  streak, 
  onIncreaseStreak, 
  isDailyCompleted,
  onOpenSettings
}) => {
  const [sidebarTab, setSidebarTab] = useState('favorites');
  const [isMinimized, setIsMinimized] = useState(isDailyCompleted);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [quizStatus, setQuizStatus] = useState('idle'); // 'idle' | 'correct' | 'wrong'
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isDailyCompleted) {
      setIsMinimized(true);
    }
  }, [isDailyCompleted]);

  const handleSelectOption = (index) => {
    setSelectedOption(index);
    if (index === 1) {
      // Correct answer!
      setQuizStatus('correct');
      setShowConfetti(true);
      onIncreaseStreak();
      setIsMinimized(true);
    } else {
      // Wrong answer!
      setQuizStatus('wrong');
      setShowConfetti(false);
    }
  };

  const handleResetModal = () => {
    setQuizStatus('idle');
    setSelectedOption(null);
  };

  const handleCloseModal = () => {
    setIsDailyModalOpen(false);
    handleResetModal();
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] text-zinc-900 dark:text-[#E4E4E7] flex flex-col justify-between py-8 px-4 md:px-8 font-sans">
      {showConfetti && <ConfettiCanvas onComplete={() => setShowConfetti(false)} />}

      <header className="max-w-6xl mx-auto w-full mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-3 font-serif">
          Halakh'<span className="text-amber-500">App</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-xs md:text-sm font-light">
          Analyse interactive des textes bilingues hébreu/français.
        </p>
      </header>

      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 flex-grow">
        <div className="lg:col-span-3 space-y-8 flex flex-col">
          
          {/* Halakha du Jour Section */}
          {isMinimized ? (
            /* Minimized Pill View */
            <div 
              onClick={() => setIsMinimized(false)}
              className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-lg border border-emerald-500/30 shrink-0">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Halakha du Jour Complétée
                    </span>
                    <span className="text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                      🔥 {streak} jours
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Le tri pendant Chabbat (Borer) • Cliquez pour revoir la fiche
                  </p>
                </div>
              </div>
              <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-1 shrink-0 ml-2">
                Revoir &rarr;
              </button>
            </div>
          ) : (
            /* Expanded Full Card View */
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 md:p-6 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden transition-all">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="currentColor"><path d="m11.235 22.842-1.921-6.19a.214.214 0 0 0-.135-.135l-6.19-1.921c-.815-.253-.815-1.4 0-1.653l6.19-1.921a.214.214 0 0 0 .135-.135l1.921-6.19c.253-.815 1.4-.815 1.653 0l1.921 6.19a.214.214 0 0 0 .135.135l6.19 1.921c.815.253.815 1.4 0 1.653l-6.19 1.921a.214.214 0 0 0-.135.135l-1.921 6.19c-.253.815-1.4.815-1.653 0Z"/></svg>
              </div>
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    Halakha du Jour • ~30s
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                      <span className="text-white">🔥</span> {streak} jours
                    </span>
                    {isDailyCompleted && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                        className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                        title="Minimiser la carte"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-2">Le tri pendant Chabbat (Borer)</h2>
                  <p className="text-sm text-white/90 leading-relaxed font-medium">
                    Il est permis de trier le "bon" du "mauvais" si c'est pour une consommation immédiate, avec la main et non un ustensile spécial.
                  </p>
                </div>

                <div className="bg-black/10 rounded-xl p-3 mt-1">
                  <div className="flex gap-2 items-start">
                    <Icon name="info" className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span className="text-xs text-white/90">
                      <strong>Conseil Pratique :</strong> Si vous mangez du poisson, retirez le morceau de poisson de l'arête, et non l'arête du poisson.
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => { handleResetModal(); setIsDailyModalOpen(true); }}
                  className="mt-2 w-full py-3 bg-white text-amber-600 rounded-xl font-bold shadow-lg hover:bg-zinc-50 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {isDailyCompleted ? (
                    <>
                      <span>✓ Halakha Déjà Validée • Revoir le Quiz</span>
                    </>
                  ) : (
                    <>
                      <span>Valider & Obtenir mon Streak 🔥</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200 dark:border-zinc-800 mt-4">
            <Icon name="library" className="w-4 h-4 text-amber-500/80" />
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">Votre Bibliothèque</h2>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 font-mono font-bold ml-auto select-none">
              {books.length} LIVRE(S)
            </span>
          </div>

          <div className="space-y-12 py-4">
            <div className="relative pt-6 pb-4 px-6 bg-zinc-100/80 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-inner flex flex-wrap justify-center sm:justify-start gap-8">
              {books.map((book) => (
                <BookCover
                  key={book.id}
                  title={book.title}
                  subtitle={book.subtitle}
                  author={book.author}
                  coverColor={book.coverColor}
                  isUnlocked={book.isUnlocked}
                  onClick={() => book.isUnlocked && onSelectBook(book.id)}
                />
              ))}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-b-2xl border-t border-zinc-300 dark:border-zinc-700 pointer-events-none z-10 shadow-sm" />
            </div>
          </div>

          <div className="bg-zinc-100/80 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mt-auto">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-bold flex items-center gap-1.5 select-none">
                <Icon name="info" className="w-4 h-4 text-amber-500" />
                Comment étudier ?
              </h3>
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>Réglages</span>
                </button>
              )}
            </div>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-amber-500/80">✦</span>
                <span>Sélectionnez un ouvrage débloqué (notamment le volume <strong className="text-zinc-900 dark:text-zinc-200">Yalkout Yossef - Hilkhot Chabbat</strong>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500/80">✦</span>
                <span>Personnalisez l'affichage à tout moment avec le bouton <strong className="text-zinc-900 dark:text-zinc-200">Aa</strong> dans le lecteur (Langue, Nikoud, Thème et Taille).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500/80">✦</span>
                <span>Touchez tout terme pour obtenir sa traduction française exacte accompagnée d'analyses halakhiques contextuelles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500/80">✦</span>
                <span>Sauvegardez vos paragraphes importants pour les retrouver instantanément ici en mode révision.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col h-full">
          {/* Tabs Selector: Favoris / Marque-pages */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl mb-4">
            <button
              onClick={() => setSidebarTab('favorites')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sidebarTab === 'favorites'
                  ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 border border-zinc-200 dark:border-amber-500/40 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Icon name="star" className={`w-3.5 h-3.5 ${sidebarTab === 'favorites' ? 'fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400' : ''}`} />
              <span>Favoris</span>
              <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.2 rounded-full font-mono text-zinc-700 dark:text-zinc-300">
                {favorites.length}
              </span>
            </button>

            <button
              onClick={() => setSidebarTab('bookmarks')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sidebarTab === 'bookmarks'
                  ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 border border-zinc-200 dark:border-amber-500/40 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Icon name="bookmark" className={`w-3.5 h-3.5 ${sidebarTab === 'bookmarks' ? 'fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400' : ''}`} />
              <span>Repères</span>
              <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.2 rounded-full font-mono text-zinc-700 dark:text-zinc-300">
                {bookmarks.length}
              </span>
            </button>
          </div>

          <div className="bg-zinc-100/70 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex-grow flex flex-col justify-start max-h-[460px] lg:max-h-full overflow-y-auto">
            {sidebarTab === 'favorites' ? (
              favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-2 my-auto select-none">
                  <Icon name="star" className="w-6 h-6 text-zinc-400 dark:text-zinc-700 mb-3" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Aucun favori enregistré</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-1 max-w-[180px] leading-relaxed">
                    Cliquez sur l'icône étoile ★ dans le lecteur pour ajouter un paragraphe à vos favoris.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((fav, index) => (
                    <div
                      key={index}
                      onClick={() => onSelectFavorite(fav)}
                      className="p-3 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg group cursor-pointer transition-all duration-200 text-left relative shadow-sm"
                    >
                      <button
                        onClick={(e) => onRemoveFavorite(fav, e)}
                        className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        title="Supprimer des favoris"
                      >
                        <Icon name="trash" className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider block mb-1">
                        {fav.bookTitle} • Seïf {fav.seif || (fav.paragraphIndex + 1)}
                      </span>
                      <p className="text-sm text-zinc-900 dark:text-zinc-200 font-medium line-clamp-1 mb-1 font-hebrew text-right" dir="rtl">
                        {fav.previewHebrew}
                      </p>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 italic leading-relaxed">
                        {fav.previewFrench}
                      </p>
                      <div className="flex justify-end items-center mt-3 pt-1.5 border-t border-zinc-200 dark:border-zinc-800/50 opacity-60 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider flex items-center gap-0.5">
                          Étudier &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-2 my-auto select-none">
                  <Icon name="bookmark" className="w-6 h-6 text-zinc-400 dark:text-zinc-700 mb-3" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Aucun marque-page placé</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-1 max-w-[180px] leading-relaxed">
                    Cliquez sur l'icône marque-page 🔖 sur un Seïf pour y revenir rapidement à tout moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((bm, index) => (
                    <div
                      key={index}
                      onClick={() => onSelectBookmark(bm)}
                      className="p-3 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg group cursor-pointer transition-all duration-200 text-left relative shadow-sm"
                    >
                      <button
                        onClick={(e) => onRemoveBookmark(bm, e)}
                        className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        title="Retirer le marque-page"
                      >
                        <Icon name="trash" className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon name="bookmark" className="w-3 h-3 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 shrink-0" />
                        <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider truncate">
                          {bm.bookTitle} • Seïf {bm.seif || (bm.paragraphIndex + 1)}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-900 dark:text-zinc-200 font-medium line-clamp-1 mb-1 font-hebrew text-right" dir="rtl">
                        {bm.previewHebrew}
                      </p>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 italic leading-relaxed">
                        {bm.previewFrench}
                      </p>
                      <div className="flex justify-end items-center mt-3 pt-1.5 border-t border-zinc-200 dark:border-zinc-800/50 opacity-60 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider flex items-center gap-0.5">
                          Reprendre la lecture &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto w-full text-center border-t border-zinc-200 dark:border-zinc-800 pt-6 text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <span>© 2026 Halakh'App • Yalkout Yossef Interactif</span>
        <span className="text-zinc-500 dark:text-zinc-600">Localisation LocalStorage sécurisée • Étude moderne de la Halakha</span>
      </footer>

      {/* Daily Quiz Modal */}
      {isDailyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden relative border-2 transition-all duration-300 ${
            quizStatus === 'correct' 
              ? 'border-emerald-500 shadow-emerald-500/20' 
              : quizStatus === 'wrong' 
                ? 'border-rose-500 shadow-rose-500/20' 
                : 'border-zinc-200 dark:border-zinc-800'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between transition-colors ${
              quizStatus === 'correct' 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50' 
                : quizStatus === 'wrong' 
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50' 
                  : 'border-zinc-200 dark:border-zinc-800'
            }`}>
              <h2 className={`font-bold text-sm uppercase tracking-wider flex items-center gap-2 ${
                quizStatus === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : quizStatus === 'wrong' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-500'
              }`}>
                {quizStatus === 'correct' && <span>✓ Félicitations !</span>}
                {quizStatus === 'wrong' && <span>✕ Réponse Incorrecte</span>}
                {quizStatus === 'idle' && <span>Quiz Rapide • Halakha du Jour</span>}
              </h2>
              <button onClick={handleCloseModal} className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors">
                <Icon name="close" className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                Puis-je utiliser un écumoire pour retirer les fèves que je ne veux pas manger de mon plat pendant Chabbat ?
              </p>
              
              {/* Options */}
              <div className="space-y-3">
                {/* Option 0 (Faux) */}
                <button 
                  onClick={() => handleSelectOption(0)}
                  disabled={quizStatus !== 'idle'}
                  className={`w-full p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                    selectedOption === 0
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                      : quizStatus !== 'idle'
                        ? 'opacity-40 border-zinc-200 dark:border-zinc-800'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-500 dark:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Oui, c'est permis si c'est juste avant de manger.</span>
                    {selectedOption === 0 && <span className="text-rose-500 font-bold">✕</span>}
                  </div>
                </button>

                {/* Option 1 (Vrai - Correct) */}
                <button 
                  onClick={() => handleSelectOption(1)}
                  disabled={quizStatus !== 'idle'}
                  className={`w-full p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                    selectedOption === 1
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                      : quizStatus !== 'idle'
                        ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-500 dark:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Non, il faut utiliser sa main et prendre ce que l'on veut manger.</span>
                    {selectedOption === 1 && <span className="text-emerald-500 font-bold">✓</span>}
                  </div>
                </button>
              </div>

              {/* Feedback & Explanations */}
              {quizStatus === 'correct' && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold text-base mt-0.5">✓</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Explication du Yalkout Yossef</h4>
                      <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
                        Trier à l'aide d'un ustensile spécialisé (comme une écumoire ou une passoire) est strictement interdit pendant Chabbat (Mélakha de Borer). La règle exige de prélever avec la main le bon aliment pour consommation immédiate.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCloseModal}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Continuer (Fiche Minimisée 🔥)
                  </button>
                </div>
              )}

              {quizStatus === 'wrong' && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl p-4 space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold text-base mt-0.5">✕</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">Explication de la Règle</h4>
                      <p className="text-xs text-rose-900/90 dark:text-rose-200/90 leading-relaxed">
                        L'utilisation d'un outil de tri (écumoire, filtre) constitue l'interdit de Borer même immédiatement avant le repas. On doit uniquement prendre à la main ce qu'on désire consommer.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleResetModal}
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-500/20"
                  >
                    Réessayer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
