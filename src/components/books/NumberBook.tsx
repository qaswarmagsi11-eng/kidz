import React, { useState, useEffect, useRef } from 'react';
import { NUMBER_DATA } from '../../data/learningData';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Pencil,
} from 'lucide-react';

interface NumberBookProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const NumberBook: React.FC<NumberBookProps> = ({ onBack, onEarnStar }) => {
  const [currentNumIndex, setCurrentNumIndex] = useState(1); // start at 1
  const [countedCount, setCountedCount] = useState<number>(0);
  const [isTracing, setIsTracing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const current = NUMBER_DATA[currentNumIndex] || NUMBER_DATA[1];

  useEffect(() => {
    setCountedCount(0);
    clearCanvas();
    sound.speak(`${current.number}! ${current.word}. ${current.fact}`);
  }, [currentNumIndex]);

  const handleNext = () => {
    sound.playPop();
    if (currentNumIndex < NUMBER_DATA.length - 1) {
      setCurrentNumIndex((i) => i + 1);
    } else {
      setCurrentNumIndex(0);
    }
  };

  const handlePrev = () => {
    sound.playPop();
    if (currentNumIndex > 0) {
      setCurrentNumIndex((i) => i - 1);
    } else {
      setCurrentNumIndex(NUMBER_DATA.length - 1);
    }
  };

  const handleTapCount = (index: number) => {
    const nextCount = index + 1;
    sound.playPlink(1 + index * 0.1);
    sound.speak(`${nextCount}`);
    setCountedCount(Math.max(countedCount, nextCount));

    if (nextCount === current.number) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 60 });
      onEarnStar();
    }
  };

  // Tracing drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      sound.playSuccess();
      confetti({ particleCount: 30, spread: 50 });
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
    ctx.strokeStyle = '#F59E0B';

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

  // Render counting items (up to 20 for interactive tapping)
  const itemsCount = Math.min(current.number, 20);
  const items = Array.from({ length: itemsCount }, (_, i) => i);

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

        <button
          onClick={() => {
            sound.playPop();
            setIsTracing(!isTracing);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isTracing
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Pencil className="w-4 h-4" />
          <span>{isTracing ? 'Counting Mode' : 'Trace Number'}</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
              Number {current.number}
            </span>
            {current.urduNumber && (
              <span className="text-sm font-bold text-emerald-700 font-urdu bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                اردو: {current.urduNumber} ({current.urduWord})
              </span>
            )}
          </div>

          <button
            onClick={() => {
              sound.playPop();
              sound.speak(`${current.number}! ${current.word}. Let's count together!`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Number</span>
          </button>
        </div>

        {!isTracing ? (
          <div>
            {/* Big Number Center Header */}
            <div className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl border-2 border-amber-200 mb-6 shadow-inner">
              <span className="text-8xl sm:text-9xl font-black text-amber-500 font-display drop-shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
                {current.number}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-slate-800 font-display uppercase tracking-wider">
                {current.word}
              </span>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                💡 {current.fact}
              </p>
            </div>

            {/* Interactive Object Counting */}
            {current.number > 0 && current.number <= 20 ? (
              <div className="bg-slate-50 rounded-3xl p-5 border-2 border-slate-200 text-center">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700">
                    👆 Tap each item to count! ({countedCount} / {current.number})
                  </span>
                  {countedCount === current.number && (
                    <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full animate-bounce">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>All counted! ⭐ Star earned!</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {items.map((i) => {
                    const isCounted = i < countedCount;
                    return (
                      <button
                        key={i}
                        onClick={() => handleTapCount(i)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center text-3xl sm:text-4xl transition-all active:scale-90 border-2 ${
                          isCounted
                            ? 'bg-amber-100 border-amber-400 scale-105 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <span className={isCounted ? 'animate-pulse' : ''}>
                          {current.itemsEmoji}
                        </span>
                        <span className="text-[10px] font-black text-slate-500 mt-0.5">
                          {i + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-3xl border text-center">
                <span className="text-6xl mb-2 block">{current.itemsEmoji}</span>
                <p className="text-sm font-bold text-slate-700">
                  {current.number === 0
                    ? 'Zero means an empty set with nothing inside!'
                    : `That's a big milestone: ${current.number}!`}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Tracing Number Canvas */
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-3">
              ✏️ Trace the number {current.number} with your finger or mouse!
            </span>

            <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-slate-50 rounded-3xl border-4 border-dashed border-amber-300 shadow-inner flex items-center justify-center overflow-hidden touch-none">
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-20">
                <span className="text-[180px] font-black text-slate-700 font-display">
                  {current.number}
                </span>
              </div>

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

            <button
              onClick={clearCanvas}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-black text-slate-400">
            {currentNumIndex + 1} / {NUMBER_DATA.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-transform btn-3d"
          >
            <span>Next Number</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
