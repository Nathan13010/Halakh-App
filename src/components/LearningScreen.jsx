import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import ConfettiCanvas from './ConfettiCanvas';
import ActivityModal from './ActivityModal';
import { useLearningSession } from '../hooks/useLearningSession';
import { getAllProgressions } from '../services/progressionTracker';
import { fetchKnowledgeForSiman } from '../services/knowledgeService';

const LearningScreen = ({ xp = 0, onAddXp, streak = 1, isDailyCompleted, onIncreaseStreak }) => {
  // Session hook
  const session = useLearningSession("siman_1", 5);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  
  // Halakha du jour specific states
  const [isMinimized, setIsMinimized] = useState(isDailyCompleted);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [quizStatus, setQuizStatus] = useState('idle'); // 'idle' | 'correct' | 'wrong'
  const [dailySelectedOption, setDailySelectedOption] = useState(null);

  // Global progress
  const [simanProgress, setSimanProgress] = useState(0);

  // Debug mode
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    // Calcul de la progression globale sur le Siman 1 (combien de KPs sont mastered)
    const calculateProgress = async () => {
      const data = await fetchKnowledgeForSiman("siman_1");
      if (data && data.knowledge_points) {
        const total = data.knowledge_points.length;
        const progressions = getAllProgressions();
        const mastered = data.knowledge_points.filter(kp => progressions[kp.id]?.status === 'mastered').length;
        setSimanProgress(Math.round((mastered / total) * 100));
      }
    };
    calculateProgress();
  }, [session.status]); // Recalcule à chaque fin de session

  useEffect(() => {
    if (session.status === 'completed') {
      setShowVictoryModal(true);
      setShowConfetti(true);
      if (onAddXp) onAddXp(session.sessionScore);
    }
  }, [session.status]);

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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 select-none overflow-hidden relative">
      {showConfetti && <ConfettiCanvas onComplete={() => setShowConfetti(false)} />}
      
      {/* Top Gamification Status Bar */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-5 py-3 flex justify-between items-center shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 text-xs shadow-inner">
            <span className="text-base">⚡</span>
            <span>{xp} XP</span>
          </div>

          <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 font-bold bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/30 text-xs shadow-inner">
            <span className="text-base">🔥</span>
            <span>{streak} Jours</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {import.meta.env.DEV && (
            <button
              onClick={() => setIsDebugMode(!isDebugMode)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                isDebugMode ? 'bg-red-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}
            >
              DEBUG
            </button>
          )}
          <button
            onClick={() => setShowBadgesModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer"
          >
            <span className="text-sm">🏆</span>
            <span className="hidden sm:inline">Badges</span>
          </button>
        </div>
      </div>

      {/* Chapter Mastery Header */}
      <div className="bg-gradient-to-r from-zinc-100 via-amber-100/30 to-zinc-100 dark:from-zinc-900 dark:via-amber-950/20 dark:to-zinc-900 border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Siman 1</span>
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">• Lois du Réveil</span>
        </div>
        <div className="flex items-center gap-3 w-1/3 max-w-[200px]">
          <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${simanProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">{simanProgress}%</span>
        </div>
      </div>

      {/* Main Path */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 relative flex flex-col items-center custom-scrollbar">
        {/* Halakha du Jour Section */}
        <div className="z-10 w-full max-w-md mb-10">
          {isMinimized ? (
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
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Le tri pendant Chabbat (Borer)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 md:p-6 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    Halakha du Jour • ~30s
                  </span>
                  {isDailyCompleted && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                      <Icon name="close" className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-2">Le tri pendant Chabbat (Borer)</h2>
                  <p className="text-sm text-white/90 leading-relaxed font-medium">
                    Il est permis de trier le "bon" du "mauvais" si c'est pour une consommation immédiate, avec la main et non un ustensile spécial.
                  </p>
                </div>

                <button 
                  onClick={() => { handleResetDailyModal(); setIsDailyModalOpen(true); }}
                  className="mt-2 w-full py-3 bg-white text-amber-600 rounded-xl font-bold shadow-lg hover:bg-zinc-50 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {isDailyCompleted ? "✓ Halakha Déjà Validée • Revoir le Quiz" : "Valider & Obtenir mon Streak 🔥"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Learning Node */}
        <div className="z-10 w-full max-w-md space-y-10 py-4">
          <div className="bg-white/95 dark:bg-zinc-900/90 border border-blue-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-blue-200 dark:border-blue-800">
              📚
            </div>
            <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Parcours Dynamique
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 px-4">
              Poursuivez votre apprentissage du Siman 1. Le système s'adapte à votre progression.
            </p>

            <button
              onClick={() => session.startSession()}
              disabled={session.status === 'loading'}
              className="w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl border-b-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 border-indigo-800 text-white active:translate-y-1 active:border-b-0"
            >
              {session.status === 'loading' ? 'Chargement...' : 'Commencer la session ➔'}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL ACTIVITÉ DYNAMIQUE */}
      {session.status === 'active' && session.currentActivity && (
        <>
          <ActivityModal 
            activity={session.currentActivity}
            feedback={session.currentFeedback}
            onSubmit={session.submitAnswer}
            onNext={session.nextActivity}
            progress={(session.currentIndex / session.totalActivities) * 100}
            onClose={() => window.location.reload()} // Quick hack pour annuler une session
            currentIndex={session.currentIndex}
            totalActivities={session.totalActivities}
          />
          {isDebugMode && session.currentDebugInfo && (
            <div className="fixed top-20 left-4 z-[100] bg-black/80 text-green-400 p-4 rounded-xl font-mono text-[10px] w-64 shadow-2xl border border-green-500/30 overflow-hidden break-words">
              <h4 className="font-bold text-white mb-2 pb-2 border-b border-white/20">DEBUG METADATA</h4>
              <div className="space-y-1">
                <p><span className="text-white/50">SIMAN:</span> siman_1</p>
                <p><span className="text-white/50">SEIF:</span> {session.currentDebugInfo.act.source_seif}</p>
                <p><span className="text-white/50">KP:</span> {session.currentDebugInfo.kp.id}</p>
                <p><span className="text-white/50">ACTIVITY ID:</span> {session.currentDebugInfo.act.activity_id}</p>
                <p><span className="text-white/50">TYPE:</span> {session.currentDebugInfo.act.rawType || session.currentDebugInfo.act.type}</p>
                <p><span className="text-white/50">LEVEL:</span> {session.currentDebugInfo.kp.learning_level}</p>
                <p><span className="text-white/50">IMPORTANCE:</span> {session.currentDebugInfo.kp.importance}</p>
                <p><span className="text-white/50">STATUS:</span> {session.currentDebugInfo.prog.status}</p>
                <p><span className="text-white/50">ATTEMPTS:</span> {session.currentDebugInfo.prog.attempts || 0}</p>
                <p><span className="text-white/50">CORRECT:</span> {session.currentDebugInfo.prog.correct || 0}</p>
                <p><span className="text-white/50">WRONG:</span> {session.currentDebugInfo.prog.wrong || 0}</p>
                <p><span className="text-white/50">STREAK:</span> {session.currentDebugInfo.prog.streak || 0}</p>
                <p><span className="text-white/50">LAST SEEN:</span> {session.currentDebugInfo.prog.last_seen ? new Date(session.currentDebugInfo.prog.last_seen).toLocaleTimeString() : 'N/A'}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Daily Quiz Modal (Legacy) */}
      {isDailyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
           {/* Modal content omitted for brevity, keeping it simple as a placeholder or using the old one */}
           <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative">
              <h2 className="font-bold mb-4">Quiz Rapide • Halakha du Jour</h2>
              <button onClick={() => handleDailySelectOption(1)} className="w-full p-4 border rounded-xl mb-2 text-left">Prendre à la main (Vrai)</button>
              <button onClick={() => handleDailySelectOption(0)} className="w-full p-4 border rounded-xl text-left">Utiliser un écumoire (Faux)</button>
              <button onClick={handleCloseDailyModal} className="mt-4 text-sm text-zinc-500 w-full text-center">Fermer</button>
           </div>
        </div>
      )}

      {/* VICTORY CELEBRATION MODAL */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <ConfettiCanvas active={true} />
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-amber-500/50 rounded-3xl p-6 text-center space-y-6 shadow-2xl relative z-10 animate-scale-up">
            <div className="text-5xl animate-bounce">🏆</div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Session Complétée !</span>
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-1">Félicitations !</h2>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex justify-around items-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">Points Gagnés</span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">+{session.sessionScore} XP</span>
              </div>
            </div>
            <button
              onClick={() => { setShowVictoryModal(false); setShowConfetti(false); window.location.reload(); }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-base shadow-xl"
            >
              Continuer mon parcours ➔
            </button>
          </div>
        </div>
      )}

      {/* BADGES MODAL */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Mes Badges</h3>
              <button onClick={() => setShowBadgesModal(false)}><Icon name="close" className="w-5 h-5"/></button>
            </div>
            <p className="text-sm text-zinc-500">Bientôt disponible.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearningScreen;
