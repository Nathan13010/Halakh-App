import React, { useState, useEffect } from 'react';
import Icon from './components/Icon';
import WelcomeScreen from './components/WelcomeScreen';
import ReaderScreen from './components/ReaderScreen';
import LearningScreen from './components/LearningScreen';
import AIScreen from './components/AIScreen';
import ProfileScreen from './components/ProfileScreen';
import QuickSettingsPopover from './components/QuickSettingsPopover';
import SettingsModal from './components/SettingsModal';
import { BOOKS, FALLBACK_PARAGRAPHS } from './data/books';
import { resetAllProgressions } from './services/progressionTracker';

export const HEBREW_FONTS = [
  { id: 'noto-serif-hebrew', name: 'Noto Serif Hebrew', family: "'Noto Serif Hebrew', serif", style: 'Traditionnel • Torah' },
  { id: 'frank-ruhl', name: 'Frank Ruhl Libre', family: "'Frank Ruhl Libre', serif", style: 'Classique Rabbinique' },
  { id: 'david-libre', name: 'David Libre', family: "'David Libre', serif", style: 'Élégant • Sidour' },
  { id: 'alef', name: 'Alef', family: "'Alef', sans-serif", style: 'Moderne & Doux' },
  { id: 'rubik', name: 'Rubik', family: "'Rubik', sans-serif", style: 'Arrondi & Fluide' },
  { id: 'heebo', name: 'Heebo', family: "'Heebo', sans-serif", style: 'Sans-Serif Épuré' },
];

