import React, { useRef, useState, useEffect } from 'react';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Download,
  Trash2,
  Paintbrush,
  Eraser,
  Sparkles,
  Palette,
} from 'lucide-react';

interface DrawingStudioProps {
  onBack: () => void;
  onEarnStar: () => void;
}

type ToolMode = 'brush' | 'pencil' | 'eraser' | 'rainbow';

interface Template {
  id: string;
  name: string;
  emoji: string;
  renderSVG: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const DrawingStudio: React.FC<DrawingStudioProps> = ({ onBack, onEarnStar }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState('#EF4444');
  const [brushSize, setBrushSize] = useState(10);
  const [tool, setTool] = useState<ToolMode>('brush');
  const [activeTemplate, setActiveTemplate] = useState<string>('blank');
  const [history, setHistory] = useState<ImageData[]>([]);

  const isDrawingRef = useRef(false);
  const rainbowHueRef = useRef(0);

  const colors = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#FBBF24', // Yellow
    '#10B981', // Green
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#854D0E', // Brown
    '#1E293B', // Black
    '#FFFFFF', // White
  ];

  // Templates
  const templates = [
    { id: 'blank', name: 'Free Drawing', emoji: '✨' },
    { id: 'panda', name: 'Baby Panda', emoji: '🐼' },
    { id: 'apple', name: 'Sweet Apple', emoji: '🍎' },
    { id: 'butterfly', name: 'Butterfly', emoji: '🦋' },
    { id: 'car', name: 'Race Car', emoji: '🚗' },
    { id: 'rainbow', name: 'Rainbow', emoji: '🌈' },
  ];

  // Initialize canvas with white background
  useEffect(() => {
    initCanvas();
  }, []);

  const initCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistoryState();
  };

  const saveHistoryState = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), state]);
  };

  const handleUndo = () => {
    if (history.length <= 1 || !canvasRef.current) return;
    sound.playPop();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  const handleClear = () => {
    sound.playPop();
    initCanvas();
  };

  const handleDownload = () => {
    sound.playSuccess();
    confetti({ particleCount: 30, spread: 60 });
    onEarnStar();
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `little-genius-art-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      saveHistoryState();
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

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.lineWidth = brushSize * 2;
      ctx.strokeStyle = '#FFFFFF';
    } else if (tool === 'pencil') {
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
    } else if (tool === 'rainbow') {
      rainbowHueRef.current = (rainbowHueRef.current + 5) % 360;
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = `hsl(${rainbowHueRef.current}, 100%, 50%)`;
    } else {
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Draw outline template onto canvas
  const loadTemplate = (id: string) => {
    setActiveTemplate(id);
    initCanvas();
    if (id === 'blank') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1E293B';
    ctx.fillStyle = '#1E293B';

    if (id === 'apple') {
      // Draw big apple outline
      ctx.beginPath();
      ctx.arc(280, 260, 110, 0, Math.PI * 2);
      ctx.stroke();
      // Stem & leaf
      ctx.beginPath();
      ctx.moveTo(280, 150);
      ctx.quadraticCurveTo(280, 100, 310, 90);
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(320, 110, 25, 12, Math.PI / 4, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.stroke();
    } else if (id === 'panda') {
      // Ears
      ctx.beginPath();
      ctx.arc(200, 170, 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(360, 170, 35, 0, Math.PI * 2);
      ctx.stroke();
      // Head
      ctx.beginPath();
      ctx.ellipse(280, 260, 110, 90, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Eyes
      ctx.beginPath();
      ctx.ellipse(235, 250, 20, 26, -0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(325, 250, 20, 26, 0.2, 0, Math.PI * 2);
      ctx.stroke();
      // Nose
      ctx.beginPath();
      ctx.ellipse(280, 290, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === 'butterfly') {
      // Wings left
      ctx.beginPath();
      ctx.ellipse(210, 210, 60, 45, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(220, 280, 45, 35, -0.2, 0, Math.PI * 2);
      ctx.stroke();
      // Wings right
      ctx.beginPath();
      ctx.ellipse(350, 210, 60, 45, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(340, 280, 45, 35, 0.2, 0, Math.PI * 2);
      ctx.stroke();
      // Body
      ctx.beginPath();
      ctx.ellipse(280, 250, 16, 75, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (id === 'rainbow') {
      // 5 rainbow arcs
      const rads = [180, 155, 130, 105, 80];
      rads.forEach((r) => {
        ctx.beginPath();
        ctx.arc(280, 360, r, Math.PI, 0, false);
        ctx.stroke();
      });
    }

    saveHistoryState();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Top Header */}
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
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-xl text-xs font-bold border border-slate-200 disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1.5 bg-white text-rose-600 rounded-xl text-xs font-bold border border-slate-200 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-xs hover:shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Picture</span>
          </button>
        </div>
      </div>

      {/* Main Studio Frame */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-yellow-200">
        {/* Template Chooser Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
            Coloring Pages:
          </span>
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                sound.playPop();
                loadTemplate(tpl.id);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap border ${
                activeTemplate === tpl.id
                  ? 'bg-amber-400 text-amber-950 border-amber-500 scale-105 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{tpl.emoji}</span>
              <span>{tpl.name}</span>
            </button>
          ))}
        </div>

        {/* Tools and Palette Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Tool Modes */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => {
                sound.playPop();
                setTool('brush');
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                tool === 'brush' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span className="hidden sm:inline">Brush</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setTool('rainbow');
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                tool === 'rainbow' ? 'bg-gradient-to-r from-pink-500 to-amber-400 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Rainbow</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setTool('eraser');
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                tool === 'eraser' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Eraser</span>
            </button>
          </div>

          {/* Brush Sizes */}
          <div className="flex items-center gap-1.5">
            {[4, 10, 22].map((s) => (
              <button
                key={s}
                onClick={() => {
                  sound.playPop();
                  setBrushSize(s);
                }}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                  brushSize === s ? 'border-amber-400 bg-amber-50 scale-105' : 'border-slate-200'
                }`}
              >
                <span
                  className="rounded-full bg-slate-800"
                  style={{ width: `${s}px`, height: `${s}px` }}
                />
              </button>
            ))}
          </div>

          {/* Color Swatches */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  sound.playPop();
                  setColor(c);
                  if (tool === 'eraser') setTool('brush');
                }}
                className={`w-7 h-7 rounded-full border-2 transition-transform active:scale-90 ${
                  color === c && tool !== 'eraser'
                    ? 'scale-125 border-slate-900 shadow-xs'
                    : 'border-white'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* HTML5 Canvas Area */}
        <div className="w-full flex items-center justify-center bg-slate-50 rounded-2xl border-4 border-slate-200 overflow-hidden shadow-inner touch-none">
          <canvas
            ref={canvasRef}
            width={560}
            height={420}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="w-full max-w-[560px] h-[340px] sm:h-[420px] bg-white cursor-crosshair"
          />
        </div>
      </div>
    </div>
  );
};
