import React, { useState, useEffect } from 'react';
import { COLOR_DATA } from '../../data/learningData';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ColorBookProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const ColorBook: React.FC<ColorBookProps> = ({ onBack, onEarnStar }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const [quizTargetIndex, setQuizTargetIndex] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const current = COLOR_DATA[currentIndex];

  useEffect(() => {
    setSelectedExample(null);
    sound.speak(`This is ${current.name}. ${current.description}`);
  }, [currentIndex]);

  const handleNext = () => {
    sound.playPop();
    if (currentIndex < COLOR_DATA.length - 1) {
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
      setCurrentIndex(COLOR_DATA.length - 1);
    }
  };

  const handleExampleTap = (idx: number, name: string) => {
    sound.playPop();
    setSelectedExample(idx);
    sound.speak(`${name}! It is colored ${current.name}.`);
  };

  // Color Identification mini-game
  const handleQuizAnswer = (answeredColorId: string) => {
    if (answeredColorId === current.id) {
      sound.playSuccess();
      setQuizFeedback('correct');
      confetti({ particleCount: 40, spread: 60 });
      onEarnStar();
    } else {
      sound.playBoing();
      setQuizFeedback('wrong');
    }
  };

  // 3 choices for color quiz
  const otherColors = COLOR_DATA.filter((_, idx) => idx !== currentIndex);
  const quizOptions = [current, otherColors[currentIndex % otherColors.length], otherColors[(currentIndex + 2) % otherColors.length]].sort(
    (a, b) => a.name.localeCompare(b.name)
  );

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

        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
          🎨 Color {currentIndex + 1} of {COLOR_DATA.length}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-purple-200 relative overflow-hidden">
        {/* Color Header & Pronunciation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              {current.name}
            </h2>
            <span className="text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full font-urdu">
              {current.urduName}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              sound.speak(`This is the color ${current.name}. Can you find something ${current.name}?`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Color</span>
          </button>
        </div>

        {/* Big Color Palette Swatch */}
        <div
          className="w-full h-36 sm:h-44 rounded-3xl shadow-inner border-4 border-white flex flex-col items-center justify-center p-4 transition-all duration-300 relative overflow-hidden"
          style={{ backgroundColor: current.hex }}
        >
          <span className="text-3xl sm:text-4xl font-black text-white font-display drop-shadow-md tracking-wider uppercase">
            {current.name}
          </span>
          <p className="text-xs sm:text-sm text-white/95 font-bold mt-1 text-center drop-shadow-xs max-w-sm">
            {current.description}
          </p>
        </div>

        {/* 3 Real-World Examples */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Real-World {current.name} Objects (Tap to Explore):</span>
          </h3>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {current.examples.map((item, idx) => {
              const isSelected = selectedExample === idx;
              return (
                <button
                  key={item.name}
                  onClick={() => handleExampleTap(idx, item.name)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 shadow-md scale-105'
                      : 'border-slate-200 hover:border-purple-300 bg-slate-50'
                  }`}
                >
                  <span className="text-5xl sm:text-6xl mb-2 animate-bounce" style={{ animationDuration: '3s' }}>
                    {item.emoji}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 text-center">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mini-Quiz: Find the Color */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">
              🎯 Mini Game: Which swatch is <strong>{current.name}</strong>?
            </span>
            {quizFeedback === 'correct' && (
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-bounce">
                🎉 Perfect! You found {current.name}!
              </span>
            )}
            {quizFeedback === 'wrong' && (
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                Look closely at the big swatch above! 👀
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {quizOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleQuizAnswer(opt.id)}
                className="h-16 rounded-2xl shadow-sm border-4 border-white transition-transform active:scale-95 flex items-center justify-center font-bold text-white text-xs drop-shadow-md"
                style={{ backgroundColor: opt.hex }}
              >
                <span>{opt.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-black text-slate-400">
            {currentIndex + 1} / {COLOR_DATA.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-transform btn-3d"
          >
            <span>Next Color</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
