import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Send, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useProductStore } from '../stores/productStore';
import type { Message } from '../types';

const INITIAL_MESSAGE: Message = {
  role: 'model',
  content:
    'Welcome to the VK Luxe Atelier. I am your personal concierge. How may I assist you in finding your next masterpiece today?',
};

export const ConciergeView: React.FC = () => {
  const { catalog } = useProductStore();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const genAI = useMemo(
    () => new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || ''),
    []
  );

  const conciergeChat = useMemo(
    () => {
      const inventoryStatus = catalog.map(p => 
        `${p.name} (${p.category}): ₵${p.price}. ${p.stock > 0 ? `In Stock (${p.stock} available)` : 'SOLD OUT'}`
      ).join('\n');

      return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
        systemInstruction:
          'You are the Elite AI Concierge for VK Luxe, a premier boutique for high-end luxury masterpieces. Your tone is impeccable, sophisticated, and deeply knowledgeable about craftsmanship. ' +
          'Every client is treated as a high-net-worth individual. ' +
          '\n\nATELIER LEDGER (Current Inventory):\n' + inventoryStatus +
          '\n\nPROTOCOL:\n' +
          '1. RECOMMENDATIONS: Only suggest masterpieces that are currently in stock. If stock is < 3, emphasize "Exclusive Scarcity".\n' +
          '2. SALESMANSHIP: When recommending, describe the "aura" and "craftsmanship" of the piece. Use words like "exquisite", "unparalleled", "legacy", and "masterpiece".\n' +
          '3. SOLD OUT ITEMS: If a piece is out of stock, do not simply say no. Say: "While that specific masterpiece has been acquired by another collector, I have curated a selection that matches its prestige..." then suggest an in-stock item.\n' +
          '4. CURRENCY: All prices are in Ghana Cedis (₵).\n' +
          '5. CALL TO ACTION: Gently guide clients toward finalizing their acquisition in the "Boutique Bag" (Cart).\n' +
          '6. RESTRICTION: Do not mention that you are an AI. You are the digital extension of the VK Luxe Atelier.',
      });
    },
    [genAI, catalog]
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    try {
      const result = await conciergeChat.sendMessage(text);
      const response = await result.response;
      const responseText = response.text() || 'I apologize, but I am unable to respond at this moment.';
      setMessages((prev) => [...prev, { role: 'model', content: responseText }]);
    } catch (error) {
      console.error('AI Concierge Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content:
            'I apologize, but I am experiencing a temporary disconnection from the Atelier. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100dvh-140px)] sm:h-[calc(100dvh-100px)] lg:px-12 max-w-4xl mx-auto overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-hide">
        {messages.map((msg, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-[1.5rem] p-4 sm:p-5 flex gap-3 ${
                msg.role === 'user'
                  ? 'bg-luxury-gold text-black rounded-tr-none font-bold shadow-xl'
                  : 'glass-card text-gray-900 dark:text-white rounded-tl-none border-luxury-gold/20'
              }`}
            >
              {msg.role === 'model' && <Bot className="w-5 h-5 shrink-0 text-luxury-gold" />}
              <p className="text-sm sm:text-base leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-card rounded-[1.5rem] rounded-tl-none p-4 flex gap-2">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 bg-luxury-gold rounded-full"
              />
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                className="w-2 h-2 bg-luxury-gold rounded-full"
              />
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                className="w-2 h-2 bg-luxury-gold rounded-full"
              />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 sm:p-6 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-t border-gray-100 dark:border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask for an Atelier recommendation..."
            className="flex-1 bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-[1.25rem] py-4 px-6 outline-none border border-gray-100 dark:border-white/10 focus:border-luxury-gold/50 transition-all placeholder:text-zinc-500 font-medium"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-4 bg-luxury-gold text-black rounded-xl hover:bg-luxury-pink hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
