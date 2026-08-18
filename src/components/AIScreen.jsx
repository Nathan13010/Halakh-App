import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { askHalakha } from '../services/aiService';

const AIScreen = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "ai",
      text: "Shalom. Je suis votre assistant virtuel de recherche dans les sources de Halakh'App. Quelle est votre question halakhique aujourd'hui ?",
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setIsTyping(true);

    try {
      const response = await askHalakha(userMsg.text);
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response.answer,
        citations: response.citations,
        rawSources: response.rawSources,
        status: response.status,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Une erreur de communication est survenue.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Rabbinic Warning Banner */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 px-4 py-3 flex gap-3 items-start shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wide">Avertissement</span>
          <span className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed mt-0.5">
            Cet assistant est un outil d'étude généré par IA basé sur le Yalkout Yossef. Pour toute décision pratique (Halakha Lema'assé), consultez une autorité rabbinique compétente.
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
              msg.sender === 'user' 
                ? 'bg-amber-500 text-white rounded-tr-sm' 
                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-tl-sm shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              
              {msg.rawSources && msg.rawSources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 flex flex-col gap-2">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Sources :</span>
                  {msg.rawSources.map((source, idx) => {
                    // Vérifier si cette source a été citée par l'IA
                    const isCited = msg.citations?.some(c => c.sourceId === source.id);
                    if (!isCited && msg.status === "ANSWERED") return null;

                    return (
                      <div key={idx} className="flex items-center justify-between gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-lg border border-zinc-100 dark:border-zinc-700/50">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                          <Icon name="library" className="w-3.5 h-3.5 text-amber-500" />
                          <span className="line-clamp-1">{source.book} ({source.siman}:{source.seif}) - {source.title}</span>
                        </div>
                        <button className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors shrink-0">
                          Lire
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-end gap-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-2"
        >
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Posez votre question sur Hilkhot Chabbat..."
            className="flex-1 bg-transparent border-none text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 resize-none max-h-32 min-h-[44px] px-2 py-3 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button 
            type="submit" 
            disabled={!query.trim() || isTyping}
            className="w-10 h-10 shrink-0 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl flex items-center justify-center transition-colors mb-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIScreen;
