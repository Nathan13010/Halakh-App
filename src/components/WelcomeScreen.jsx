import React, { useState } from 'react';
import Icon from './Icon';
import { CATEGORIES } from '../data/books';
import DynamicNeumorphicIcon from './icons/DynamicNeumorphicIcon';
import NeumorphicShabbatIcon from './icons/NeumorphicShabbatIcon';

const WelcomeScreen = ({ 
  books, 
  favorites = [], 
  bookmarks = [], 
  onSelectBook, 
  onSelectFavorite, 
  onRemoveFavorite, 
  onSelectBookmark, 
  onRemoveBookmark, 
  onOpenSettings
}) => {
  const [sidebarTab, setSidebarTab] = useState('favorites');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  return (
    <div className="min-h-[calc(100vh-8rem)] text-zinc-900 dark:text-[#E4E4E7] flex flex-col justify-between py-8 px-4 md:px-8 font-sans">


      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 flex-grow">
        <div className="lg:col-span-3 flex flex-col">
          
          <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <Icon name="library" className="w-4 h-4 text-amber-500/80" />
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">Votre Bibliothèque</h2>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 font-mono font-bold ml-auto select-none">
              {CATEGORIES.length} SECTION(S)
            </span>
          </div>

          {selectedCategoryId ? (
            <div className="py-2 animate-fade-in">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="mb-4 flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                <Icon name="arrowLeft" className="w-4 h-4" />
                Retour aux sections
              </button>

              {(() => {
                const cat = CATEGORIES.find(c => c.id === selectedCategoryId);
                const categoryBooks = books.filter(b => b.dataFile && b.dataFile.startsWith(cat.folder));
                return (
                  <div className="space-y-4">
                    <div className="bg-[#E3E7EC] dark:bg-[#25282D] rounded-2xl p-5 mb-2 flex items-start justify-between shadow-[8px_8px_16px_#c1c4c9,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#1d1f23,-8px_-8px_16px_#2d3137]">
                      <div>
                        <h3 className="text-xl font-sans font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{cat.title}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm line-clamp-2">{cat.description}</p>
                      </div>
                      {cat.id === 'chabbat' ? (
                        <NeumorphicShabbatIcon className="w-24 h-24 shrink-0 hidden sm:block" />
                      ) : cat.iconName ? (
                        <DynamicNeumorphicIcon iconName={cat.iconName} className="w-24 h-24 shrink-0 hidden sm:block" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl border border-amber-500/20 shrink-0 hidden sm:flex">
                          {cat.icon}
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 p-2 sm:p-4 rounded-2xl space-y-1.5 sm:space-y-2">
                      {categoryBooks.length > 0 ? (
                        categoryBooks.map(book => (
                          <button
                            key={book.id}
                            onClick={() => book.isUnlocked && onSelectBook(book.id)}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                              book.isUnlocked
                                ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50 shadow-sm cursor-pointer'
                                : 'bg-zinc-100/50 dark:bg-zinc-900/30 border-transparent opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <div className="pr-4 flex-1">
                              <span className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {book.title}
                                {!book.isUnlocked && <Icon name="lock" className="w-3.5 h-3.5 text-zinc-400" />}
                              </span>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{book.description}</p>
                            </div>
                            <div className="shrink-0 ml-2 hidden sm:block">
                              <p className="text-base font-hebrew font-bold text-amber-700/80 dark:text-amber-500/80" dir="rtl">{book.hebrewTitle}</p>
                            </div>
                            <div className="sm:hidden shrink-0 ml-2">
                              <p className="text-sm font-hebrew font-bold text-amber-700/80 dark:text-amber-500/80 max-w-[80px] text-right truncate" dir="rtl">{book.hebrewTitle}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-zinc-500">
                          Aucun chapitre disponible pour le moment.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="space-y-4 py-6 animate-fade-in">
              {CATEGORIES.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className="bg-[#E3E7EC] dark:bg-[#25282D] rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group shadow-[8px_8px_16px_#c1c4c9,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#1d1f23,-8px_-8px_16px_#2d3137] hover:shadow-[4px_4px_8px_#c1c4c9,-4px_-4px_8px_#ffffff] dark:hover:shadow-[4px_4px_8px_#1d1f23,-4px_-4px_8px_#2d3137]"
                >
                  <div className="p-4 sm:p-5 flex items-center justify-between">
                    <div className="flex items-start sm:items-center gap-4 w-full">
                      {cat.id === 'chabbat' ? (
                        <NeumorphicShabbatIcon className="w-24 h-24 mt-1 sm:mt-0 shrink-0" />
                      ) : cat.iconName ? (
                        <DynamicNeumorphicIcon iconName={cat.iconName} className="w-24 h-24 mt-1 sm:mt-0 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 mt-1 sm:mt-0 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl border border-amber-500/20 shrink-0">
                          {cat.icon}
                        </div>
                      )}
                      <div className="flex-1 pr-4">
                        <h3 className="text-base sm:text-lg font-sans font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{cat.title}</h3>
                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{cat.description}</p>
                      </div>
                      <div className="hidden sm:block shrink-0 ml-4 border-l border-zinc-100 dark:border-zinc-800 pl-4 py-2">
                        <p className="text-base font-hebrew font-bold text-amber-700/80 dark:text-amber-500/80" dir="rtl">{cat.hebrewTitle}</p>
                      </div>
                    </div>
                  </div>
                  {/* Mobile hebrew title fallback */}
                  <div className="sm:hidden border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/30 px-4 py-2 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Ouvrir</span>
                    <p className="text-sm font-hebrew font-bold text-amber-700/80 dark:text-amber-500/80" dir="rtl">{cat.hebrewTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

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
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1-1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>Réglages</span>
                </button>
              )}
            </div>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-amber-500/80">✦</span>
                <span>Sélectionnez une section et un ouvrage débloqué (notamment le volume <strong className="text-zinc-900 dark:text-zinc-200">Yalkout Yossef - Hilkhot Chabbat</strong>).</span>
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
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider block mb-1 pr-6">
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
                      <div className="flex items-center gap-1.5 mb-1 pr-6">
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
    </div>
  );
};

export default WelcomeScreen;
