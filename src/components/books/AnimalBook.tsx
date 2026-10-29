import React, { useState, useEffect } from 'react';
import { ANIMAL_DATA } from '../../data/learningData';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Music,
} from 'lucide-react';

interface AnimalBookProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const AnimalBook: React.FC<AnimalBookProps> = ({ onBack, onEarnStar }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Farm', 'Wild', 'Pet', 'Birds', 'Sea'];

  const filteredAnimals = ANIMAL_DATA.filter((a) => (selectedCategory === 'All' ? true : a.category === selectedCategory));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);

  const current = filteredAnimals[currentIndex] || filteredAnimals[0];

  useEffect(() => {
    sound.speak(`This is a ${current.name}. A ${current.name} lives in ${current.habitat}. ${current.funFact}`);
    setSoundFeedback(null);
  }, [currentIndex, selectedCategory]);

  const handleNext = () => {
    sound.playPop();
    if (currentIndex < filteredAnimals.length - 1) {
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
      setCurrentIndex(filteredAnimals.length - 1);
    }
  };

  const handleHearSound = () => {
    sound.playAnimalSound(current.name);
    sound.speak(`${current.soundDescription}`);
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

        {/* Categories Bar */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                sound.playPop();
                setSelectedCategory(c);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === c
                  ? 'bg-cyan-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-cyan-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              {current.name}
            </h2>
            <span className="text-sm font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full font-urdu">
              {current.urduName}
            </span>
            <span className="text-xs font-bold text-cyan-600 bg-cyan-100 px-2.5 py-0.5 rounded-md">
              {current.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleHearSound}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-xs active:scale-95 transition-transform"
            >
              <Music className="w-4 h-4" />
              <span>Hear Sound ({current.soundDescription})</span>
            </button>
          </div>
        </div>

        {/* Center Stage: Animal Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-4">
          <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 rounded-3xl border-2 border-cyan-100 shadow-inner">
            <span className="text-8xl sm:text-9xl mb-3 animate-float drop-shadow-md">
              {current.emoji}
            </span>
            <span className="text-sm font-extrabold text-cyan-900 bg-white px-3 py-1 rounded-full border border-cyan-200 shadow-2xs">
              Sound: {current.soundDescription}
            </span>
          </div>

          {/* Habitat & Facts */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                🏡 Natural Habitat
              </span>
              <p className="text-sm font-bold text-slate-800">
                {current.habitat}
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Fun Animal Fact</span>
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {current.funFact}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-bold text-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-black text-slate-400">
            {currentIndex + 1} / {filteredAnimals.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-transform btn-3d"
          >
            <span>Next Animal</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
