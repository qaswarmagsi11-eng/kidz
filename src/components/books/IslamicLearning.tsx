import React, { useState, useEffect } from 'react';
import { ISLAMIC_DATA } from '../../data/learningData';
import { sound } from '../../services/soundService';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Moon,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface IslamicLearningProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const IslamicLearning: React.FC<IslamicLearningProps> = ({ onBack, onEarnStar }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Dua' | 'Pillar' | 'Kalima' | 'Manners'>('All');
  const filtered = ISLAMIC_DATA.filter((item) => (selectedCategory === 'All' ? true : item.category === selectedCategory));
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = filtered[currentIndex] || filtered[0];

  useEffect(() => {
    sound.speak(`${current.title}. ${current.englishMeaning}`);
  }, [currentIndex, selectedCategory]);

  const handleNext = () => {
    sound.playPop();
    if (currentIndex < filtered.length - 1) {
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
      setCurrentIndex(filtered.length - 1);
    }
  };

  const handleHearArabic = () => {
    sound.playPop();
    sound.speak(`${current.title}. ${current.englishMeaning}`);
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

        {/* Filter Categories */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
          {(['All', 'Dua', 'Pillar', 'Kalima', 'Manners'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playPop();
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'Dua' ? '🤲 Duas' : cat === 'Pillar' ? '🕌 Pillars' : cat === 'Kalima' ? '📜 Kalimas' : cat === 'Manners' ? '✨ Manners' : '🌟 All'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-teal-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-100 text-teal-800 text-base">
              🌙
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                {current.title}
              </h2>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Category: {current.category}
              </span>
            </div>
          </div>

          <button
            onClick={handleHearArabic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Meaning</span>
          </button>
        </div>

        {/* Big Arabic Calligraphy Banner */}
        <div className="my-6 p-6 sm:p-8 bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 rounded-3xl border-2 border-teal-200 text-center shadow-inner">
          <p
            dir="rtl"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-teal-900 leading-relaxed font-urdu drop-shadow-xs"
          >
            {current.arabic}
          </p>
        </div>

        {/* Translations (Urdu & English) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* Urdu Meaning */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-right" dir="rtl">
            <span className="text-xs font-bold text-emerald-800 block mb-1 font-urdu">
              📖 اردو ترجمہ:
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-800 font-urdu leading-loose">
              {current.urduMeaning}
            </p>
          </div>

          {/* English Meaning */}
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block mb-1">
              🌍 English Translation:
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
              {current.englishMeaning}
            </p>
          </div>
        </div>

        {/* Friendly explanation for kids */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gentle Learning Lesson</span>
          </span>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            {current.explanation}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold text-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-black text-slate-400">
            {currentIndex + 1} / {filtered.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-transform btn-3d"
          >
            <span>Next Lesson</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
