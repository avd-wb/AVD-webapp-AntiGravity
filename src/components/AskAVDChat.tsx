import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Shield } from "lucide-react";

export function AskAVDChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem("avd_chat_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        sender: "avd",
        content: "Respectful greetings, colleague. I am Shri A. K. Ray, IAS (Retd.), Senior Administrative Advisor to the Association of Veterinary Doctors (AVD). I stand ready to assist you regarding official departmental procedures, MCAS file structures, or service confirmation prayers. Please formulate your administrative query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("avd_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatTyping, isChatOpen]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { 
      sender: "user", 
      content: chatInput.trim(), 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setChatHistory(prev => [...prev, userMessage]);
    const currentInput = chatInput.trim();
    setChatInput("");
    setIsChatTyping(true);

    try {
      // Package recent turn history to retain contextual coherence
      const recentHistory = chatHistory.slice(-6).map(h => ({
        role: h.sender === "user" ? "user" : "model",
        content: h.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, chatHistory: recentHistory })
      });
      const data = await res.json();
      
      setIsChatTyping(false);
      if (data.success) {
        setChatHistory(prev => [...prev, {
          sender: "avd",
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setChatHistory(prev => [...prev, {
          sender: "avd",
          content: "With due respect, I encountered a communication block with the administrative servers. Please reformulate your prayer or try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      setIsChatTyping(false);
      setChatHistory(prev => [...prev, {
        sender: "avd",
        content: "I must respectfully advise that a connection delay is restricting server access. Administrative servers will be online shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
  };

  const clearChat = () => {
    const defaultMsg = [
      {
        sender: "avd",
        content: "Respectful greetings, colleague. I am Shri A. K. Ray, IAS (Retd.), Senior Administrative Advisor to the Association of Veterinary Doctors (AVD). I stand ready to assist you regarding official departmental procedures, MCAS file structures, or service confirmation prayers. Please formulate your administrative query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setChatHistory(defaultMsg);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Expanded Chat Pane */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="w-[360px] sm:w-[390px] h-[520px] bg-white rounded-3xl border border-slate-200/80 shadow-[0_15px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden mb-4 mr-1 relative"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-saffron-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-saffron-50 rounded-xl flex items-center justify-center text-saffron-600 ring-2 ring-saffron-500/20 shadow-inner">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    Ask AVD Advisor <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </h3>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Shri A. K. Ray, IAS (Retd.)</p>
                  <p className="text-[9px] text-saffron-400 font-medium italic">Senior Administrative Advisor</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearChat}
                  className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 font-bold transition-all"
                  title="Reset Conversation"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Message Log */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/60 space-y-4 text-xs">
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex gap-2 max-w-[85%]">
                    {msg.sender === "avd" && (
                      <div className="w-6 h-6 rounded-lg bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600 shrink-0 text-[10px] font-black">
                        Ray
                      </div>
                    )}
                    <div>
                      <div className={`p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                        msg.sender === "user" 
                          ? "bg-slate-900 text-white rounded-tr-none font-medium" 
                          : "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none font-medium"
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-400 block mt-1 uppercase tracking-wider text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isChatTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-lg bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600 shrink-0 text-[10px] font-black animate-pulse">
                      Ray
                    </div>
                    <div>
                      <div className="p-3 bg-white text-slate-500 border border-slate-200/60 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 font-medium italic">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-150"></span>
                        <span className="text-[10px] text-slate-400 ml-1">Advisor Ray is drafting a reply...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions chips */}
            <div className="px-4 py-2 bg-slate-100 border-t border-slate-200/40 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
              <button 
                onClick={() => handleSuggestionClick("MCAS 8-year benefits eligibility")}
                className="bg-white hover:bg-saffron-50 hover:text-saffron-700 hover:border-saffron-200 text-[10px] font-bold text-slate-600 border border-slate-200 py-1 px-2.5 rounded-full transition-all"
              >
                MCAS Scale
              </button>
              <button 
                onClick={() => handleSuggestionClick("Confirmation of Service rules")}
                className="bg-white hover:bg-saffron-50 hover:text-saffron-700 hover:border-saffron-200 text-[10px] font-bold text-slate-600 border border-slate-200 py-1 px-2.5 rounded-full transition-all"
              >
                Service Confirmation
              </button>
              <button 
                onClick={() => handleSuggestionClick("Rotational transfers rules")}
                className="bg-white hover:bg-saffron-50 hover:text-saffron-700 hover:border-saffron-200 text-[10px] font-bold text-slate-600 border border-slate-200 py-1 px-2.5 rounded-full transition-all"
              >
                Rotational Transfer
              </button>
              <button 
                onClick={() => handleSuggestionClick("AVD Membership requirements")}
                className="bg-white hover:bg-saffron-50 hover:text-saffron-700 hover:border-saffron-200 text-[10px] font-bold text-slate-600 border border-slate-200 py-1 px-2.5 rounded-full transition-all"
              >
                AVD Membership
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 flex gap-2 bg-white">
              <input 
                type="text"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-saffron-500 text-xs transition-all"
                placeholder="Formulate your administrative query..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-saffron-600 hover:bg-saffron-700 text-white p-2.5 rounded-xl transition-all shadow shadow-saffron-600/10 flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble Trigger */}
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-slate-900 text-white p-4 rounded-full hover:bg-saffron-600 transition-colors shadow-xl ring-4 ring-slate-900/10 border-2 border-saffron-500/50 flex items-center justify-center gap-2 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500 to-saffron-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <MessageSquare className="w-6 h-6 relative z-10 text-saffron-400 group-hover:text-white" />
        <span className="text-xs font-black relative z-10 pr-1 group-hover:text-white text-saffron-50 hidden sm:inline">Ask AVD Advisor</span>
      </motion.button>
    </div>
  );
}
