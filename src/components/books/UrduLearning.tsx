import React, { useState, useEffect, useRef } from 'react';
import { URDU_ALPHABET } from '../../data/learningData';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Pencil,
  Grid,
} from 'lucide-react';

interface UrduLearningProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const UrduLearning: React.FC<UrduLearningProps> = ({ onBack, onEarnStar }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTracing, setIsTracing] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const current = URDU_ALPHABET[currentIndex] || URDU_ALPHABET[0];

  useEffect(() => {
    sound.speak(`${current.name}! ${current.word}. ${current.meaning}`, 'ur-PK');
    clearCanvas();
  }, [currentIndex]);

  const handleNext = () => {
    sound.playPop();
    if (currentIndex < URDU_ALPHABET.length - 1) {
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
      setCurrentIndex(URDU_ALPHABET.length - 1);
    }
  };

  const handleHear = () => {
    sound.playPop();
    sound.speak(`${current.name} say ${current.word}. ${current.meaning}`, 'ur-PK');
  };

  // Tracing Canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      sound.playSuccess();
      confetti({ particleCount: 30, spread: 60 });
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
    ctx.strokeStyle = '#10B981';

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

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setShowGrid(!showGrid);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showGrid
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>حروفِ تہجی</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setIsTracing(!isTracing);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isTracing
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span>{isTracing ? 'پڑھائی' : 'مشق لکھائی'}</span>
          </button>
        </div>
      </div>

      {/* Grid Quick Jump */}
      {showGrid && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-emerald-200 mb-6 animate-fadeIn" dir="rtl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-800 font-urdu">
              کسی بھی حرف پر ٹیپ کریں
            </h3>
            <span className="text-xs text-slate-500 font-urdu">{URDU_ALPHABET.length} حروف</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
            {URDU_ALPHABET.map((item, idx) => (
              <button
                key={item.letter}
                onClick={() => {
                  sound.playPop();
                  setCurrentIndex(idx);
                  setShowGrid(false);
                }}
                className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  idx === currentIndex
                    ? 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-md font-black scale-105'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-slate-800 font-bold border border-emerald-100'
                }`}
              >
                <span className="text-2xl font-urdu leading-none">{item.letter}</span>
                <span className="text-xs mt-0.5">{item.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-urdu">
              حرف نمبر {currentIndex + 1}
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({current.romanName})
            </span>
          </div>

          <button
            onClick={handleHear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>آواز سنیں</span>
          </button>
        </div>

        {!isTracing ? (
          /* Book View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-4" dir="rtl">
            {/* Big Urdu Letter */}
            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-3xl border-2 border-emerald-200 shadow-inner">
              <span className="text-8xl sm:text-9xl font-black text-emerald-700 font-urdu leading-tight drop-shadow-md">
                {current.letter}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-800 font-urdu mt-2">
                {current.name}
              </span>
            </div>

            {/* Word & Picture */}
            <div className="flex flex-col items-center text-center p-4">
              <span className="text-8xl sm:text-9xl mb-3 animate-float drop-shadow-md">
                {current.emoji}
              </span>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 w-full mb-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-900 font-urdu block">
                  {current.letter} سے {current.urduScriptWord}
                </span>
                <span className="text-sm font-bold text-slate-600 block mt-1">
                  ({current.word} — {current.meaning})
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Tracing View */
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-3 font-urdu">
              اپنی انگلی یا ماؤس سے حرف لکھیں
            </span>

            <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-slate-50 rounded-3xl border-4 border-dashed border-emerald-300 shadow-inner flex items-center justify-center overflow-hidden touch-none">
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-20">
                <span className="text-[170px] font-black text-slate-800 font-urdu">
                  {current.letter}
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
              <span>دوبارہ لکھیں</span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>پچھلا حرف</span>
          </button>

          <span className="text-xs font-black text-slate-400">
            {currentIndex + 1} / {URDU_ALPHABET.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-transform btn-3d"
          >
            <span>اگلا حرف</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
