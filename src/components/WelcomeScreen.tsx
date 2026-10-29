import React from 'react';
import { PandaMascot } from './PandaMascot';
import { sound } from '../services/soundService';
import { Sparkles, ArrowRight, BookOpen, Volume2 } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    sound.playSuccess();
    sound.speak("Hello, Little Genius! Let's learn and play!");
    onStart();
  };

  const handleSpeakWelcome = () => {
    sound.playPop();
    sound.speak("Hello, Little Genius! Are you ready to learn and play?");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col items-center justify-between p-6 bg-gradient-to-b from-sky-200 via-pink-100 to-amber-100 selection:bg-amber-300">
      {/* Floating Rainbow Backdrop Arc */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] max-w-4xl h-80 -mt-16 pointer-events-none opacity-40">
        <svg viewBox="0 0 500 200" className="w-full h-full">
          <path d="M 50 200 A 200 200 0 0 1 450 200" fill="none" stroke="#FF80AB" strokeWidth="24" strokeLinecap="round" />
          <path d="M 74 200 A 176 176 0 0 1 426 200" fill="none" stroke="#FFB74D" strokeWidth="24" strokeLinecap="round" />
          <path d="M 98 200 A 152 152 0 0 1 402 200" fill="none" stroke="#FFD54F" strokeWidth="24" strokeLinecap="round" />
          <path d="M 122 200 A 128 128 0 0 1 378 200" fill="none" stroke="#81C784" strokeWidth="24" strokeLinecap="round" />
          <path d="M 146 200 A 104 104 0 0 1 354 200" fill="none" stroke="#4FC3F7" strokeWidth="24" strokeLinecap="round" />
          <path d="M 170 200 A 80 80 0 0 1 330 200" fill="none" stroke="#BA68C8" strokeWidth="24" strokeLinecap="round" />
        </svg>
      </div>

      {/* Floating playful letters & numbers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-12 left-8 text-3xl font-extrabold text-pink-500 animate-float drop-shadow-sm">A</span>
        <span className="absolute top-24 right-10 text-4xl font-extrabold text-blue-500 animate-bounce drop-shadow-sm" style={{ animationDuration: '3s' }}>B</span>
        <span className="absolute top-44 left-16 text-3xl font-extrabold text-amber-500 animate-float" style={{ animationDelay: '1s' }}>C</span>
        <span className="absolute bottom-40 right-14 text-4xl font-extrabold text-emerald-500 animate-bounce" style={{ animationDuration: '2.5s' }}>1</span>
        <span className="absolute bottom-52 left-10 text-4xl font-extrabold text-purple-500 animate-float" style={{ animationDelay: '1.5s' }}>2</span>
        <span className="absolute top-1/2 right-6 text-4xl font-extrabold text-rose-400 animate-float">3</span>
        <span className="absolute top-20 left-1/3 text-2xl animate-spin text-amber-400" style={{ animationDuration: '10s' }}>⭐</span>
        <span className="absolute top-36 right-1/4 text-2xl animate-pulse text-pink-400">✨</span>
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-white">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-700 tracking-wide">Ages 2–10</span>
        </div>

        <button
          onClick={handleStart}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 bg-white/70 hover:bg-white rounded-full transition-colors border border-white/60 shadow-xs"
        >
          Skip Intro →
        </button>
      </div>

      {/* Center Hero: Buddy the Panda in Classroom */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-lg">
        {/* Brand Title */}
        <div className="mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/30 border border-amber-400/50 text-amber-900 font-bold text-xs tracking-wider mb-2">
            <span>🌈 WELCOME TO</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 font-display drop-shadow-xs">
            LITTLE GENIUS <span className="text-sky-500">KIDS</span>
          </h1>
          <p className="text-slate-600 font-medium text-sm sm:text-base mt-1">
            Learn • Play • Explore • Grow
          </p>
        </div>

        {/* Panda with ABC Book */}
        <div className="relative my-4">
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center shadow-xl border-4 border-white/90">
            <PandaMascot
              size="lg"
              expression="reading"
              className="transform hover:scale-105 transition-transform"
            />
          </div>

          <button
            onClick={handleSpeakWelcome}
            aria-label="Listen to Buddy the Panda"
            className="absolute -bottom-2 right-4 p-2.5 rounded-full bg-amber-400 text-amber-950 shadow-md hover:bg-amber-300 active:scale-95 transition-transform flex items-center gap-1.5 text-xs font-bold"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Buddy!</span>
          </button>
        </div>

        {/* Friendly speech greeting bubble */}
        <div className="bg-white/90 backdrop-blur-sm border-2 border-sky-300 rounded-3xl p-4 shadow-lg max-w-md w-full">
          <p className="text-slate-800 text-base sm:text-lg font-bold">
            "Hello, Little Genius! 🐼 Are you ready to learn, sing, color, and play?"
          </p>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            20 interactive categories • Fun educational games • English & Urdu learning
          </p>
        </div>
      </div>

      {/* Big 3D Start Button */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-3 pb-4">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-white font-extrabold text-lg sm:text-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/80 btn-3d"
        >
          <BookOpen className="w-6 h-6 animate-pulse" />
          <span>🚀 START LEARNING</span>
          <ArrowRight className="w-6 h-6" />
        </button>

        <p className="text-xs text-slate-500 font-medium">
          Safe, child-friendly learning environment • No ads
        </p>
      </div>
    </div>
  );
};
