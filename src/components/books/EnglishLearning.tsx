import React, { useState, useEffect } from 'react';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ArrowLeft,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface EnglishLearningProps {
  onBack: () => void;
  onEarnStar: () => void;
}

interface CVCWord {
  l1: string;
  l2: string;
  l3: string;
  word: string;
  emoji: string;
  phonics: string;
  sentence: string;
}

interface OppositePair {
  word1: string;
  word2: string;
  emoji1: string;
  emoji2: string;
  explanation: string;
}

export const EnglishLearning: React.FC<EnglishLearningProps> = ({ onBack, onEarnStar }) => {
  const [tab, setTab] = useState<'cvc' | 'vowels' | 'opposites'>('cvc');
  const [cvcIndex, setCvcIndex] = useState(0);

  const cvcWords: CVCWord[] = [
    { l1: 'C', l2: 'A', l3: 'T', word: 'CAT', emoji: '🐱', phonics: '/k/ + /æ/ + /t/ = CAT', sentence: 'The cat sleeps on the cozy mat.' },
    { l1: 'D', l2: 'O', l3: 'G', word: 'DOG', emoji: '🐶', phonics: '/d/ + /ɒ/ + /ɡ/ = DOG', sentence: 'The happy dog wags its tail.' },
    { l1: 'P', l2: 'E', l3: 'N', word: 'PEN', emoji: '🖊️', phonics: '/p/ + /e/ + /n/ = PEN', sentence: 'We write our ABCs with a blue pen.' },
    { l1: 'S', l2: 'U', l3: 'N', word: 'SUN', emoji: '☀️', phonics: '/s/ + /ʌ/ + /n/ = SUN', sentence: 'The sun shines warm and bright.' },
    { l1: 'P', l2: 'I', l3: 'G', word: 'PIG', emoji: '🐷', phonics: '/p/ + /ɪ/ + /ɡ/ = PIG', sentence: 'The little pink pig plays in the mud.' },
    { l1: 'B', l2: 'A', l3: 'T', word: 'BAT', emoji: '🦇', phonics: '/b/ + /æ/ + /t/ = BAT', sentence: 'The bat flies gently at night.' },
    { l1: 'F', l2: 'O', l3: 'X', word: 'FOX', emoji: '🦊', phonics: '/f/ + /ɒ/ + /ks/ = FOX', sentence: 'The clever fox has a bushy tail.' },
  ];

  const opposites: OppositePair[] = [
    { word1: 'Big', word2: 'Small', emoji1: '🐘', emoji2: '🐭', explanation: 'An elephant is BIG, but a mouse is SMALL!' },
    { word1: 'Hot', word2: 'Cold', emoji1: '🔥', emoji2: '🧊', explanation: 'Fire is HOT, but an ice cube is COLD!' },
    { word1: 'Happy', word2: 'Sad', emoji1: '😄', emoji2: '😢', explanation: 'A big smile is HAPPY, while tears are SAD.' },
    { word1: 'Day', word2: 'Night', emoji1: '☀️', emoji2: '🌙', explanation: 'The sun brings DAY, the stars bring NIGHT.' },
    { word1: 'Fast', word2: 'Slow', emoji1: '🐆', emoji2: '🐢', explanation: 'A cheetah runs FAST, a turtle walks SLOW.' },
  ];

  const currentCVC = cvcWords[cvcIndex];

  useEffect(() => {
    if (tab === 'cvc') {
      sound.speak(`${currentCVC.l1}... ${currentCVC.l2}... ${currentCVC.l3}... equals ${currentCVC.word}!`);
    }
  }, [cvcIndex, tab]);

  const handleNextCVC = () => {
    sound.playPop();
    if (cvcIndex < cvcWords.length - 1) {
      setCvcIndex((i) => i + 1);
    } else {
      setCvcIndex(0);
    }
  };

  const handlePrevCVC = () => {
    sound.playPop();
    if (cvcIndex > 0) {
      setCvcIndex((i) => i - 1);
    } else {
      setCvcIndex(cvcWords.length - 1);
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

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              sound.playPop();
              setTab('cvc');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              tab === 'cvc'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔤 3-Letter CVC Words
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setTab('vowels');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              tab === 'vowels'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⭐ The 5 Vowels
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setTab('opposites');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              tab === 'opposites'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ↔️ Opposites
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-sky-200 relative overflow-hidden">
        {tab === 'cvc' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Word Building Phonics • {cvcIndex + 1} of {cvcWords.length}
              </span>

              <button
                onClick={() => {
                  sound.playPop();
                  sound.speak(`${currentCVC.l1}... ${currentCVC.l2}... ${currentCVC.l3}... ${currentCVC.word}!`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Phonics</span>
              </button>
            </div>

            {/* Letter Blending Stage (e.g. C + A + T = CAT) */}
            <div className="my-6 p-6 sm:p-8 bg-gradient-to-br from-sky-50 via-indigo-50 to-pink-50 rounded-3xl border-2 border-sky-200 text-center shadow-inner">
              <div className="flex items-center justify-center gap-3 sm:gap-4 my-2 flex-wrap">
                <div className="w-16 h-20 sm:w-20 sm:h-24 bg-white rounded-2xl shadow-md border-2 border-sky-300 flex items-center justify-center text-4xl sm:text-5xl font-black text-sky-600 font-display animate-bounce" style={{ animationDelay: '0s' }}>
                  {currentCVC.l1}
                </div>
                <span className="text-3xl font-black text-slate-400">+</span>
                <div className="w-16 h-20 sm:w-20 sm:h-24 bg-white rounded-2xl shadow-md border-2 border-pink-300 flex items-center justify-center text-4xl sm:text-5xl font-black text-pink-600 font-display animate-bounce" style={{ animationDelay: '0.2s' }}>
                  {currentCVC.l2}
                </div>
                <span className="text-3xl font-black text-slate-400">+</span>
                <div className="w-16 h-20 sm:w-20 sm:h-24 bg-white rounded-2xl shadow-md border-2 border-amber-300 flex items-center justify-center text-4xl sm:text-5xl font-black text-amber-600 font-display animate-bounce" style={{ animationDelay: '0.4s' }}>
                  {currentCVC.l3}
                </div>
                <span className="text-3xl font-black text-slate-400">=</span>
                <div className="px-5 h-20 sm:h-24 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-center text-3xl sm:text-4xl font-black font-display tracking-wider border-2 border-white">
                  {currentCVC.word}
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <span className="text-8xl sm:text-9xl animate-float drop-shadow-md mb-2">
                  {currentCVC.emoji}
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-800">
                  "{currentCVC.sentence}"
                </p>
                <span className="text-xs font-semibold text-slate-500 mt-1">
                  Phonics sound breakdown: {currentCVC.phonics}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={handlePrevCVC}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-sm active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous Word</span>
              </button>

              <span className="text-xs font-black text-slate-400">
                {cvcIndex + 1} / {cvcWords.length}
              </span>

              <button
                onClick={handleNextCVC}
                className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-transform btn-3d"
              >
                <span>Next Word</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {tab === 'vowels' && (
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display mb-2 text-center">
              The 5 Magic Vowels
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              Every English word needs a vowel sound! Let's meet the 5 friends:
            </p>

            <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto mb-8">
              {[
                { v: 'A', name: 'Short /æ/ as in Apple 🍎', color: 'from-rose-400 to-pink-500' },
                { v: 'E', name: 'Short /e/ as in Elephant 🐘', color: 'from-amber-400 to-orange-500' },
                { v: 'I', name: 'Short /ɪ/ as in Igloo ❄️', color: 'from-emerald-400 to-teal-500' },
                { v: 'O', name: 'Short /ɒ/ as in Orange 🍊', color: 'from-sky-400 to-blue-500' },
                { v: 'U', name: 'Short /ʌ/ as in Umbrella ☂️', color: 'from-purple-400 to-indigo-500' },
              ].map((vItem) => (
                <button
                  key={vItem.v}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`Vowel ${vItem.v}. ${vItem.name}`);
                  }}
                  className={`p-4 rounded-3xl bg-gradient-to-b ${vItem.color} text-white shadow-md hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center border-2 border-white`}
                >
                  <span className="text-4xl sm:text-5xl font-black font-display leading-tight drop-shadow-xs">
                    {vItem.v}
                  </span>
                  <span className="text-[10px] font-bold mt-1 text-center leading-tight opacity-90">
                    Tap me
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-center">
              <span className="text-xs font-bold text-sky-800">
                Sing the Vowel Chant: "A - E - I - O - U, vowels are good for you!" 🎵
              </span>
            </div>
          </div>
        )}

        {tab === 'opposites' && (
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display mb-2 text-center">
              Opposites Match (الٹ الفاظ)
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              Things that are completely different from each other:
            </p>

            <div className="space-y-3">
              {opposites.map((op, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${op.word1} and ${op.word2}. ${op.explanation}`);
                  }}
                  className="p-4 bg-slate-50 hover:bg-sky-50 rounded-2xl border-2 border-slate-200 hover:border-sky-300 flex items-center justify-between cursor-pointer transition-all active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{op.emoji1}</span>
                    <span className="text-base font-black text-slate-900">{op.word1}</span>
                  </div>

                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 bg-white rounded-md border border-slate-200">
                    Opposite of
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-sky-700">{op.word2}</span>
                    <span className="text-3xl">{op.emoji2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
