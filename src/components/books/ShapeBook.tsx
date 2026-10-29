import React, { useState, useEffect } from 'react';
import { SHAPE_DATA } from '../../data/learningData';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface ShapeBookProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const ShapeBook: React.FC<ShapeBookProps> = ({ onBack, onEarnStar }) => {
  const [filterType, setFilterType] = useState<'All' | '2D' | '3D'>('All');
  const filteredShapes = SHAPE_DATA.filter((s) => (filterType === 'All' ? true : s.type === filterType));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const current = filteredShapes[currentIndex] || filteredShapes[0];

  useEffect(() => {
    sound.speak(`This is a ${current.name}. It has ${current.sides} sides. ${current.description}`);
    setQuizFeedback(null);
  }, [currentIndex, filterType]);

  const handleNext = () => {
    sound.playPop();
    if (currentIndex < filteredShapes.length - 1) {
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
      setCurrentIndex(filteredShapes.length - 1);
    }
  };

  // Shape Identification Mini-Game
  const otherShapes = filteredShapes.filter((_, idx) => idx !== currentIndex);
  const quizChoices = [current, otherShapes[currentIndex % otherShapes.length], otherShapes[(currentIndex + 2) % otherShapes.length]].sort(
    (a, b) => a.name.localeCompare(b.name)
  );

  const handleQuizAnswer = (id: string) => {
    if (id === current.id) {
      sound.playSuccess();
      setQuizFeedback('correct');
      confetti({ particleCount: 40, spread: 60 });
      onEarnStar();
    } else {
      sound.playBoing();
      setQuizFeedback('wrong');
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

        {/* 2D / 3D Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {(['All', '2D', '3D'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                sound.playPop();
                setFilterType(t);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                filterType === t
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t} Shapes
            </button>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              {current.name}
            </h2>
            <span className="text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-urdu">
              {current.urduName}
            </span>
            <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
              {current.type}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              sound.speak(`${current.name}! It has ${current.sides} sides. ${current.description}`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Shape</span>
          </button>
        </div>

        {/* Center Shape Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-4">
          {/* Big Shape Display */}
          <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 rounded-3xl border-2 border-emerald-100 shadow-inner">
            <span className="text-8xl sm:text-9xl mb-3 animate-float drop-shadow-md">
              {current.emoji}
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-extrabold text-emerald-800 shadow-2xs border border-emerald-200">
                Sides / Faces: {current.sides}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-3 text-center">
              {current.description}
            </p>
          </div>

          {/* Real-World Objects */}
          <div className="flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Real Things Shaped Like a {current.name}:</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {current.realWorld.map((rw, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-slate-800 hover:bg-emerald-50 transition-colors"
                >
                  <span className="text-2xl">{rw.split(' ')[rw.split(' ').length - 1]}</span>
                  <span>{rw.split(' ').slice(0, -1).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini-Quiz */}
        <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">
              🧩 Quiz: Tap the <strong>{current.name}</strong>!
            </span>
            {quizFeedback === 'correct' && (
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-bounce">
                🎉 That's right! Amazing geometry star!
              </span>
            )}
            {quizFeedback === 'wrong' && (
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                Try again! Look at the number of sides!
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {quizChoices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleQuizAnswer(choice.id)}
                className="p-4 bg-slate-50 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-300 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 group"
              >
                <span className="text-5xl group-hover:scale-110 transition-transform">
                  {choice.emoji}
                </span>
                <span className="text-xs font-bold text-slate-700 mt-1">
                  {choice.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-black text-slate-400">
            {currentIndex + 1} / {filteredShapes.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-transform btn-3d"
          >
            <span>Next Shape</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
