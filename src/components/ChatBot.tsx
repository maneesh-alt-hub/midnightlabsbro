
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Welcome to Midnight Labs. I'm your automation assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const prompt = `You are an AI assistant for "Midnight Labs", an automation and AI consultancy agency.
      Services include: Intelligent conversational agents, Workflow Automation, Custom AI Models, End-to-End Strategies, Custom AI Integrations, and AI Consulting.
      Your tone: Professional, technical, efficient, and slightly industrial/minimalist.
      
      User asks: ${userMessage}`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const botResponse = result.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Systems offline. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-[50] w-14 h-14 bg-brand-primary text-white neo-border neo-shadow flex items-center justify-center group hover:-translate-y-1 transition-all"
      >
        <MessageSquare size={28} className="group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[60] w-[350px] max-w-[calc(100vw-2rem)] h-[500px] bg-brand-cream neo-border neo-shadow-lg flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-brand-ink text-white flex justify-between items-center neo-border-b">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h3 className="font-black text-xs uppercase tracking-widest">ML_ASSISTANT v1.0</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:text-brand-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow p-4 space-y-4 overflow-y-auto dotted-bg bg-opacity-50"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 text-xs font-bold neo-border ${
                    msg.role === 'user' 
                      ? 'bg-brand-sand text-brand-ink border-brand-ink' 
                      : 'bg-white text-brand-ink border-brand-ink'
                  } neo-shadow shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white neo-border p-3 text-[10px] font-black uppercase tracking-widest neo-shadow animate-pulse">
                    PROCESSING...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white neo-border-t">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Query system..."
                  className="flex-grow neo-border p-2 text-xs font-bold outline-none focus:bg-brand-sand transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-brand-primary text-white neo-border p-2 hover:bg-brand-ink transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