export const FRENCH_FONTS = [
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", style: 'Moderne & Net' },
  { id: 'lora', name: 'Lora', family: "'Lora', serif", style: 'Littéraire & Roman' },
  { id: 'merriweather', name: 'Merriweather', family: "'Merriweather', serif", style: 'Éditorial Confort' },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif", style: 'Prestige & Titres' },
  { id: 'outfit', name: 'Outfit', family: "'Outfit', sans-serif", style: 'Géométrique Aéré' },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome"); // Sub-navigation inside 'library' tab
  const [activeTab, setActiveTab] = useState("library"); // "library", "learning", "ai", "profile"
  const [readingMode, setReadingMode] = useState(3);
  const [fontSize, setFontSize] = useState(20);
  
  // Global States
  const [streak, setStreak] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState("");
  const [xp, setXp] = useState(0);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("mishne_mikra_theme") || "system";
  });
  const [textSize, setTextSize] = useState("medium");
  const [hebrewFont, setHebrewFont] = useState(() => {
    return localStorage.getItem("mishne_mikra_hebrew_font") || "noto-serif-hebrew";
  });
  const [frenchFont, setFrenchFont] = useState(() => {
    return localStorage.getItem("mishne_mikra_french_font") || "inter";
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);

  useEffect(() => {
    const hFont = HEBREW_FONTS.find(f => f.id === hebrewFont) || HEBREW_FONTS[0];
    const fFont = FRENCH_FONTS.find(f => f.id === frenchFont) || FRENCH_FONTS[0];
    document.documentElement.style.setProperty('--font-hebrew', hFont.family);
    document.documentElement.style.setProperty('--font-french', fFont.family);
  }, [hebrewFont, frenchFont]);

  const [activeBookId, setActiveBookId] = useState(null);
  const [paragraphs, setParagraphs] = useState(FALLBACK_PARAGRAPHS);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;
      if (theme === "system") {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = theme === "dark";
      }

      if (isDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }

      // Update theme-color meta tag for iPhone Safari status bar
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#0A0A0B' : '#FAFAFA');
      }
    };

    applyTheme();

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        if (theme === "system") applyTheme();
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("mishne_mikra_favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error(e);
      }
    }

    const storedBookmarks = localStorage.getItem("mishne_mikra_bookmarks_list");
    if (storedBookmarks) {
      try {
        setBookmarks(JSON.parse(storedBookmarks));
      } catch (e) {
        console.error(e);
      }
    }

    // Load gamification data
    const storedStreak = localStorage.getItem("mishne_mikra_streak");
    if (storedStreak) setStreak(parseInt(storedStreak, 10));
    
    const storedLastDate = localStorage.getItem("mishne_mikra_last_streak_date");
    if (storedLastDate) setLastStreakDate(storedLastDate);

    const storedXp = localStorage.getItem("mishne_mikra_xp");
    if (storedXp) setXp(parseInt(storedXp, 10));
    
    const storedTextSize = localStorage.getItem("mishne_mikra_text_size");
    if (storedTextSize) setTextSize(storedTextSize);
  }, []);

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

      const candidatePaths = [];
      if (book.dataFile) {
        candidatePaths.push(`/data/${book.dataFile}`);
      }
      candidatePaths.push(`/data/siman_${simanNum}.json`);
      candidatePaths.push(`/data/${book.id}.json`);

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

      let parsed = flattenHalakhot(initialArray);

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

  const handleSelectBookmark = (bm) => {
    const book = BOOKS.find(b => b.id === bm.bookId);
    if (book && book.isUnlocked) {
      handleLoadBook(book, bm.paragraphIndex);
    }
  };

  const handleRemoveBookmark = (bm, e) => {
    if (e) e.stopPropagation();
    const filtered = bookmarks.filter(
      item => !(item.bookId === bm.bookId && item.paragraphIndex === bm.paragraphIndex)
    );
    setBookmarks(filtered);
    localStorage.setItem("mishne_mikra_bookmarks_list", JSON.stringify(filtered));
    triggerToast("Marque-page retiré", "info");
  };

  const handleToggleBookmark = (pIdx) => {
    const activeBook = BOOKS.find(b => b.id === activeBookId) || BOOKS[0];
    const activeParagraph = paragraphs[pIdx];
    if (!activeParagraph) return;

    const exists = bookmarks.some(
      bm => bm.bookId === activeBook.id && bm.paragraphIndex === pIdx
    );
    let updated = [];

    if (exists) {
      updated = bookmarks.filter(
        bm => !(bm.bookId === activeBook.id && bm.paragraphIndex === pIdx)
      );
      triggerToast("Marque-page retiré", "info");
    } else {
      updated = [...bookmarks, {
        bookId: activeBook.id,
        bookTitle: activeBook.title,
        chapterId: "ch-1",
        chapterTitle: activeBook.chapters?.[0]?.title || "Siman 318",
        paragraphIndex: pIdx,
        seif: activeParagraph.seif || String(pIdx + 1),
        previewHebrew: activeParagraph.texte_integral?.hebreu_sans_voyelles?.substring(0, 45) + "..." || "",
        previewFrench: activeParagraph.texte_integral?.francais?.substring(0, 70) + "..." || "",
        savedAt: Date.now()
      }];
      triggerToast("Marque-page placé ! 🔖");
    }
    setBookmarks(updated);
    localStorage.setItem("mishne_mikra_bookmarks_list", JSON.stringify(updated));
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
  const handleAddXp = (amount) => {
    const newXp = xp + amount;
    setXp(newXp);
    localStorage.setItem("mishne_mikra_xp", newXp);
    triggerToast(`+${amount} XP gagnés ! 🏆`);
  };

  const handleLearningDayCompleted = () => {
    const today = new Date().toISOString().split('T')[0];
    if (lastStreakDate === today) return false;

    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setLastStreakDate(today);
    localStorage.setItem("mishne_mikra_streak", nextStreak);
    localStorage.setItem("mishne_mikra_last_streak_date", today);
    triggerToast("Journée d'étude validée ! 🔥");
    return true;
  };

  const handleResetProgression = () => {
    setStreak(0);
    setXp(0);
    setLastStreakDate("");
    localStorage.removeItem("mishne_mikra_streak");
    localStorage.removeItem("mishne_mikra_last_streak_date");
    localStorage.removeItem("mishne_mikra_xp");
    resetAllProgressions();
    triggerToast("Progression réinitialisée");
  };

  const totalSeifim = new Set(paragraphs.map(p => p.seif).filter(Boolean)).size;

  return (
    <div
      className="min-h-screen bg-[#E3E7EC] dark:bg-[#25282D] text-zinc-900 dark:text-[#E4E4E7] font-sans pb-20 md:pb-0 overflow-x-hidden w-full max-w-full"
      style={{ paddingTop: 'calc(var(--header-height, 4rem) + var(--safe-top, 0px))' }}
    >
      {/* Header Mobile / Desktop Top Bar */}
      <header
        className="fixed top-0 left-0 right-0 bg-[#E3E7EC]/80 dark:bg-[#25282D]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-40 flex items-center justify-between px-4 md:px-8 w-full max-w-full overflow-x-hidden"
        style={{ minHeight: 'var(--header-height, 4rem)', height: 'calc(var(--header-height, 4rem) + var(--safe-top, 0px))', paddingTop: 'var(--safe-top, 0px)', boxSizing: 'border-box' }}
      >
        {/* Left side: Back button when reading, Logo otherwise */}
        {activeTab === 'library' && currentScreen === 'reader' ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentScreen("welcome")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 cursor-pointer transition-colors"
            >
              <Icon name="arrowLeft" className="w-4 h-4" />
              <span className="hidden sm:inline">Bibliothèque</span>
            </button>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[180px] sm:max-w-xs">
                {activeBook.title}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                {activeBook.chapters?.[0]?.title || "Siman 318"}{totalSeifim > 0 ? ` • ${totalSeifim} Seïf${totalSeifim > 1 ? 's' : ''}` : ''}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <img src="/images/brand/logo.webp" alt="Halakh'App Logo" className="w-8 h-8 rounded-xl object-cover border border-amber-500/30 shadow-sm" />
            <span className="font-serif font-medium tracking-tight text-xl md:text-2xl text-zinc-900 dark:text-zinc-100">Halakh'<span className="text-amber-500">App</span></span>
          </div>
        )}

        {/* Right side: Aa button (visible only when reading) */}
        <div className="flex items-center gap-3">
          {/* Sefaria-style Quick Settings Button (Aa) - Visible ONLY when reading a book */}
          {activeTab === 'library' && currentScreen === 'reader' && (
            <div className="relative">
              <button 
                onClick={() => setIsQuickSettingsOpen(prev => !prev)}
                className={`quick-settings-trigger flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isQuickSettingsOpen
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md font-bold'
                    : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 shadow-sm'
                }`}
                title="Options d'affichage (Langue, Thème, Taille)"
              >
                <span className="font-serif font-bold text-sm">A/א</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <QuickSettingsPopover
        isOpen={isQuickSettingsOpen}
        onClose={() => setIsQuickSettingsOpen(false)}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        theme={theme}
        setTheme={(t) => { setTheme(t); localStorage.setItem("mishne_mikra_theme", t); }}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onOpenFullSettings={() => {
          setActiveTab('profile');
          setIsQuickSettingsOpen(false);
        }}
      />

      {/* Main Content Area */}
      <main className="min-h-screen w-full max-w-full overflow-x-hidden">
        {isLoading && (
          <div className="fixed inset-0 bg-[#E3E7EC]/95 dark:bg-[#25282D]/95 z-55 flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-md">
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
            bookmarks={bookmarks}
            onSelectBook={handleSelectBook}
            onSelectFavorite={handleSelectFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            onSelectBookmark={handleSelectBookmark}
            onRemoveBookmark={handleRemoveBookmark}
            onOpenSettings={() => setActiveTab('profile')}
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
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            books={BOOKS}
            activeBookId={activeBookId}
            onSelectBook={handleSelectBook}
            readingMode={readingMode}
            setReadingMode={setReadingMode}
            fontSize={fontSize}
            setFontSize={setFontSize}
            theme={theme}
            setTheme={(t) => { setTheme(t); localStorage.setItem("mishne_mikra_theme", t); }}
            onOpenFullSettings={() => setActiveTab('profile')}
          />
        )}

        {activeTab === "learning" && (
          <LearningScreen 
            xp={xp} 
            onAddXp={handleAddXp} 
            streak={streak} 
            onCompleteDay={handleLearningDayCompleted}
          />
        )}

        {activeTab === "ai" && (
          <AIScreen />
        )}

        {activeTab === "profile" && (
          <ProfileScreen
            streak={streak}
            xp={xp}
            favoritesCount={favorites.length}
            bookmarksCount={bookmarks.length}
            theme={theme}
            setTheme={(t) => { setTheme(t); localStorage.setItem("mishne_mikra_theme", t); }}
            textSize={textSize}
            setTextSize={(s) => { setTextSize(s); localStorage.setItem("mishne_mikra_text_size", s); }}
            hebrewFont={hebrewFont}
            setHebrewFont={(hf) => { setHebrewFont(hf); localStorage.setItem("mishne_mikra_hebrew_font", hf); }}
            frenchFont={frenchFont}
            setFrenchFont={(ff) => { setFrenchFont(ff); localStorage.setItem("mishne_mikra_french_font", ff); }}
            hebrewFontsList={HEBREW_FONTS}
            frenchFontsList={FRENCH_FONTS}
            onReset={handleResetProgression}
          />
        )}
      </main>

      {/* Bottom Navigation Bar with 4 Tabs */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-[#E3E7EC] dark:bg-[#25282D] border-t border-zinc-200 dark:border-zinc-800 z-40 w-full max-w-full overflow-x-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around px-2 py-3 w-full h-[4.5rem]">
          <button 
            onClick={() => { setActiveTab("library"); setCurrentScreen("welcome"); }} 
            className={`flex flex-col items-center justify-center gap-1.5 w-18 sm:w-20 h-full cursor-pointer transition-colors ${
              activeTab === 'library' ? 'text-amber-500 font-bold' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
          <Icon name="library" className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] font-bold">Bibliothèque</span>
        </button>

        <button 
          onClick={() => setActiveTab("learning")} 
          className={`flex flex-col items-center justify-center gap-1.5 w-18 sm:w-20 h-full cursor-pointer transition-colors ${
            activeTab === 'learning' ? 'text-blue-500 font-bold' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          <span className="text-[10px] font-bold">Apprentissage</span>
        </button>

        <button 
          onClick={() => setActiveTab("ai")} 
          className={`flex flex-col items-center justify-center gap-1.5 w-18 sm:w-20 h-full cursor-pointer transition-colors ${
            activeTab === 'ai' ? 'text-purple-500 font-bold' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          <span className="text-[10px] font-bold">Question IA</span>
        </button>

        <button 
          onClick={() => setActiveTab("profile")} 
          className={`flex flex-col items-center justify-center gap-1.5 w-18 sm:w-20 h-full cursor-pointer transition-colors ${
            activeTab === 'profile' ? 'text-amber-500 font-bold' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
          <span className="text-[10px] font-bold">Profil</span>
        </button>
        </div>
      </nav>

      {/* Settings Modal (if opened directly) */}
      {isSettingsOpen && (
        <SettingsModal
          theme={theme}
          setTheme={(t) => { setTheme(t); localStorage.setItem("mishne_mikra_theme", t); }}
          textSize={textSize}
          setTextSize={(s) => { setTextSize(s); localStorage.setItem("mishne_mikra_text_size", s); }}
          hebrewFont={hebrewFont}
          setHebrewFont={(hf) => { setHebrewFont(hf); localStorage.setItem("mishne_mikra_hebrew_font", hf); }}
          frenchFont={frenchFont}
          setFrenchFont={(ff) => { setFrenchFont(ff); localStorage.setItem("mishne_mikra_french_font", ff); }}
          hebrewFontsList={HEBREW_FONTS}
          frenchFontsList={FRENCH_FONTS}
          onClose={() => setIsSettingsOpen(false)}
          onReset={handleResetProgression}
        />
      )}
    </div>
  );
}

export default App;
