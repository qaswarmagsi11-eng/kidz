import React, { useState, useEffect } from 'react';
import { NURSERY_RHYMES } from '../../data/learningData';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Play,
  Square,
  Volume2,
  Sparkles,
  Music,
} from 'lucide-react';

interface RhymesLibraryProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const RhymesLibrary: React.FC<RhymesLibraryProps> = ({ onBack, onEarnStar }) => {
  const [selectedRhymeIndex, setSelectedRhymeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(-1);

  const current = NURSERY_RHYMES[selectedRhymeIndex] || NURSERY_RHYMES[0];

  useEffect(() => {
    stopPlayback();
  }, [selectedRhymeIndex]);

  const stopPlayback = () => {
    setIsPlaying(false);
    setActiveLineIndex(-1);
    sound.stopSpeech();
  };

  const startKaraoke = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    sound.playPop();
    setIsPlaying(true);
    const isUrdu = current.category.includes('Urdu');

    for (let i = 0; i < current.lines.length; i++) {
      setActiveLineIndex(i);
      const lineText = current.lines[i];
      sound.speak(lineText, isUrdu ? 'ur-PK' : 'en-US', 1.25, 0.85);
      // Wait for line duration
      await new Promise((resolve) => setTimeout(resolve, 2600));
    }

    setIsPlaying(false);
    setActiveLineIndex(-1);
    sound.playSuccess();
    confetti({ particleCount: 40, spread: 60 });
    onEarnStar();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          onClick={() => {
            stopPlayback();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-xs border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Music className="w-3.5 h-3.5" />
          <span>{current.category}</span>
        </span>
      </div>

      {/* Main Stage */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-pink-200 relative overflow-hidden">
        {/* Rhyme Selector Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-slate-100">
          {NURSERY_RHYMES.map((rhyme, idx) => (
            <button
              key={rhyme.id}
              onClick={() => {
                sound.playPop();
                setSelectedRhymeIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap border ${
                selectedRhymeIndex === idx
                  ? 'bg-pink-500 text-white border-pink-600 shadow-xs scale-105'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{rhyme.emoji}</span>
              <span>{rhyme.title}</span>
            </button>
          ))}
        </div>

        {/* Rhyme Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{current.emoji}</span>
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-display">
                {current.title}
              </h2>
              {current.urduTitle && (
                <span className="text-sm font-bold text-pink-700 font-urdu">
                  {current.urduTitle}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={startKaraoke}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all ${
              isPlaying
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-95'
            }`}
          >
            {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Stop Rhyme' : 'Sing Along!'}</span>
          </button>
        </div>

        {/* Karaoke Animated Lyrics */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-pink-50 via-purple-50 to-sky-50 rounded-3xl border-2 border-pink-200 shadow-inner text-center space-y-4">
          {current.lines.map((line, idx) => {
            const isHighlighted = activeLineIndex === idx;
            return (
              <p
                key={idx}
                className={`text-lg sm:text-2xl font-black transition-all duration-300 ${
                  isHighlighted
                    ? 'text-pink-600 scale-110 drop-shadow-xs font-display'
                    : 'text-slate-700 opacity-80'
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
