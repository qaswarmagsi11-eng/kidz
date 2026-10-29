import React, { useState, useEffect } from 'react';
import { FRUITS_DATA, VEG_DATA } from '../../data/learningData';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface FruitVegBookProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const FruitVegBook: React.FC<FruitVegBookProps> = ({ onBack, onEarnStar }) => {
  const [activeTab, setActiveTab] = useState<'fruits' | 'vegetables'>('fruits');
  const items = activeTab === 'fruits' ? FRUITS_DATA : VEG_DATA;
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = items[currentIndex] || items[0];

  useEffect(() => {
    sound.speak(`${current.name}! In Urdu it is called ${current.urduName}. ${current.fact}`);
  }, [currentIndex, activeTab]);

  const handleNext = () => {
    sound.playPop();
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    sound.playPop();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      setCurrentIndex(items.length - 1);
    }
  };

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

        {/* Fruits / Veg Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('fruits');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'fruits'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🍎 Fruits (پھل)
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('vegetables');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'vegetables'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🥦 Veggies (سبزیاں)
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-rose-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              {current.name}
            </h2>
            <span className="text-sm sm:text-base font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full font-urdu">
              {current.urduScript} ({current.urduName})
            </span>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              sound.speak(`${current.name}! In Urdu it is ${current.urduName}. ${current.fact}`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Names</span>
          </button>
        </div>

        {/* Center Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-4">
          <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 rounded-3xl border-2 border-rose-100 shadow-inner">
            <span className="text-8xl sm:text-9xl mb-3 animate-float drop-shadow-md">
              {current.emoji}
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 font-display">
              {current.name}
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Healthy Nutrition Fact</span>
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {current.fact}
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                🌍 Dual Language Learning
              </span>
              <p className="text-sm text-slate-700">
                English: <strong>{current.name}</strong><br />
                Urdu: <strong className="font-urdu text-base text-rose-700">{current.urduScript}</strong> ({current.urduName})
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-black text-slate-400">
            {currentIndex + 1} / {items.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-transform btn-3d"
          >
            <span>Next Item</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
