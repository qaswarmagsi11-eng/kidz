import React, { useState } from 'react';
import { CATEGORIES } from '../data/learningData';
import { CategoryId, ChildProfile } from '../types';
import { sound } from '../services/soundService';
import { PandaMascot } from './PandaMascot';
import { Sparkles, ArrowRight, Star, Heart } from 'lucide-react';

interface HomeDashboardProps {
  currentProfile: ChildProfile;
  onSelectCategory: (catId: CategoryId) => void;
  onOpenAITutor: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentProfile,
  onSelectCategory,
  onOpenAITutor,
}) => {
  const [ageFilter, setAgeFilter] = useState<'All' | 'Ages 2–4' | 'Ages 5–6' | 'Ages 7–10'>('All');

  const filteredCategories = CATEGORIES.filter((cat) => {
    if (ageFilter === 'All') return true;
    if (ageFilter === 'Ages 2–4') return cat.ageRecommendation.includes('2') || cat.ageRecommendation.includes('3') || cat.ageRecommendation.includes('All');
    if (ageFilter === 'Ages 5–6') return cat.ageRecommendation.includes('5') || cat.ageRecommendation.includes('6') || cat.ageRecommendation.includes('All');
    if (ageFilter === 'Ages 7–10') return cat.ageRecommendation.includes('7') || cat.ageRecommendation.includes('8') || cat.ageRecommendation.includes('9') || cat.ageRecommendation.includes('10') || cat.ageRecommendation.includes('All');
    return true;
  });

  const handleCardClick = (id: CategoryId, title: string) => {
    sound.playPop();
    onSelectCategory(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-28">
      {/* Hero Welcome Banner with Animated Baby Panda */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-400 via-pink-400 to-amber-300 text-white shadow-xl mb-8 border-4 border-white">
        {/* Floating background sparkles */}
        <div className="absolute top-2 right-4 text-3xl animate-spin" style={{ animationDuration: '12s' }}>⭐</div>
        <div className="absolute bottom-2 left-6 text-2xl animate-pulse">✨</div>
        <div className="absolute top-1/2 left-1/4 text-xl opacity-60">🎈</div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>Welcome Back, {currentProfile.name}!</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight drop-shadow-sm leading-tight">
              Let's Learn Something <span className="text-amber-200">Amazing</span> Today! 🌈
            </h1>

            <p className="text-sm sm:text-base font-semibold text-white/95 mt-2 leading-relaxed">
              Explore 20 interactive learning books, games, creative drawing, and English & Urdu literacy!
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <button
                onClick={() => {
                  sound.playPop();
                  onSelectCategory('abc');
                }}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-50 active:scale-95 transition-transform"
              >
                🔤 Start with ABCs
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onSelectCategory('games');
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-extrabold text-xs shadow-md hover:bg-amber-300 active:scale-95 transition-transform"
              >
                🎮 Play Games
              </button>
              <button
                onClick={() => {
                  sound.playSuccess();
                  onOpenAITutor();
                }}
                className="px-4 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-white font-extrabold text-xs transition-colors"
              >
                🐼 Ask Buddy AI
              </button>
            </div>
          </div>

          {/* Baby Panda Mascot Holding Book */}
          <div className="shrink-0 flex flex-col items-center">
            <PandaMascot
              size="lg"
              expression="reading"
              speech="Ready to play? 🌟"
              onClick={() => {
                sound.playPop();
                sound.speak("Let's learn something amazing today!");
              }}
              className="hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Age Filters Bar */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Learning Adventures
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Choose any book or game to open its complete learning section:
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl shadow-xs border border-slate-200">
          {(['All', 'Ages 2–4', 'Ages 5–6', 'Ages 7–10'] as const).map((af) => (
            <button
              key={af}
              onClick={() => {
                sound.playPop();
                setAgeFilter(af);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                ageFilter === af
                  ? 'bg-sky-500 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {af}
            </button>
          ))}
        </div>
      </div>

      {/* 20 Interactive Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((cat, index) => (
          <div
            key={cat.id}
            onClick={() => handleCardClick(cat.id, cat.title)}
            className="group relative bg-white rounded-3xl p-5 border-3 border-slate-100 hover:border-sky-300 shadow-md hover:shadow-xl cursor-pointer transition-all duration-200 card-hover active:scale-98 overflow-hidden flex flex-col justify-between"
          >
            {/* Top Row: Emoji Icon and Age Badge */}
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-3xl shadow-sm border-2 border-white group-hover:scale-110 transition-transform`}
              >
                {cat.emoji}
              </div>

              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {cat.ageRecommendation}
              </span>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-display group-hover:text-sky-600 transition-colors">
                  {cat.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                {cat.subtitle}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                {cat.badge}
              </span>

              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-colors text-slate-400">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
