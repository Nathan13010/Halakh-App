import React, { useState } from 'react';
import Icon from './Icon';
import { sendReport } from '../services/reportService';

const ReportModal = ({ isOpen, onClose, seifContext }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  if (!isOpen || !seifContext) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('sending');

    try {
      await sendReport({ 
        message, 
        ...seifContext 
      });
      
      setStatus('success');
      
      // Reset after success
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error sending report:", error);
      setStatus('error');
      // Re-enable form after 3 seconds on error
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const isSending = status === 'sending';
  const isSuccess = status === 'success';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => !isSending && onClose()}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500">
            <Icon name="alert" className="w-5 h-5" />
            <h3 className="font-bold text-lg">Signaler une erreur</h3>
          </div>
          <button 
            onClick={onClose}
            disabled={isSending}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold uppercase tracking-wider">Fermer</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4">
          
          {/* Context Banner */}
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-3 rounded-xl flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">
              Contexte du signalement
            </span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {seifContext.bookTitle} — {seifContext.chapterTitle}
            </span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
              Seïf {seifContext.seifNumber} {seifContext.seifTitle ? `(${seifContext.seifTitle})` : ''}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Décrivez l'erreur trouvée (traduction, faute de frappe, etc.)
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Le mot X semble mal traduit..."
                disabled={isSending || isSuccess}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </label>

            {/* Actions */}
            <div className="flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending || isSuccess}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!message.trim() || isSending || isSuccess}
                className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer
                  ${isSuccess 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20'
                  }
                `}
              >
                {isSending && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSuccess ? 'Envoyé !' : status === 'error' ? 'Erreur !' : isSending ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
