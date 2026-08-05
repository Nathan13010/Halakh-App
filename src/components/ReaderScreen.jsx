import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

// Helpers
const parseToken = (token) => {
  const match = token.match(/^([^\w\u00C0-\u00FF]*)([\w\u00C0-\u00FF'-]+)([^\w\u00C0-\u00FF]*)$/);
  if (match) {
    return { prefix: match[1], word: match[2], suffix: match[3] };
  }
  return { prefix: "", word: token, suffix: "" };
};

const cleanStr = (str) => {
  return (str || "").toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]"']/g, "")
    .split(/\s+/)
    .filter(Boolean);
};

const getSeifTitle = (p) => {
  if (!p) return "";
  if (p.titre_seif) return p.titre_seif;
  if (p.titre_seif_fr) return p.titre_seif_fr;
  if (p.texte_integral?.francais) {
    const cleanFr = p.texte_integral.francais.replace(/^[0-9]+\.\s*/, '').trim();
    const words = cleanFr.split(/\s+/).slice(0, 6);
    return words.join(' ') + (cleanFr.split(/\s+/).length > 6 ? '...' : '');
  }
  return "";
};

// ─── Composant Mémorisé d'une Halakha (Card) ───────────────────────────
const ParagraphCard = React.memo(({
  p,
  pIndex,
  isSelected,
  isFav,
  readingMode,
  fontSize,
  searchQuery,
  hoveredWordId,
  popup,
  isFirstOfSubject,
  currentSubjectTitle,
  availableSeifCount,
  onParagraphChange,
  onToggleFavorite,
  onWordClick,
  setHoveredWordId,
  wordRefs,
  isToolbarVisible
}) => {
  const [isTitleExpanded, setIsTitleExpanded] = React.useState(false);

  React.useEffect(() => {
    if (!isTitleExpanded) return;
    
    const handleScroll = () => setIsTitleExpanded(false);
    const handleClickOutside = (e) => {
      if (!e.target.closest('.seif-title-btn')) {
        setIsTitleExpanded(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTitleExpanded]);

  const normalizeFrWord = (str) => {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  };

  const getWordStems = (str) => {
    const tokens = (str || "").split(/\s+/).map(normalizeFrWord).filter(Boolean);
    const stems = new Set();
    tokens.forEach(w => {
      stems.add(w);
      if (w.length >= 4) {
        stems.add(w.slice(0, Math.min(w.length, 5)));
        stems.add(w.slice(0, Math.min(w.length, 6)));
      }
    });
    return stems;
  };

const FRENCH_STOP_WORDS = new Set([
  'de', 'du', 'des', 'la', 'le', 'les', 'en', 'un', 'une', 'a', 'et', 'par', 'd', 'l',
  'est', 'il', 'que', 'qui', 'sur', 'dans', 'pour', 'pas', 'ne', 'si', 'car', 'ce', 'ces'
]);

  // Pre-calculate fluent French mapping ONCE per paragraph with smart fuzzy stemming & stop-word filtering
  const fluentMapping = React.useMemo(() => {
    if (!p || !p.texte_integral || !p.texte_integral.francais) return [];

    const tokens = p.texte_integral.francais.split(/\s+/);
    const mots = p.mots_alignes || [];
    const cleanMots = mots.map(m => {
      const rawText = `${m.francais_mot || ''} ${m.expression_contexte || ''}`;
      return {
        mot: m,
        words: getWordStems(rawText),
        rawNormalized: normalizeFrWord(rawText)
      };
    });

    let lastM = 0;
    return tokens.map(token => {
      const normToken = normalizeFrWord(token);
      if (!normToken || normToken.length <= 1) return null;

      const isStopWord = FRENCH_STOP_WORDS.has(normToken);
      const candidates = [];
      const tokenStem5 = normToken.slice(0, Math.min(normToken.length, 5));

      cleanMots.forEach((cm, mIndex) => {
        if (isStopWord) {
          if (cm.words.has(normToken) && cm.words.size <= 2) {
            candidates.push({ index: mIndex, mot: cm.mot, priority: 3 });
          }
        } else {
          if (cm.words.has(normToken) || cm.words.has(tokenStem5)) {
            candidates.push({ index: mIndex, mot: cm.mot, priority: 1 });
          } else if (normToken.length >= 4 && cm.rawNormalized.includes(normToken.slice(0, 4))) {
            candidates.push({ index: mIndex, mot: cm.mot, priority: 2 });
          }
        }
      });

      if (candidates.length > 0) {
        candidates.sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          return Math.abs(a.index - lastM) - Math.abs(b.index - lastM);
        });
        lastM = candidates[0].index;
        return candidates[0].mot;
      }
      return null;
    });
  }, [p]);

  const renderFluentFrenchText = (modePrefix) => {
    if (!p || !p.texte_integral || !p.texte_integral.francais) return null;
    const tokens = p.texte_integral.francais.split(/\s+/);

    return tokens.map((token, idx) => {
      const { prefix, word, suffix } = parseToken(token);
      const wordId = `${modePrefix}-p${pIndex}-fluent-${idx}`;
      const matchedWord = fluentMapping[idx];
      const matchedWordKey = matchedWord ? `${pIndex}-${matchedWord.id}` : null;
      const isHovered = matchedWordKey && hoveredWordId === matchedWordKey;
      const isPopupSelected = popup && popup.show && popup.paragraphIndex === pIndex && matchedWord && popup.word && popup.word.id === matchedWord.id;

      const handlePointerDown = (e) => {
        e.preventDefault();
        const wordObj = matchedWord || {
          id: `fluent-${word.toLowerCase().replace(/[^\w]/g, "")}-${idx}`,
          hebreu_voyelles: "—",
          francais_mot: word,
          expression_contexte: ""
        };
        onWordClick(wordObj, wordId, pIndex);
      };

      return (
        <React.Fragment key={wordId}>
          {prefix}
          <span
            ref={el => { if (el) wordRefs.current[wordId] = el; }}
            onMouseEnter={() => matchedWordKey && setHoveredWordId(matchedWordKey)}
            onMouseLeave={() => setHoveredWordId(null)}
            onPointerDown={handlePointerDown}
            className={`clickable-word inline-block px-0.5 rounded cursor-pointer transition-colors border-b-2 ${
              isHovered || isPopupSelected
                ? 'text-amber-500 bg-amber-500/10 border-amber-500 font-semibold'
                : 'text-zinc-200 hover:bg-amber-500/10 border-transparent'
            }`}
          >
            {word}
          </span>
          {suffix}{' '}
        </React.Fragment>
      );
    });
  };

  return (
    <div id={`seif-card-${pIndex}`} className="space-y-4">
      {/* Sujet Section Banner */}
      {isFirstOfSubject && currentSubjectTitle && (
        <div 
          className={`bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-2 text-xs sticky top-[125px] z-10 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out ${
            isToolbarVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px] bg-emerald-500/20 px-2 py-0.5 rounded">
              Sujet
            </span>
            <span className="text-zinc-100 font-semibold text-sm">
              {currentSubjectTitle}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            {availableSeifCount} Seïf{availableSeifCount > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Sefaria Halakha Card */}
      <div
        onClick={() => onParagraphChange(pIndex)}
        className={`transition-all duration-500 space-y-6 relative py-2 ${
          isSelected
            ? 'opacity-100'
            : 'opacity-40 hover:opacity-70'
        }`}
      >
        {/* Top Card Header Indicator */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-mono font-bold text-amber-500/90 uppercase tracking-widest shrink-0">
              Seïf {p.seif || (pIndex + 1)}
            </span>
            {getSeifTitle(p) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTitleExpanded(!isTitleExpanded);
                }}
                className={`seif-title-btn text-xs font-medium text-amber-200/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-left transition-all ${
                  isTitleExpanded 
                    ? "rounded-xl whitespace-normal break-words z-20 relative shadow-xl shadow-amber-900/20" 
                    : "rounded-full truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                }`}
              >
                {getSeifTitle(p)}
              </button>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(pIndex);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all ${
              isFav ? "bg-amber-500/10 border-amber-500/50 text-amber-500" : "bg-zinc-800 border-zinc-700/80 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon name="star" className={`w-3.5 h-3.5 ${isFav ? "text-amber-500 fill-amber-500" : ""}`} />
            <span>{isFav ? "Sauvegardé" : "Favori"}</span>
          </button>
        </div>

        {/* Mode 1: HEBREU SANS VOYELLES */}
        {readingMode === 1 && (
          <div className="font-hebrew-serif leading-relaxed text-right tracking-wide select-none" dir="rtl" style={{ fontSize: `${fontSize + 3}px` }}>
            {(p.mots_alignes || []).map((word, idx) => {
              const wordId = `m1-p${pIndex}-${word.id}-${idx}`;
              const hoverKey = `${pIndex}-${word.id}`;
              const isHovered = hoveredWordId === hoverKey;
              const isPopupSelected = popup && popup.show && popup.paragraphIndex === pIndex && popup.word && popup.word.id === word.id;
              const isKeyMatched = searchQuery.trim() && (word.hebreu_brut || '').toLowerCase().includes(searchQuery.toLowerCase().trim());
              return (
                <span
                  key={wordId}
                  ref={el => { if (el) wordRefs.current[wordId] = el; }}
                  onMouseEnter={() => setHoveredWordId(hoverKey)}
                  onMouseLeave={() => setHoveredWordId(null)}
                  onPointerDown={(e) => { e.preventDefault(); onWordClick(word, wordId, pIndex); }}
                  className={`clickable-word inline-block px-1.5 py-0.5 mx-0.5 rounded cursor-pointer transition-colors border-b-2 ${
                    isHovered || isPopupSelected ? 'text-amber-500 bg-amber-500/10 border-amber-500 font-semibold' : isKeyMatched ? 'bg-amber-500/20 text-yellow-200 border-amber-500/50' : 'text-zinc-100 hover:bg-amber-500/10 border-transparent'
                  }`}
                >
                  {word.hebreu_brut || word.hebreu_voyelles || word.mot_hebreu}
                </span>
              );
            })}
          </div>
        )}

        {/* Mode 2: NIKOUD */}
        {readingMode === 2 && (
          <div className="font-hebrew-serif leading-relaxed text-right tracking-wide select-none" dir="rtl" style={{ fontSize: `${fontSize + 4}px` }}>
            {(p.mots_alignes || []).map((word, idx) => {
              const wordId = `m2-p${pIndex}-${word.id}-${idx}`;
              const hoverKey = `${pIndex}-${word.id}`;
              const isHovered = hoveredWordId === hoverKey;
              const isPopupSelected = popup && popup.show && popup.paragraphIndex === pIndex && popup.word && popup.word.id === word.id;
              const isKeyMatched = searchQuery.trim() && ((word.hebreu_voyelles || word.mot_hebreu || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) || (word.hebreu_brut || '').toLowerCase().includes(searchQuery.toLowerCase().trim()));
              return (
                <span
                  key={wordId}
                  ref={el => { if (el) wordRefs.current[wordId] = el; }}
                  onMouseEnter={() => setHoveredWordId(hoverKey)}
                  onMouseLeave={() => setHoveredWordId(null)}
                  onPointerDown={(e) => { e.preventDefault(); onWordClick(word, wordId, pIndex); }}
                  className={`clickable-word inline-block px-1.5 py-0.5 mx-0.5 rounded cursor-pointer transition-colors border-b-2 ${
                    isHovered || isPopupSelected ? 'text-amber-500 bg-amber-500/10 border-amber-500 font-semibold' : isKeyMatched ? 'bg-amber-500/20 text-yellow-200 border-amber-500/50' : 'text-zinc-100 hover:bg-amber-500/10 border-transparent'
                  }`}
                >
                  {word.hebreu_voyelles || word.mot_hebreu || word.hebreu_brut}
                </span>
              );
            })}
          </div>
        )}

        {/* Mode 3: BILINGUE */}
        {readingMode === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block text-right select-none">Hébreu (עִבְרִית)</span>
              <div className="font-hebrew-serif leading-relaxed text-right tracking-wide pb-2" dir="rtl" style={{ fontSize: `${fontSize + 2}px` }}>
                {(p.mots_alignes || []).map((word, idx) => {
                  const wordId = `m3-heb-p${pIndex}-${word.id}-${idx}`;
                  const hoverKey = `${pIndex}-${word.id}`;
                  const isHovered = hoveredWordId === hoverKey;
                  const isPopupSelected = popup && popup.show && popup.paragraphIndex === pIndex && popup.word && popup.word.id === word.id;
                  const isKeyMatched = searchQuery.trim() && ((word.hebreu_voyelles || word.mot_hebreu || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) || (word.hebreu_brut || '').toLowerCase().includes(searchQuery.toLowerCase().trim()));
                  return (
                    <span
                      key={wordId}
                      ref={el => { if (el) wordRefs.current[wordId] = el; }}
                      onMouseEnter={() => setHoveredWordId(hoverKey)}
                      onMouseLeave={() => setHoveredWordId(null)}
                      onPointerDown={() => onWordClick(word, wordId, pIndex)}
                      className={`clickable-word inline-block px-1.5 py-0.5 mx-0.5 rounded cursor-pointer transition-colors border-b-2 ${
                        isHovered || isPopupSelected ? 'text-amber-500 bg-amber-500/10 border-amber-500 font-semibold' : isKeyMatched ? 'bg-amber-500/20 text-yellow-200 border-amber-500/50' : 'text-zinc-100 hover:bg-amber-500/10 border-transparent'
                      }`}
                    >
                      {word.hebreu_voyelles || word.mot_hebreu || word.hebreu_brut}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block select-none">Français (Traduction Fluide)</span>
              <div className="leading-relaxed tracking-normal font-sans" style={{ fontSize: `${fontSize - 2}px` }}>
                {renderFluentFrenchText('m3-fr')}
              </div>
            </div>
          </div>
        )}

        {/* Mode 4: FRANÇAIS */}
        {readingMode === 4 && (
          <div className="leading-relaxed tracking-normal font-sans text-zinc-200 space-y-4" style={{ fontSize: `${fontSize - 1}px` }}>
            <div>
              {renderFluentFrenchText('m4')}
            </div>
          </div>
        )}

      </div>
    </div>
  );
});

const cleanSujetTitle = (str) => {
  if (!str) return 'Général';
  return str
    .replace(/\s*\([^)]*yalkut\.info[^)]*\)/gi, '')
    .replace(/\s*\([^)]*Texte Officiel[^)]*\)/gi, '')
    .replace(/^Chapitre\s+\d+\s*[-–:]\s*/i, '')
    .trim();
};

// ─── Composant Principal ReaderScreen ────────────────────────────────────────
const ReaderScreen = ({
  bookTitle,
  bookSubtitle,
  chapterTitle,
  paragraphs = [],
  currentParagraphIndex = 0,
  onParagraphChange,
  onBackToLibrary,
  favorites = [],
  onToggleFavorite,
  books = [],
  activeBookId,
  onSelectBook
}) => {
  const [readingMode, setReadingMode] = useState(3); // 1: HEB, 2: NIKOUD, 3: BILINGUE, 4: FRANÇAIS
  const [fontSize, setFontSize] = useState(18);
  const [hoveredWordId, setHoveredWordId] = useState(null);
  const [popup, setPopup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSubjectTitle, setSelectedSubjectTitle] = useState('ALL');

  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  const containerRef = useRef(null);
  const wordRefs = useRef({});

  useEffect(() => {
    setPopup(null);
  }, [currentParagraphIndex, readingMode, selectedSubjectTitle]);

  useEffect(() => {
    setSelectedSubjectTitle('ALL');
  }, [activeBookId]);

  useEffect(() => {
    const handleScrollVisibility = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setIsToolbarVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }
      
      if (currentScrollY > lastScrollY.current + 10) {
        setIsToolbarVisible(false);
        lastScrollY.current = currentScrollY;
      } else if (currentScrollY < lastScrollY.current - 20) {
        setIsToolbarVisible(true);
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScrollVisibility, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollVisibility);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popup && popup.show) {
        const target = e.target;
        if (!target.closest(".clickable-word") && !target.closest(".popup-container")) {
          setPopup(null);
        }
      }
    };
    const handleScroll = () => {
      if (popup && popup.show) {
        setPopup(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [popup]);

  // Group unique subjects strictly & deduplicate
  const uniqueSubjects = React.useMemo(() => {
    const map = new Map();
    (paragraphs || []).forEach((p, index) => {
      const rawTitle = p.sujet_fr || p.sujet || 'Général';
      const title = cleanSujetTitle(rawTitle);
      if (!map.has(title)) {
        map.set(title, {
          title,
          sujet_he: p.sujet_he || '',
          firstIndex: index,
          items: [{ paragraph: p, index }]
        });
      } else {
        map.get(title).items.push({ paragraph: p, index });
      }
    });
    return Array.from(map.values());
  }, [paragraphs]);

  // Filtered items & available Seif options
  const { displayedItems, availableSeifOptions } = React.useMemo(() => {
    if (selectedSubjectTitle === 'ALL') {
      const allItems = paragraphs.map((p, index) => ({ paragraph: p, index }));
      return {
        displayedItems: allItems,
        availableSeifOptions: allItems.map(item => ({
          seif: item.paragraph.seif || (item.index + 1),
          index: item.index,
          title: getSeifTitle(item.paragraph)
        }))
      };
    }
    const group = uniqueSubjects.find(s => s.title === selectedSubjectTitle);
    if (group) {
      return {
        displayedItems: group.items,
        availableSeifOptions: group.items.map(item => ({
          seif: item.paragraph.seif || (item.index + 1),
          index: item.index,
          title: getSeifTitle(item.paragraph)
        }))
      };
    }
    return { displayedItems: [], availableSeifOptions: [] };
  }, [paragraphs, selectedSubjectTitle, uniqueSubjects]);

  const handleWordClick = (word, wordId, pIndex) => {
    const wordElement = wordRefs.current[wordId];
    if (!wordElement) return;

    const wordRect = wordElement.getBoundingClientRect();
    const popupWidth = 240;
    const margin = 10;

    let left = wordRect.left + wordRect.width / 2;
    const top = wordRect.top - 6;

    const halfWidth = popupWidth / 2;
    const viewportWidth = window.innerWidth;
    left = Math.max(halfWidth + margin, Math.min(left, viewportWidth - halfWidth - margin));

    setPopup({
      word,
      paragraphIndex: pIndex,
      left,
      top,
      show: true,
    });
  };

  const searchOccurrences = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return paragraphs.map((p, idx) => {
      const hb = (p.texte_integral.hebreu_sans_voyelles || '').toLowerCase();
      const h_avec = (p.texte_integral.hebreu_avec_voyelles || '').toLowerCase();
      const fr = (p.texte_integral.francais || '').toLowerCase();
      const inHebrew = hb.includes(query) || h_avec.includes(query);
      const inFrench = fr.includes(query);
      const inWords = (p.mots_alignes || []).some(
        w => (w.hebreu_brut || '').toLowerCase().includes(query) ||
          (w.francais_mot || '').toLowerCase().includes(query) ||
          (w.expression_contexte || '').toLowerCase().includes(query)
      );
      return { index: idx, matches: inHebrew || inFrench || inWords, paragraph: p };
    }).filter(item => item.matches);
  };

  const results = searchOccurrences();

  // Windowing state: load initial 5 items and expand dynamically
  const [visibleCount, setVisibleCount] = useState(5);

  const currentIndexRef = useRef(currentParagraphIndex);

  useEffect(() => {
    currentIndexRef.current = currentParagraphIndex;
  }, [currentParagraphIndex]);

  useEffect(() => {
    let scrollTimeout;
    const handleActiveSeifOnScroll = () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      
      scrollTimeout = requestAnimationFrame(() => {
        const cards = document.querySelectorAll('[id^="seif-card-"]');
        
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const rect = card.getBoundingClientRect();
          
          // Consider a card active if its top is above 40% of the screen height,
          // and its bottom is below the header area (~150px)
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 150) {
            const index = parseInt(card.id.replace('seif-card-', ''), 10);
            if (!isNaN(index) && index !== currentIndexRef.current) {
              onParagraphChange(index);
            }
            break; // Stop after finding the first active one
          }
        }
      });
    };

    window.addEventListener('scroll', handleActiveSeifOnScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleActiveSeifOnScroll);
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    };
  }, [onParagraphChange]);

  useEffect(() => {
    setVisibleCount(5);
  }, [selectedSubjectTitle, activeBookId]);

  const scrollToSeifCard = (idx) => {
    onParagraphChange(idx);
    const pos = displayedItems.findIndex(item => item.index === idx);
    if (pos !== -1 && pos >= visibleCount) {
      setVisibleCount(pos + 5);
    }
    setTimeout(() => {
      const el = document.getElementById(`seif-card-${idx}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLibrary}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs border border-zinc-700/50 cursor-pointer"
            >
              <Icon name="arrowLeft" className="w-4 h-4" />
              <span>Bibliothèque</span>
            </button>
            <div className="h-6 w-[1px] bg-zinc-700 hidden sm:block"></div>
            <div>
              <h1 className="font-medium tracking-tight text-zinc-200 text-sm md:text-base font-serif">
                {bookTitle} : {chapterTitle}
              </h1>
              <p className="text-[10px] text-zinc-500 hidden md:block italic">{bookSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
            {/* Search */}
            <div className="relative flex-grow md:w-64 max-w-xs">
              <span className="absolute left-3 top-2.5 text-zinc-500">
                <Icon name="search" className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher une halakha..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                className="bg-zinc-800/50 border border-zinc-700 rounded-full py-1.5 pl-10 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 w-full text-zinc-300 placeholder-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-2.5 text-[10px] text-zinc-500 hover:text-zinc-300 uppercase font-bold"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
              <button onClick={() => setFontSize(p => Math.max(14, p - 2))} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                <Icon name="zoomOut" className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-zinc-300 px-1">{fontSize}px</span>
              <button onClick={() => setFontSize(p => Math.min(28, p + 2))} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                <Icon name="zoomIn" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearchResults && searchQuery.trim() && (
        <div className="bg-zinc-950 border-b border-zinc-850 shadow-xl overflow-hidden z-20 sticky top-15 max-h-64 overflow-y-auto px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1">
                ✦ Résultats de recherche ({results.length})
              </span>
              <button onClick={() => setShowSearchResults(false)} className="text-[10px] text-zinc-400 hover:text-white uppercase font-bold">Fermer</button>
            </div>
            {results.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 italic">Aucun résultat trouvé pour "{searchQuery}".</p>
            ) : (
              <div className="space-y-1.5 pt-1">
                {results.map((res) => (
                  <button
                    key={res.index}
                    onClick={() => {
                      scrollToSeifCard(res.index);
                      setShowSearchResults(false);
                    }}
                    className={`w-full text-left p-2 rounded text-xs transition-all flex items-start gap-2.5 ${res.index === currentParagraphIndex ? "bg-amber-500/10 border border-amber-500/30 text-amber-200" : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"}`}
                  >
                    <span className="font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-bold">Seïf {res.paragraph.seif || (res.index + 1)}</span>
                    <div className="flex-grow min-w-0">
                      <p className="font-serif text-[11px] truncate text-right text-zinc-400 mb-0.5" dir="rtl">{res.paragraph.texte_integral.hebreu_sans_voyelles}</p>
                      <p className="italic text-[10px] text-zinc-500 truncate">{res.paragraph.texte_integral.francais}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toolbar Sub-Navigation */}
      <section 
        className={`bg-zinc-900/30 border-b border-zinc-800/80 px-6 py-3 sticky top-[69px] z-10 transition-transform duration-300 ease-in-out ${
          isToolbarVisible ? 'translate-y-0' : '-translate-y-[150%]'
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Chapitre Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Chapitre</label>
              <select
                value={activeBookId || ''}
                onChange={(e) => onSelectBook && onSelectBook(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-xs font-semibold text-amber-400 focus:outline-none cursor-pointer"
              >
                {books.filter(b => b.isUnlocked).map(b => (
                  <option key={b.id} value={b.id}>
                    {b.chapters && b.chapters[0] ? b.chapters[0].title : b.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Sujet / Thème Dropdown strictly deduplicated */}
            <div className="flex items-center gap-3">
              <label className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Sujet / Thème</label>
              <select
                value={selectedSubjectTitle === 'ALL' && uniqueSubjects.length === 1 ? uniqueSubjects[0]?.title : selectedSubjectTitle}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedSubjectTitle(val);
                  if (val !== 'ALL') {
                    const group = uniqueSubjects.find(s => s.title === val);
                    if (group) scrollToSeifCard(group.firstIndex);
                  }
                }}
                className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-xs font-semibold text-emerald-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer max-w-xs truncate"
              >
                {uniqueSubjects.length > 1 && (
                  <option value="ALL">Tous les sujets ({paragraphs.length} Seifim)</option>
                )}
                {uniqueSubjects.map((s, idx) => (
                  <option key={idx} value={s.title}>
                    {s.title} ({s.items.length} Seïf{s.items.length > 1 ? 's' : ''})
                  </option>
                ))}
              </select>
            </div>

            {/* Paragraphe Dropdown filtered strictly to selected subject */}
            <div className="flex items-center gap-3">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Paragraphe</label>
              <select
                value={currentParagraphIndex}
                onChange={(e) => scrollToSeifCard(Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
              >
                {availableSeifOptions.map((opt) => (
                  <option key={opt.index} value={opt.index}>
                    Seïf {opt.seif}{opt.title ? ` — ${opt.title}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reading Mode Selector */}
          <div className="flex bg-zinc-800 rounded-lg p-1 border border-zinc-700 self-start lg:self-auto shadow-inner">
            {[
              { id: 1, label: "HEB" },
              { id: 2, label: "NIKOUD" },
              { id: 3, label: "BILINGUE" },
              { id: 4, label: "FRANÇAIS" }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setReadingMode(mode.id)}
                className={`px-3 md:px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${readingMode === mode.id ? "bg-amber-600 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Previous / Next buttons */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              onClick={() => scrollToSeifCard(Math.max(0, currentParagraphIndex - 1))}
              disabled={currentParagraphIndex === 0}
              className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 disabled:opacity-30 cursor-pointer"
            >
              <Icon name="chevronLeft" className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollToSeifCard(Math.min(paragraphs.length - 1, currentParagraphIndex + 1))}
              disabled={currentParagraphIndex === paragraphs.length - 1}
              className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 disabled:opacity-30 cursor-pointer"
            >
              <Icon name="chevronRight" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Sefaria-style Continuous Reader Stream */}
      <main className="flex-grow flex flex-col items-center justify-start pt-4 pb-8 px-4 md:px-6 relative">
        <div ref={containerRef} className="w-full max-w-2xl space-y-10 flex flex-col relative min-h-[350px]">

          {/* Word Popup Portal */}
          {popup && popup.show && createPortal(
            <div
              style={{
                position: "fixed",
                left: popup.left,
                top: popup.top,
                transform: "translate(-50%, -100%)",
              }}
              className="z-50 w-fit min-w-[200px] max-w-[280px] md:max-w-[340px] popup-container"
            >
              <div className="bg-zinc-950/95 border border-amber-500/80 backdrop-blur-md shadow-2xl rounded-xl p-3.5 relative mb-2.5 text-zinc-100 font-sans text-xs space-y-2.5 ring-1 ring-amber-500/20">
                {/* Mot principal */}
                <div className="flex justify-between items-center gap-3 pb-2 border-b border-zinc-800/80">
                  <div className="text-right flex-grow min-w-0" dir="rtl">
                    <p className="font-hebrew-serif font-bold text-amber-400 text-xl tracking-wide leading-none">
                      {popup.word.hebreu_voyelles || popup.word.hebreu_brut}
                    </p>
                  </div>
                  <div className="text-left flex-grow">
                    <p className="text-zinc-100 font-semibold text-sm leading-tight">
                      {popup.word.francais_mot || (popup.word.id && String(popup.word.id).startsWith("fluent-") ? "Traduction" : "—")}
                    </p>
                  </div>
                </div>

                {/* Bloc Infinitif (Verbes) pour Débutants */}
                {popup.word.infinitif && (() => {
                  const infStr = popup.word.infinitif;
                  const parts = infStr.includes("=") 
                    ? infStr.split("=").map(s => s.trim()) 
                    : [infStr, ""];
                  const hebInf = parts[0];
                  const frInf = parts[1] || "";

                  return (
                    <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/40 rounded-lg p-2.5 space-y-1 shadow-sm">
                      <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>⚡ Forme Infinitive (Verbe)</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        {hebInf && (
                          <span className="font-hebrew-serif text-amber-200 text-base font-bold tracking-wide" dir="rtl">
                            {hebInf}
                          </span>
                        )}
                        {frInf && (
                          <span className="text-zinc-100 font-semibold text-xs italic bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-700/80">
                            {frInf}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Bloc Note d'apprentissage en français (si disponible) */}
                {popup.word.expression_contexte && popup.word.expression_contexte !== popup.word.francais_mot && (() => {
                  const ctxText = popup.word.expression_contexte;
                  const isHebrewCtx = /[\u0590-\u05FF]/.test(ctxText);
                  if (isHebrewCtx) return null; // Ne pas afficher l'extrait hébreu dans la pop-up pour les débutants

                  return (
                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        <span>💡 Note d'apprentissage :</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug italic">
                        {ctxText}
                      </p>
                    </div>
                  );
                })()}

                {/* Flèche sous la pop-up */}
                <div className="absolute h-2.5 w-2.5 bg-zinc-950 border-r border-b border-amber-500/80 left-1/2 -bottom-1.5 -translate-x-1/2 rotate-45 shadow-md" />
              </div>
            </div>,
            document.body
          )}

          {displayedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center flex-grow">
              <Icon name="alert" className="w-10 h-10 text-amber-500 mb-3 animate-pulse" />
              <p className="text-sm text-zinc-400">Aucune halakha trouvée pour ce sujet.</p>
            </div>
          ) : (
            <>
              {displayedItems.slice(0, visibleCount).map((item, itemIdx) => {
                const p = item.paragraph;
                const pIndex = item.index;
                const isFav = favorites.some(fav => fav.paragraphIndex === pIndex);
                const isSelected = pIndex === currentParagraphIndex;
                const currentSubjectTitle = (p.sujet_fr || p.sujet || '').trim();

                const isFirstOfSubject = itemIdx === 0 || (
                  displayedItems[itemIdx - 1] &&
                  (displayedItems[itemIdx - 1].paragraph.sujet_fr || displayedItems[itemIdx - 1].paragraph.sujet || '').trim() !== currentSubjectTitle
                );

                return (
                  <ParagraphCard
                    key={pIndex}
                    p={p}
                    pIndex={pIndex}
                    isSelected={isSelected}
                    isFav={isFav}
                    readingMode={readingMode}
                    fontSize={fontSize}
                    searchQuery={searchQuery}
                    hoveredWordId={hoveredWordId}
                    popup={popup}
                    isFirstOfSubject={isFirstOfSubject}
                    currentSubjectTitle={currentSubjectTitle}
                    availableSeifCount={availableSeifOptions.length}
                    onParagraphChange={onParagraphChange}
                    onToggleFavorite={onToggleFavorite}
                    onWordClick={handleWordClick}
                    setHoveredWordId={setHoveredWordId}
                    wordRefs={wordRefs}
                    isToolbarVisible={isToolbarVisible}
                  />
                );
              })}

              {visibleCount < displayedItems.length && (
                <div className="flex flex-col items-center py-6">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 10)}
                    className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-bold border border-zinc-700/80 shadow-lg cursor-pointer transition-all flex items-center gap-2"
                  >
                    <span>Charger les lois suivantes ({displayedItems.length - visibleCount} restantes)</span>
                    <Icon name="chevronDown" className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="w-full max-w-2xl px-6 py-3 border-t border-zinc-850 bg-zinc-900/10 text-[9px] text-zinc-500 uppercase tracking-widest font-bold flex flex-col md:flex-row items-center justify-between gap-2 mt-10 select-none">
          <div className="flex items-center gap-2">
            <Icon name="cap" className="w-4 h-4 text-amber-500/80" />
            <span>Étude bilingue progressive style Sefaria (Mémorisé Ultra-Fluide)</span>
          </div>
          <span>{bookTitle} : {chapterTitle}</span>
        </div>
      </main>
    </div>
  );
};

export default ReaderScreen;
