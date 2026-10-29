import React, { useState } from 'react';
import { sound } from '../../services/soundService';
import { ArrowLeft, Volume2, Sparkles, Heart } from 'lucide-react';

interface BodyViewProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const BodyView: React.FC<BodyViewProps> = ({ onBack, onEarnStar }) => {
  const parts = [
    { name: 'Head & Brain', urdu: 'سر اور دماغ (Sar / Dimagh)', emoji: '🧠', fact: 'Your brain helps you think, imagine, remember, and solve puzzles!' },
    { name: 'Eyes', urdu: 'آنکھیں (Aankhen)', emoji: '👀', fact: 'Your eyes blink to stay clean and allow you to see beautiful colors!' },
    { name: 'Ears', urdu: 'کان (Kaan)', emoji: '👂', fact: 'Your ears hear music, whispering, and help you keep your balance!' },
    { name: 'Nose', urdu: 'ناک (Naak)', emoji: '👃', fact: 'Your nose smells yummy food and warms the air you breathe in!' },
    { name: 'Mouth & Teeth', urdu: 'منہ اور دانت (Munh / Daant)', emoji: '👄', fact: 'Your mouth helps you speak, smile, and chew nutritious food!' },
    { name: 'Hands & Fingers', urdu: 'ہاتھ اور انگلیاں (Haath)', emoji: '✋', fact: 'You have five nimble fingers on each hand to draw, build, and hold!' },
    { name: 'Legs & Feet', urdu: 'ٹانگیں اور پاؤں (Paoon)', emoji: '🦵', fact: 'Strong legs and feet let you run, hop, dance, and jump high!' },
    { name: 'Heart', urdu: 'دل (Dil)', emoji: '❤️', fact: 'Your heart beats steadily like a gentle drum to pump blood all day!' },
    { name: 'Lungs', urdu: 'پھیپھڑے (Phaiphray)', emoji: '🫁', fact: 'Your lungs take in fresh oxygen from the air when you inhale!' },
    { name: 'Stomach', urdu: 'معدہ / پیٹ (Pait)', emoji: '🥣', fact: 'Your stomach digests delicious foods to give you energy to play!' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-xs border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
          🧍 Amazing Human Body
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-teal-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 font-display">
            The Human Body & Health (انسانی جسم)
          </h2>
          <p className="text-xs text-slate-500">
            Tap any body part to learn how it keeps you healthy and strong!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {parts.map((p, i) => (
            <div
              key={i}
              onClick={() => {
                sound.playPop();
                sound.speak(`${p.name}! In Urdu, ${p.urdu}. ${p.fact}`);
              }}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50 cursor-pointer transition-all active:scale-95 flex items-center gap-3.5 group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">
                {p.emoji}
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900">{p.name}</h3>
                <span className="text-xs font-bold text-teal-700 font-urdu block">{p.urdu}</span>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{p.fact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
