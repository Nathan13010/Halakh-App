import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import ConfettiCanvas from './ConfettiCanvas';
import { LEARNING_LEVELS, LEVEL_1_QUIZZES, BADGES } from '../data/learningData';

const LearningScreen = ({ xp = 0, onAddXp, streak = 1, isDailyCompleted, onIncreaseStreak }) => {
  const [activeQuizLesson, setActiveQuizLesson] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Halakha du jour specific states
  const [isMinimized, setIsMinimized] = useState(isDailyCompleted);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [quizStatus, setQuizStatus] = useState('idle'); // 'idle' | 'correct' | 'wrong'
  const [dailySelectedOption, setDailySelectedOption] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Progress states stored in localStorage
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem("mishne_mikra_completed_lessons");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState(() => {
    try {
      const saved = localStorage.getItem("mishne_mikra_unlocked_badges");
      return saved ? JSON.parse(saved) : ["lion-juda"];
    } catch { return ["lion-juda"]; }
  });

  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryXpEarned, setVictoryXpEarned] = useState(0);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  useEffect(() => {
    if (isDailyCompleted) {
      setIsMinimized(true);
    }
  }, [isDailyCompleted]);

  // Sync completed lessons
  useEffect(() => {
    localStorage.setItem("mishne_mikra_completed_lessons", JSON.stringify(completedLessons));
  }, [completedLessons]);

  // Sync unlocked badges
  useEffect(() => {
    localStorage.setItem("mishne_mikra_unlocked_badges", JSON.stringify(unlockedBadgeIds));
  }, [unlockedBadgeIds]);

  // Halakha du jour handlers
  const handleDailySelectOption = (index) => {
    setDailySelectedOption(index);
    if (index === 1) {
      setQuizStatus('correct');
      setShowConfetti(true);
      if (onIncreaseStreak) onIncreaseStreak();
      setIsMinimized(true);
    } else {
      setQuizStatus('wrong');
      setShowConfetti(false);
    }
  };

  const handleResetDailyModal = () => {
    setQuizStatus('idle');
    setDailySelectedOption(null);
  };

  const handleCloseDailyModal = () => {
    setIsDailyModalOpen(false);
    handleResetDailyModal();
  };

  // Start a Quiz Lesson
  const handleStartLesson = (lesson) => {
    setActiveQuizLesson(lesson);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  // Submit Answer for current Question
  const handleVerifyAnswer = () => {
    if (selectedOption === null || !activeQuizLesson) return;
    const currentQ = activeQuizLesson.questions[currentQuestionIndex];
    const correct = selectedOption === currentQ.correctIndex;
    
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct && onAddXp) {
      onAddXp(currentQ.xp || 15);
    }
  };

  // Move to next question or complete lesson
  const handleNextQuestion = () => {
    if (!activeQuizLesson) return;

    if (currentQuestionIndex < activeQuizLesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
    } else {
      // Lesson Completed!
      const lessonId = activeQuizLesson.lessonId;
      if (!completedLessons.includes(lessonId)) {
        setCompletedLessons(prev => [...prev, lessonId]);
      }
      
      const totalBonus = 50;
      if (onAddXp) onAddXp(totalBonus);
      setVictoryXpEarned(totalBonus + activeQuizLesson.questions.length * 15);
      
      // Check Badge unlocks
      if (!unlockedBadgeIds.includes("reveil-matin")) {
        setUnlockedBadgeIds(prev => [...prev, "reveil-matin"]);
      }

      setTriggerConfetti(true);
      setShowVictoryModal(true);
      setActiveQuizLesson(null);
    }
  };

  // Overall chapter completion percentage
  const totalSiman1Lessons = LEVEL_1_QUIZZES.length;
  const completedSiman1Count = completedLessons.filter(id => id <= totalSiman1Lessons).length;
  const siman1ProgressPercent = Math.round((completedSiman1Count / totalSiman1Lessons) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 select-none overflow-hidden relative">
      {showConfetti && <ConfettiCanvas onComplete={() => setShowConfetti(false)} />}
      
      {/* Top Gamification Status Bar */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-5 py-3 flex justify-between items-center shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {/* XP Badge */}
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 text-xs shadow-inner">
            <span className="text-base">⚡</span>
            <span>{xp} XP</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 font-bold bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/30 text-xs shadow-inner">
            <span className="text-base">🔥</span>
            <span>{streak} Jours</span>
          </div>
        </div>

        {/* Badges Drawer Button */}
        <button
          onClick={() => setShowBadgesModal(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <span className="text-sm">🏆</span>
          <span className="hidden sm:inline">Badges</span>
          <span className="bg-amber-500 text-zinc-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            {unlockedBadgeIds.length}
          </span>
        </button>
      </div>

      {/* Chapter Mastery Header */}
      <div className="bg-gradient-to-r from-zinc-100 via-amber-100/30 to-zinc-100 dark:from-zinc-900 dark:via-amber-950/20 dark:to-zinc-900 border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Siman 1</span>
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">• Lois du Réveil Matinal</span>
        </div>
        <div className="flex items-center gap-3 w-1/3 max-w-[200px]">
          <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${siman1ProgressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">{siman1ProgressPercent}%</span>
        </div>
      </div>

      {/* Main Winding Progression Path (Duolingo Style) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 relative flex flex-col items-center custom-scrollbar">
        {/* Central Winding Path Line */}
        <div className="absolute top-10 bottom-10 w-2.5 bg-gradient-to-b from-amber-500/40 via-blue-500/20 to-zinc-300 dark:to-zinc-800 left-1/2 -translate-x-1/2 rounded-full pointer-events-none" />

        {/* Halakha du Jour Section */}
        <div className="z-10 w-full max-w-md mb-10">
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
                  onClick={() => { handleResetDailyModal(); setIsDailyModalOpen(true); }}
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
        </div>

        {/* Level Chapters & Nodes */}
        <div className="z-10 w-full max-w-md space-y-10 py-4">
          
          {/* Active Level 1: Siman 1 (Seifim 1 à 5) */}
          <div className="bg-white/95 dark:bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Niveau 1 • Siman 1 (Seifim 1-5)
                </span>
                <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-1.5">Les Fondements du Réveil</h3>
              </div>
              <div className="text-3xl">🦁</div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Complète les 4 leçons interactives du Siman 1 pour apprendre à vaincre la paresse au réveil et agir avec la force du lion.
            </p>

            {/* Sub-Lesson Nodes in Winding Path */}
            <div className="space-y-6 flex flex-col items-center">
              {LEVEL_1_QUIZZES.map((quiz, idx) => {
                const isCompleted = completedLessons.includes(quiz.lessonId);
                const isUnlocked = idx === 0 || completedLessons.includes(LEVEL_1_QUIZZES[idx - 1].lessonId);
                
                // Horizontal offset for Duolingo winding effect
                const offsetStyles = [
                  "self-center",
                  "self-end mr-6",
                  "self-center",
                  "self-start ml-6"
                ][idx % 4];

                return (
                  <div key={quiz.lessonId} className={`flex flex-col items-center ${offsetStyles} group`}>
                    <div className="text-center mb-1.5">
                      <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-950 px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        Leçon {quiz.lessonId} : Seïf {quiz.seif}
                      </span>
                    </div>

                    <button
                      onClick={() => isUnlocked && handleStartLesson(quiz)}
                      disabled={!isUnlocked}
                      className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg border-2 cursor-pointer
                        ${isCompleted 
                          ? "bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-300 text-zinc-950 shadow-amber-500/30 scale-100 hover:scale-105" 
                          : isUnlocked 
                            ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-400 text-white shadow-blue-500/30 ring-4 ring-blue-500/20 animate-pulse hover:scale-105" 
                            : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 shadow-none cursor-not-allowed"
                        }`}
                    >
                      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)] pointer-events-none" />

                      {isCompleted ? (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">⭐</span>
                          <span className="text-[9px] font-black uppercase text-zinc-950 tracking-tighter">Réussi</span>
                        </div>
                      ) : isUnlocked ? (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">⚡</span>
                          <span className="text-[9px] font-black uppercase tracking-tighter text-blue-100">Jouer</span>
                        </div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      )}
                    </button>

                    <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mt-2 max-w-[140px] text-center truncate">
                      {quiz.title.split(":")[1] || quiz.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Locked Future Levels (Siman 2, 3, 4, 6) */}
          {LEARNING_LEVELS.slice(1).map((lvl) => (
            <div key={lvl.id} className="bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 opacity-60 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xl text-zinc-500">
                    🔒
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                      {lvl.subtitle}
                    </span>
                    <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-300">{lvl.title}</h4>
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
                  Verrouillé
                </span>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* QUIZ INTERACTIVE MODAL (Duolingo Style) */}
      {activeQuizLesson && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh]">
            
            {/* Top Modal Header with Progress Bar */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 shrink-0">
              <div className="flex items-center gap-3 flex-1 mr-4">
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / activeQuizLesson.questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
                  {currentQuestionIndex + 1}/{activeQuizLesson.questions.length}
                </span>
              </div>

              <button
                onClick={() => setActiveQuizLesson(null)}
                className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Active Question Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              {(() => {
                const q = activeQuizLesson.questions[currentQuestionIndex];
                return (
                  <>
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        {activeQuizLesson.title}
                      </span>

                      {q.imageUrl && (
                        <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 shadow-lg my-3 aspect-video bg-zinc-100 dark:bg-zinc-950">
                          <img 
                            src={q.imageUrl} 
                            alt="Illustration scenario" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      
                      {q.type === 'match' && q.hebrewWord && (
                        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-center my-3">
                          <span className="text-2xl font-hebrew-serif font-bold text-amber-700 dark:text-amber-400">{q.hebrewWord}</span>
                        </div>
                      )}

                      <h3 className="text-base sm:text-lg font-serif font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed pt-2">
                        {q.scenario || q.question}
                      </h3>
                    </div>

                    {/* Options List */}
                    <div className="space-y-3 pt-2">
                      {q.options.map((optText, optIdx) => {
                        const isSelected = selectedOption === optIdx;
                        let optionStyle = "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-800 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50";
                        
                        if (isSelected) {
                          optionStyle = "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/30";
                        }
                        if (isSubmitted && isSelected) {
                          optionStyle = isCorrect 
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40"
                            : "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-900 dark:text-red-200 ring-2 ring-red-500/40";
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isSubmitted}
                            onClick={() => setSelectedOption(optIdx)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${optionStyle}`}
                          >
                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                              isSelected 
                                ? (isSubmitted ? (isCorrect ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white') : 'bg-blue-500 border-blue-400 text-white')
                                : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-sm font-medium leading-snug pt-0.5">{optText}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Bottom Action / Feedback Bar */}
            <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0">
              {!isSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleVerifyAnswer}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg cursor-pointer ${
                    selectedOption !== null
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 scale-[1.01] active:scale-95"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  Vérifier ma réponse
                </button>
              ) : (
                <div className="space-y-4 animate-slide-up">
                  {/* Explanation Card */}
                  <div className={`p-4 rounded-2xl border ${
                    isCorrect 
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200" 
                      : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/40 text-red-900 dark:text-red-200"
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      <span>{isCorrect ? "🎉 Excellent !" : "❌ Pas tout à fait..."}</span>
                    </div>
                    <p className="text-xs leading-relaxed font-medium text-zinc-700 dark:text-zinc-300">
                      {activeQuizLesson.questions[currentQuestionIndex].explanation}
                    </p>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-base shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Continuer ➔
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

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
              <button onClick={handleCloseDailyModal} className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors">
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
                  onClick={() => handleDailySelectOption(0)}
                  disabled={quizStatus !== 'idle'}
                  className={`w-full p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                    dailySelectedOption === 0
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                      : quizStatus !== 'idle'
                        ? 'opacity-40 border-zinc-200 dark:border-zinc-800'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-500 dark:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Oui, c'est permis si c'est juste avant de manger.</span>
                    {dailySelectedOption === 0 && <span className="text-rose-500 font-bold">✕</span>}
                  </div>
                </button>

                {/* Option 1 (Vrai - Correct) */}
                <button 
                  onClick={() => handleDailySelectOption(1)}
                  disabled={quizStatus !== 'idle'}
                  className={`w-full p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                    dailySelectedOption === 1
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                      : quizStatus !== 'idle'
                        ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-500 dark:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Non, il faut utiliser sa main et prendre ce que l'on veut manger.</span>
                    {dailySelectedOption === 1 && <span className="text-emerald-500 font-bold">✓</span>}
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
                    onClick={handleCloseDailyModal}
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
                    onClick={handleResetDailyModal}
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

      {/* VICTORY CELEBRATION MODAL */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <ConfettiCanvas active={triggerConfetti} />
          
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-amber-500/50 rounded-3xl p-6 text-center space-y-6 shadow-2xl relative z-10 animate-scale-up">
            <div className="text-5xl animate-bounce">🏆</div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Leçon Complétée !</span>
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-1">Félicitations !</h2>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex justify-around items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">Points Gagnés</span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">+{victoryXpEarned} XP</span>
              </div>
              <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">Étoiles</span>
                <span className="text-xl font-black text-yellow-500">⭐⭐⭐</span>
              </div>
            </div>

            <button
              onClick={() => { setShowVictoryModal(false); setTriggerConfetti(false); }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-base shadow-xl shadow-amber-500/30 cursor-pointer active:scale-95 transition-all"
            >
              Continuer mon parcours ➔
            </button>
          </div>
        </div>
      )}

      {/* BADGES SHOWCASE MODAL */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">Mes Trophées & Badges</h3>
              </div>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {BADGES.map((b) => {
                const isUnlocked = unlockedBadgeIds.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                      isUnlocked 
                        ? "bg-amber-500/10 border-amber-500/40 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                        : "bg-zinc-100 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800/80 opacity-60"
                    }`}
                  >
                    <div className="text-3xl shrink-0">{b.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{b.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isUnlocked ? "bg-amber-500 text-zinc-950" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500"
                        }`}>
                          {isUnlocked ? "Débloqué" : `Verrouillé`}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearningScreen;
