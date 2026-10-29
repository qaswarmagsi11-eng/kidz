import React, { useState, useRef, useEffect } from 'react';
import { ALPHABET_DATA } from '../../data/learningData';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Check,
  Grid,
  Pencil,
  ArrowLeft,
  Star,
} from 'lucide-react';

interface AlphabetBookProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const AlphabetBook: React.FC<AlphabetBookProps> = ({ onBack, onEarnStar }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [isTracingMode, setIsTracingMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const current = ALPHABET_DATA[currentIndex];

  // Pronounce current letter when changed
  useEffect(() => {
    sound.speak(`${current.letter} for ${current.word}. ${current.sentence}`);
    clearCanvas();
    setQuizFeedback(null);
  }, [currentIndex]);

  const handleNext = () => {
    sound.playPop();
    if (currentIndex < ALPHABET_DATA.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    sound.playPop();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(ALPHABET_DATA.length - 1);
    }
  };

  const handleSpeak = () => {
    sound.playPop();
    sound.speak(`${current.letter} is for ${current.word}! ${current.phonetic}`);
  };

  // Canvas drawing functions for letter tracing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      // Traced celebration!
      sound.playSuccess();
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      onEarnStar();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FF80AB';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  };

  // Generate 3 choices for mini-game
  const otherLetters = ALPHABET_DATA.filter((_, idx) => idx !== currentIndex);
  const randomWrong1 = otherLetters[currentIndex % otherLetters.length];
  const randomWrong2 = otherLetters[(currentIndex + 5) % otherLetters.length];
  const quizChoices = [current, randomWrong1, randomWrong2].sort((a, b) => a.letter.localeCompare(b.letter));

  const handleQuizAnswer = (letter: string) => {
    if (letter === current.letter) {
      sound.playSuccess();
      setQuizFeedback('correct');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      onEarnStar();
      setQuizScore((s) => s + 1);
    } else {
      sound.playBoing();
      setQuizFeedback('wrong');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-xs border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setShowGrid(!showGrid);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showGrid
                ? 'bg-sky-500 text-white border-sky-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>A–Z Overview</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setIsTracingMode(!isTracingMode);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isTracingMode
                ? 'bg-pink-500 text-white border-pink-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span>{isTracingMode ? 'Book Mode' : 'Trace Letter'}</span>
          </button>
        </div>
      </div>

      {/* A-Z Quick Jump Grid Overlay */}
      {showGrid && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-sky-200 mb-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-800 font-display">
              Jump to any Alphabet Letter
            </h3>
            <span className="text-xs text-slate-500">26 Letters</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2">
            {ALPHABET_DATA.map((item, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={item.letter}
                  onClick={() => {
                    sound.playPop();
                    setCurrentIndex(idx);
                    setShowGrid(false);
                  }}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md scale-105 font-black'
                      : 'bg-sky-50 hover:bg-sky-100 text-slate-800 font-bold border border-sky-100'
                  }`}
                >
                  <span className="text-lg leading-none">{item.letter}</span>
                  <span className="text-xs mt-0.5">{item.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Alphabet Book Stage */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-pink-200 relative overflow-hidden">
        {/* Letter Badge & Pronounce Audio Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
              Letter {currentIndex + 1} of 26
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">{current.phonetic}</span>
          </div>

          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs active:scale-95 transition-transform"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Pronunciation</span>
          </button>
        </div>

        {/* Center Stage: Split between Letter & Tracing / Object */}
        {!isTracingMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-4">
            {/* Left: Giant 3D Alphabet Display */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-50 via-amber-50 to-sky-50 rounded-3xl border-2 border-pink-100 shadow-inner">
              <div className="flex items-baseline gap-3">
                <span className="text-7xl sm:text-9xl font-black text-rose-500 font-display drop-shadow-md tracking-tight animate-bounce" style={{ animationDuration: '3s' }}>
                  {current.letter}
                </span>
                <span className="text-5xl sm:text-7xl font-bold text-pink-400 font-display">
                  {current.lowercase}
                </span>
              </div>
              <div className="mt-2 text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 font-display">
                  {current.word}
                </span>
              </div>
            </div>

            {/* Right: Object Illustration & Facts */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="text-8xl sm:text-9xl mb-3 animate-float drop-shadow-md">
                {current.emoji}
              </div>

              <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 w-full mb-3">
                <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                  "{current.sentence}"
                </p>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                💡 <strong className="text-slate-700">Fun Fact:</strong> {current.fact}
              </p>
            </div>
          </div>
        ) : (
          /* Tracing Canvas Stage */
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-2 text-center">
              <span className="text-xs font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                ✏️ Trace the letter with your finger or mouse!
              </span>
            </div>

            <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-slate-50 rounded-3xl border-4 border-dashed border-pink-300 shadow-inner flex items-center justify-center overflow-hidden touch-none">
              {/* Background Guide Letter */}
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-20">
                <span className="text-[180px] font-black text-slate-700 font-display">
                  {current.letter}
                </span>
              </div>

              {/* Drawing Canvas */}
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear Canvas</span>
              </button>
            </div>
          </div>
        )}

        {/* Mini-Game: Which one starts with this letter? */}
        <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Mini Quiz: Which picture starts with <strong>"{current.letter}"</strong>?</span>
            </span>

            {quizFeedback === 'correct' && (
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-bounce">
                🌟 Super Job! You earned a star!
              </span>
            )}
            {quizFeedback === 'wrong' && (
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                Try again! You can do it! 💪
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {quizChoices.map((choice) => (
              <button
                key={choice.letter}
                onClick={() => handleQuizAnswer(choice.letter)}
                className="p-3 bg-slate-50 hover:bg-pink-50 border-2 border-slate-200 hover:border-pink-300 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {choice.emoji}
                </span>
                <span className="text-xs font-bold text-slate-700 mt-1">
                  {choice.word}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-sm transition-transform active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-black text-slate-400">
            {currentIndex + 1} / 26
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-transform active:scale-95 btn-3d"
          >
            <span>Next Letter</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
