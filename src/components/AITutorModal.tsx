import React, { useState, useRef, useEffect } from 'react';
import { PandaMascot } from './PandaMascot';
import { sound } from '../services/soundService';
import { ChildProfile } from '../types';
import { X, Send, Volume2, Sparkles, MessageCircleQuestion } from 'lucide-react';

interface Message {
  id: string;
  sender: 'buddy' | 'child';
  text: string;
}

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ChildProfile;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'buddy',
      text: `Hello ${profile.name}! 🐼 I'm Buddy the Panda! What shall we learn about today? Tap a question or write to me! ⭐`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: 'Give me a math puzzle! 🧮', text: 'Buddy, can you give me a fun easy math puzzle?' },
    { label: 'Tell an animal fact! 🦁', text: 'What is a super cool fact about animals?' },
    { label: 'Teach me an Urdu word! 📚', text: 'How do you say thank you or hello in Urdu?' },
    { label: 'Tell a funny riddle! 🎈', text: 'Tell me a funny riddle for kids!' },
    { label: 'Why is the sky blue? 🌤️', text: 'Why is the sky blue?' },
    { label: 'Sing a short rhyme! 🎵', text: 'Can you sing a tiny happy rhyme for me?' },
  ];

  useEffect(() => {
    if (isOpen) {
      sound.speak(messages[0].text);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText || loading) return;

    sound.playPop();
    const userMsg: Message = {
      id: 'child-' + Date.now(),
      sender: 'child',
      text: cleanText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          childAge: profile.ageGroup,
          language: profile.language,
        }),
      });

      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      const buddyReply = data.reply || "You are doing great, Little Genius! 🐼 What shall we explore next?";

      const buddyMsg: Message = {
        id: 'buddy-' + Date.now(),
        sender: 'buddy',
        text: buddyReply,
      };

      setMessages((prev) => [...prev, buddyMsg]);
      sound.playSuccess();
      sound.speak(buddyReply);
    } catch {
      // Local fallback
      const fallbackMsg: Message = {
        id: 'buddy-' + Date.now(),
        sender: 'buddy',
        text: "You are a Little Genius! 🌟 Let's keep learning our letters, numbers, and colorful worlds together! 🐼",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      sound.playSuccess();
      sound.speak(fallbackMsg.text);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    sound.playPop();
    sound.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[85vh] max-h-[680px] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400 p-3 sm:p-4 flex items-center justify-between text-white shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-inner border-2 border-white/80">
              🐼
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display leading-tight flex items-center gap-1.5">
                <span>Buddy the Panda</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  AI Tutor
                </span>
              </h2>
              <p className="text-xs text-amber-100 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Friendly, Safe & Encouraging</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.stopSpeech();
              onClose();
            }}
            className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-amber-50 border-b border-amber-100 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => sendMessage(qp.text)}
              className="text-xs font-bold text-amber-900 bg-white hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 shadow-2xs whitespace-nowrap active:scale-95 transition-all shrink-0"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-sky-50/50 to-pink-50/30">
          {messages.map((msg) => {
            const isBuddy = msg.sender === 'buddy';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isBuddy ? 'justify-start' : 'justify-end'}`}
              >
                {isBuddy && (
                  <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-base shrink-0 mb-1">
                    🐼
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm font-semibold leading-relaxed shadow-xs ${
                    isBuddy
                      ? 'bg-white text-slate-800 border-2 border-amber-200 rounded-bl-xs'
                      : 'bg-sky-500 text-white rounded-br-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {isBuddy && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="mt-1 flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear Voice</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold p-2 bg-white/70 rounded-2xl w-fit border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
              <span>Buddy is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputText);
          }}
          className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Buddy anything! (e.g. What is 2 + 3?)"
            className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-slate-200 focus:border-amber-400 text-sm font-semibold text-slate-800 focus:outline-hidden"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
