import React, { useState, useEffect } from 'react';
import Icon from './components/Icon';
import WelcomeScreen from './components/WelcomeScreen';
import ReaderScreen from './components/ReaderScreen';
import LearningScreen from './components/LearningScreen';
import AIScreen from './components/AIScreen';
import SettingsModal from './components/SettingsModal';
import { BOOKS, FALLBACK_PARAGRAPHS } from './data/books';

function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome"); // Sub-navigation inside 'library' tab
  const [activeTab, setActiveTab] = useState("library"); // "library", "learning", "ai"
  
  // Global States
  const [streak, setStreak] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState("");
  const [xp, setXp] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [textSize, setTextSize] = useState("medium");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activeBookId, setActiveBookId] = useState(null);
  const [paragraphs, setParagraphs] = useState(FALLBACK_PARAGRAPHS);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("mishne_mikra_favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error(e);
      }
    }

    const storedBookmark = localStorage.getItem("mishne_mikra_bookmark");
    if (storedBookmark) {
      try {
        const { bookId, paragraphIndex } = JSON.parse(storedBookmark);
        const savedBook = BOOKS.find(b => b.id === bookId);
        if (savedBook && savedBook.isUnlocked) {
          handleLoadBook(savedBook, paragraphIndex, true);
        } else if (BOOKS[0] && BOOKS[0].isUnlocked) {
          handleLoadBook(BOOKS[0], 0, true);
        }
      } catch (e) {
        console.error(e);
        if (BOOKS[0] && BOOKS[0].isUnlocked) handleLoadBook(BOOKS[0], 0, true);
      }
    } else if (BOOKS[0] && BOOKS[0].isUnlocked) {
      handleLoadBook(BOOKS[0], 0, true);
    }
    // Load gamification data
    const storedStreak = localStorage.getItem("mishne_mikra_streak");
    if (storedStreak) setStreak(parseInt(storedStreak, 10));
    
    const storedLastDate = localStorage.getItem("mishne_mikra_last_streak_date");
    if (storedLastDate) setLastStreakDate(storedLastDate);

    const storedXp = localStorage.getItem("mishne_mikra_xp");
    if (storedXp) setXp(parseInt(storedXp, 10));

    const storedTheme = localStorage.getItem("mishne_mikra_theme");
    if (storedTheme) setTheme(storedTheme);
    
    const storedTextSize = localStorage.getItem("mishne_mikra_text_size");
    if (storedTextSize) setTextSize(storedTextSize);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme; // Apply dark mode class to html
  }, [theme]);

  const triggerToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLoadBook = async (book, startIdx = 0, isAuto = false) => {
    if (!book.isUnlocked) return;
    setIsLoading(true);
    setErrorMessage(null);
    setActiveBookId(book.id);

    try {
      const simanMatch = book.id.match(/(\d+)/);
      const simanNum = simanMatch ? simanMatch[1] : '318';

      const candidatePaths = [
        `/data/siman_${simanNum}.json`,
        `/data/${book.id}.json`,
      ];

      let response = null;
      for (const p of candidatePaths) {
        try {
          const res = await fetch(`${p}?t=${Date.now()}`);
          if (res.ok) {
            response = res;
            break;
          }
        } catch { /* continue */ }
      }
      
      if (!response || !response.ok) {
        throw new Error(`Erreur de chargement local pour le livre ${book.id}`);
      }

      const rawData = await response.json();
      const flattenHalakhot = (arr) => {
        let result = [];
        (arr || []).forEach(item => {
          if (item && item.halakhot && Array.isArray(item.halakhot)) {
            result.push(...flattenHalakhot(item.halakhot));
          } else if (item && (item.texte_integral || item.seif)) {
            result.push(item);
          }
        });
        return result;
      };

      const initialArray = Array.isArray(rawData)
        ? rawData
        : (rawData && rawData.halakhot && Array.isArray(rawData.halakhot))
          ? rawData.halakhot
          : (Object.values(rawData || {}).find(v => Array.isArray(v)) || []);

      parsed = flattenHalakhot(initialArray);

      if (parsed.length === 0) throw new Error("JSON mal formé.");

      const cleanArabic = (str) => (str || '').replace(/[\u0600-\u06FF]/g, '');
      const cleanPunct = (str) => (str || '').replace(/[.,'׳"״\u05F3\u05F4]/g, '').trim();

      const HEBREW_LETTERS_MAP = {
        1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט', 10: 'י',
        11: 'יא', 12: 'יב', 13: 'יג', 14: 'יד', 15: 'טו', 16: 'טז', 17: 'יז', 18: 'יח', 19: 'יט', 20: 'כ',
        21: 'כא', 22: 'כב', 23: 'כג', 24: 'כד', 25: 'כה', 26: 'כו', 27: 'כז', 28: 'כח', 29: 'כט', 30: 'ל',
        31: 'לא', 32: 'לב', 33: 'לג', 34: 'לד', 35: 'לה', 36: 'לו', 37: 'לז', 38: 'לח', 39: 'לט', 40: 'מ',
        41: 'מא', 42: 'מב', 43: 'מג', 44: 'מד', 45: 'מה', 46: 'מו', 47: 'מז', 48: 'מח', 49: 'מט', 50: 'נ',
        51: 'נא', 52: 'נב', 53: 'נג', 54: 'נד', 55: 'נה', 56: 'נו', 57: 'נז', 58: 'נח', 59: 'נט', 60: 'ס',
        61: 'סא', 62: 'סב', 63: 'סג', 64: 'סד', 65: 'סה', 66: 'סו', 67: 'סז', 68: 'סח', 69: 'סט', 70: 'ע',
        71: 'עא', 72: 'עב', 73: 'עג', 74: 'עד', 75: 'עה', 76: 'עו', 77: 'עז', 78: 'עח', 79: 'עט', 80: 'פ',
        81: 'פא', 82: 'פב', 83: 'פג', 84: 'פד', 85: 'פה', 86: 'פו', 87: 'פז', 88: 'פח', 89: 'פט', 90: 'צ',
        91: 'צא', 92: 'צב', 93: 'צג', 94: 'צד', 95: 'צה', 96: 'צו', 97: 'צז', 98: 'צח', 99: 'צט', 100: 'ק',
        101: 'קא', 102: 'קב', 103: 'קג', 104: 'קד', 105: 'קה', 106: 'קו', 107: 'קז', 108: 'קח', 109: 'קט', 110: 'קי',
        111: 'קיא', 112: 'קיב', 113: 'קיג', 114: 'קיד', 115: 'קטו', 116: 'קטז', 117: 'קיז', 118: 'קיח', 119: 'קיט', 120: 'קכ',
        121: 'קכא', 122: 'קכב', 123: 'קכג', 124: 'קכד', 125: 'קכה', 126: 'קכו', 127: 'קכז', 128: 'קכח', 129: 'קכט', 130: 'קל',
        131: 'קלא', 132: 'קלב', 133: 'קלג', 134: 'קלד', 135: 'קלה', 136: 'קלו', 137: 'קלז', 138: 'קלח', 139: 'קלט', 140: 'קמ',
        141: 'קמא', 142: 'קמב', 143: 'קמג', 144: 'קמד', 145: 'קמה', 146: 'קמו', 147: 'קמז', 148: 'קמח', 149: 'קמט', 150: 'קס',
        151: 'קסא', 152: 'קסב', 153: 'קסג', 154: 'קסד', 155: 'קסה', 156: 'קסו', 157: 'קסז', 158: 'קסח', 159: 'קסט', 160: 'קע',
        161: 'קעא', 162: 'קעב', 163: 'קעג', 164: 'קעד', 165: 'קעה', 166: 'קעו', 167: 'קעז', 168: 'קעח', 169: 'קעט', 170: 'קפ',
        171: 'קפא', 172: 'קפב', 173: 'קפג', 174: 'קפד', 175: 'קפה', 176: 'קפו', 177: 'קפז', 178: 'קפח', 179: 'קפט', 180: 'קצ',
        181: 'קצא', 182: 'קצב', 183: 'קצג', 184: 'קצד', 185: 'קצה', 186: 'קצו', 187: 'קצז', 188: 'קצח', 189: 'קצט', 190: 'ר',
        191: 'רא', 192: 'רב', 193: 'רג'
      };

      const normalized = parsed.map((h, idx) => {
        const t = h.texte_integral || h.texteintegral || {};
        const seifNum = parseInt(h.seif || (idx + 1), 10) || (idx + 1);
        const hebLetter = HEBREW_LETTERS_MAP[seifNum] || String(seifNum);
        const hebBadge = `${hebLetter}.`;
        const frBadge = `${seifNum}.`;

        // Clean Arabic diacritics from texts
        const rawHebBrut = cleanArabic(t.hebreu_sans_voyelles || t.hebreusansvoyelles || "");
        const rawHebVoyelles = cleanArabic(t.hebreu_avec_voyelles || t.hebreuavecvoyelles || rawHebBrut);
        const rawFr = (t.francais || "").trim();

        // Use mots_alignes directly from JSON — DO NOT reconstruct by splitting text
        let mots = (h.mots_alignes || h.motsalignes || []).map((m, i) => ({
          id: i,
          hebreu_brut: cleanArabic(m.hebreu_brut || m.hebreubrut || ''),
          hebreu_voyelles: cleanArabic(m.hebreu_voyelles || m.hebreuvoyelles || m.hebreu_brut || ''),
          francais_mot: m.francais_mot || m.francaismot || '',
          expression_contexte: m.expression_contexte || m.expressioncontexte || '',
          ...(m.infinitif ? { infinitif: m.infinitif } : {})
        }));

        // Safety net: ensure badge at position 0
        if (mots.length > 0 && cleanPunct(mots[0].hebreu_brut) !== cleanPunct(hebLetter)) {
          // Badge is missing — prepend it
          mots.unshift({
            id: 0,
            hebreu_brut: hebBadge,
            hebreu_voyelles: hebBadge,
            francais_mot: frBadge,
            expression_contexte: "Numéro du paragraphe"
          });
          mots.forEach((m, i) => { m.id = i; });
        } else if (mots.length > 0) {
          // Badge exists — ensure it has correct format
          mots[0] = {
            id: 0,
            hebreu_brut: hebBadge,
            hebreu_voyelles: hebBadge,
            francais_mot: frBadge,
            expression_contexte: "Numéro du paragraphe"
          };
        }

        return {
          ...h,
          seif: String(seifNum),
          texte_integral: {
            hebreu_sans_voyelles: rawHebBrut,
            hebreu_avec_voyelles: rawHebVoyelles,
            francais: rawFr
          },
          mots_alignes: mots
        };
      });

      setParagraphs(normalized);
      setCurrentParagraphIndex(Math.min(normalized.length - 1, Math.max(0, startIdx)));
      setCurrentScreen("reader");
      triggerToast(isAuto ? "Marque-page automatique restauré !" : `Chargement réussi !`);
    } catch (e) {
      console.warn("Utilisation du jeu de données autonome bilingue de secours...", e);
      setParagraphs(FALLBACK_PARAGRAPHS);
      setCurrentParagraphIndex(0);
      setCurrentScreen("reader");
      triggerToast("Utilisation des données locales de secours (bilingues)", "info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBook = (bookId) => {
    const book = BOOKS.find(b => b.id === bookId);
    if (book) handleLoadBook(book, 0);
  };

  const handleSelectFavorite = (fav) => {
    const book = BOOKS.find(b => b.id === fav.bookId);
    if (book && book.isUnlocked) {
      handleLoadBook(book, fav.paragraphIndex);
    }
  };

  const handleRemoveFavorite = (fav, e) => {
    e.stopPropagation();
    const filtered = favorites.filter(
      item => !(item.bookId === fav.bookId && item.paragraphIndex === fav.paragraphIndex)
    );
    setFavorites(filtered);
    localStorage.setItem("mishne_mikra_favorites", JSON.stringify(filtered));
    triggerToast("Retiré des favoris");
  };

  const handleToggleFavorite = (pIdx) => {
    const activeBook = BOOKS.find(b => b.id === activeBookId) || BOOKS[0];
    const activeParagraph = paragraphs[pIdx];
    if (!activeParagraph) return;

    const exists = favorites.some(
      fav => fav.bookId === activeBook.id && fav.paragraphIndex === pIdx
    );
    let updated = [];

    if (exists) {
      updated = favorites.filter(
        fav => !(fav.bookId === activeBook.id && fav.paragraphIndex === pIdx)
      );
      triggerToast("Retiré de vos favoris", "info");
    } else {
      updated = [...favorites, {
        bookId: activeBook.id,
        bookTitle: activeBook.title,
        chapterId: "ch-1",
        chapterTitle: "Siman 318",
        paragraphIndex: pIdx,
        seif: activeParagraph.seif || String(pIdx + 1),
        previewHebrew: activeParagraph.texte_integral.hebreu_sans_voyelles.substring(0, 45) + "...",
        previewFrench: activeParagraph.texte_integral.francais.substring(0, 70) + "...",
        savedAt: Date.now()
      }];
      triggerToast("Ajouté aux favoris !");
    }
    setFavorites(updated);
    localStorage.setItem("mishne_mikra_favorites", JSON.stringify(updated));
  };

  const handleParagraphChange = (idx) => {
    setCurrentParagraphIndex(idx);
    if (activeBookId) {
      localStorage.setItem(
        "mishne_mikra_bookmark",
        JSON.stringify({ bookId: activeBookId, paragraphIndex: idx })
      );
    }
  };

  const activeBook = BOOKS.find(b => b.id === activeBookId) || BOOKS[0];
  const todayDateStr = new Date().toISOString().split('T')[0];
  const isDailyCompleted = lastStreakDate === todayDateStr;

  const handleUpdateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    if (lastStreakDate === today) {
      triggerToast("Halakha du jour déjà validée aujourd'hui !", "info");
      return false;
    }
    const newStreak = streak + 1;
    setStreak(newStreak);
    setLastStreakDate(today);
    localStorage.setItem("mishne_mikra_streak", newStreak);
    localStorage.setItem("mishne_mikra_last_streak_date", today);
    triggerToast("Streak augmenté ! 🔥");
    return true;
  };

  const handleAddXp = (amount) => {
    const newXp = xp + amount;
    setXp(newXp);
    localStorage.setItem("mishne_mikra_xp", newXp);
    triggerToast(`+${amount} XP gagnés ! 🏆`);
  };

  return (
    <div className={`${theme} min-h-screen bg-zinc-50 dark:bg-[#0A0A0B] text-zinc-900 dark:text-[#E4E4E7] font-sans pb-20 md:pb-0 md:pt-20`}>
      {/* Header Mobile / Desktop Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-40 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <img src="/images/brand/logo_halakhapp.jpg" alt="Halakh'App Logo" className="w-8 h-8 rounded-xl object-cover border border-amber-500/30 shadow-sm" />
          <span className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-100">Halakh'App</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Global Streak Counter */}
          <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            <span className="text-amber-500 text-sm">🔥</span>
            <span className="text-amber-500 font-bold text-xs">{streak}</span>
          </div>
          {/* Settings Toggle */}
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen">
        {isLoading && (
          <div className="fixed inset-0 bg-white/95 dark:bg-[#0A0A0B]/95 z-55 flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-md">
            <div className="relative mb-6 animate-pulse">
              <p className="text-amber-500 font-bold font-serif text-3xl">ש</p>
            </div>
            <h2 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-2 font-serif">Récupération des Écrits</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">Veuillez patienter pendant le chargement bilingue...</p>
          </div>
        )}

        {toast && (
          <div className="fixed z-50 bottom-24 md:bottom-10 right-5 pointer-events-none max-w-sm select-none">
            <div className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-850 text-zinc-100 rounded-xl py-3 px-4.5 shadow-2xl">
              <Icon name="doubleCheck" className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{toast.text}</span>
            </div>
          </div>
        )}

        {activeTab === "library" && currentScreen === "welcome" && (
          <WelcomeScreen
            books={BOOKS}
            favorites={favorites}
            onSelectBook={handleSelectBook}
            onSelectFavorite={handleSelectFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            streak={streak}
            onIncreaseStreak={handleUpdateStreak}
            isDailyCompleted={isDailyCompleted}
          />
        )}
        
        {activeTab === "library" && currentScreen === "reader" && (
          <ReaderScreen
            bookTitle={activeBook.title}
            bookSubtitle={activeBook.subtitle}
            chapterTitle={activeBook.chapters?.[0]?.title || "Siman"}
            paragraphs={paragraphs}
            currentParagraphIndex={currentParagraphIndex}
            onParagraphChange={handleParagraphChange}
            onBackToLibrary={() => setCurrentScreen("welcome")}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            books={BOOKS}
            activeBookId={activeBookId}
            onSelectBook={handleSelectBook}
          />
        )}

        {activeTab === "learning" && (
          <LearningScreen xp={xp} onAddXp={handleAddXp} streak={streak} />
        )}

        {activeTab === "ai" && (
          <AIScreen />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-40 flex items-center justify-around px-2 pb-safe">
        <button onClick={() => { setActiveTab("library"); setCurrentScreen("welcome"); }} className={`flex flex-col items-center justify-center gap-1.5 w-20 h-full ${activeTab === 'library' ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
          <Icon name="library" className="w-6 h-6" />
          <span className="text-[10px] font-bold">Bibliothèque</span>
        </button>
        <button onClick={() => setActiveTab("learning")} className={`flex flex-col items-center justify-center gap-1.5 w-20 h-full ${activeTab === 'learning' ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          <span className="text-[10px] font-bold">Apprentissage</span>
        </button>
        <button onClick={() => setActiveTab("ai")} className={`flex flex-col items-center justify-center gap-1.5 w-20 h-full ${activeTab === 'ai' ? 'text-purple-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          <span className="text-[10px] font-bold">Question IA</span>
        </button>
      </nav>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          theme={theme}
          setTheme={(t) => { setTheme(t); localStorage.setItem("mishne_mikra_theme", t); }}
          textSize={textSize}
          setTextSize={(s) => { setTextSize(s); localStorage.setItem("mishne_mikra_text_size", s); }}
          onClose={() => setIsSettingsOpen(false)}
          onReset={() => {
            setStreak(0); setXp(0); setLastStreakDate("");
            localStorage.removeItem("mishne_mikra_streak");
            localStorage.removeItem("mishne_mikra_last_streak_date");
            localStorage.removeItem("mishne_mikra_xp");
            triggerToast("Progression réinitialisée");
          }}
        />
      )}
    </div>
  );
}

export default App;
