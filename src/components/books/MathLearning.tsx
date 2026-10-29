import React, { useState, useEffect } from 'react';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Award,
} from 'lucide-react';

interface MathLearningProps {
  onBack: () => void;
  onEarnStar: () => void;
}

type MathMode = 'addition' | 'subtraction' | 'multiplication' | 'compare' | 'tables';

export const MathLearning: React.FC<MathLearningProps> = ({ onBack, onEarnStar }) => {
  const [mode, setMode] = useState<MathMode>('addition');
  const [tableNumber, setTableNumber] = useState<number>(2);

  // Question State
  const [num1, setNum1] = useState(2);
  const [num2, setNum2] = useState(3);
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(5);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  // Generate new math problem
  const generateProblem = () => {
    setFeedback(null);
    let n1 = 2;
    let n2 = 3;
    let ans = 5;

    if (mode === 'addition') {
      n1 = Math.floor(Math.random() * 5) + 1;
      n2 = Math.floor(Math.random() * 5) + 1;
      ans = n1 + n2;
    } else if (mode === 'subtraction') {
      n1 = Math.floor(Math.random() * 6) + 4;
      n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
      ans = n1 - n2;
    } else if (mode === 'multiplication') {
      n1 = Math.floor(Math.random() * 4) + 1;
      n2 = Math.floor(Math.random() * 4) + 1;
      ans = n1 * n2;
    }

    setNum1(n1);
    setNum2(n2);
    setCorrectAnswer(ans);

    // Generate 3 choices
    const fake1 = ans + 1;
    const fake2 = Math.max(1, ans - 1);
    const shuffled = [ans, fake1, fake2].sort(() => Math.random() - 0.5);
    setOptions(shuffled);

    // Speak problem
    const operatorWord = mode === 'addition' ? 'plus' : mode === 'subtraction' ? 'minus' : 'times';
    sound.speak(`What is ${n1} ${operatorWord} ${n2}?`);
  };

  useEffect(() => {
    if (mode !== 'tables') {
      generateProblem();
    }
  }, [mode]);

  const handleSelectAnswer = (chosen: number) => {
    if (chosen === correctAnswer) {
      sound.playSuccess();
      setFeedback('correct');
      sound.speak(`Excellent! You are a Math Star! ${num1} and ${num2} makes ${correctAnswer}!`);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      onEarnStar();
      setScore((s) => s + 1);
    } else {
      sound.playBoing();
      setFeedback('wrong');
      sound.speak("Good try! Count the apples again, you can do it!");
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

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sound.playPop();
              setMode('addition');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'addition'
                ? 'bg-violet-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ➕ Addition
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setMode('subtraction');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'subtraction'
                ? 'bg-violet-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ➖ Subtraction
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setMode('multiplication');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'multiplication'
                ? 'bg-violet-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✖️ Multiplication
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setMode('tables');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'tables'
                ? 'bg-violet-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔢 Tables 1–12
          </button>
        </div>
      </div>

      {/* Main Math Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-violet-200 relative overflow-hidden">
        {mode !== 'tables' ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-violet-800 bg-violet-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Math Adventure • Solved: {score} ⭐
              </span>

              <button
                onClick={generateProblem}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Problem</span>
              </button>
            </div>

            {/* Visual Fruit Counters & Formula */}
            <div className="py-6 px-4 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-3xl border-2 border-violet-100 text-center mb-6 shadow-inner">
              {/* Animated Apple Group Visualizers */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap my-4">
                {/* Group 1 */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-1.5 p-3 bg-white/80 rounded-2xl border border-violet-200 shadow-2xs">
                    {Array.from({ length: num1 }, (_, i) => (
                      <span key={i} className="text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                        🍎
                      </span>
                    ))}
                  </div>
                  <span className="text-xl font-black text-slate-800 mt-1">{num1}</span>
                </div>

                {/* Operator Symbol */}
                <span className="text-4xl sm:text-5xl font-black text-violet-600 font-display">
                  {mode === 'addition' ? '+' : mode === 'subtraction' ? '−' : '×'}
                </span>

                {/* Group 2 */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-1.5 p-3 bg-white/80 rounded-2xl border border-violet-200 shadow-2xs">
                    {Array.from({ length: num2 }, (_, i) => (
                      <span key={i} className="text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: `${(num1 + i) * 0.1}s` }}>
                        🍎
                      </span>
                    ))}
                  </div>
                  <span className="text-xl font-black text-slate-800 mt-1">{num2}</span>
                </div>

                {/* Equals */}
                <span className="text-4xl sm:text-5xl font-black text-violet-600 font-display">
                  =
                </span>

                {/* Question Box */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl sm:text-4xl font-black shadow-md border-2 border-white animate-pulse">
                  ?
                </div>
              </div>

              {/* Feedback banner */}
              {feedback === 'correct' && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-800 font-black text-sm animate-bounce mt-4">
                  🎉 Excellent! You are a Math Star! ⭐
                </div>
              )}
              {feedback === 'wrong' && (
                <div className="p-3 bg-amber-100 border border-amber-300 rounded-2xl text-amber-900 font-bold text-sm mt-4">
                  Gentle try! Count the shiny apples above! You can do it! 🍎
                </div>
              )}
            </div>

            {/* 3 Answer Choice Buttons */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center mb-3">
                Tap the correct answer:
              </span>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectAnswer(opt)}
                    className="py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black text-2xl sm:text-3xl shadow-md hover:shadow-lg active:scale-95 transition-all btn-3d"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Multiplication Tables Explorer */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 font-display">
                Multiplication Tables (پہاڑے)
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-500">Pick Table:</span>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(Number(e.target.value))}
                  className="py-1 px-3 rounded-xl border-2 border-violet-300 text-xs font-black bg-violet-50 text-violet-900"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      Table of {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((multiplier) => {
                const product = tableNumber * multiplier;
                return (
                  <button
                    key={multiplier}
                    onClick={() => {
                      sound.playPop();
                      sound.speak(`${tableNumber} times ${multiplier} is ${product}`);
                    }}
                    className="p-3 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-2xl text-center active:scale-95 transition-transform"
                  >
                    <span className="text-xs font-bold text-slate-600 block">
                      {tableNumber} × {multiplier}
                    </span>
                    <span className="text-lg font-black text-violet-700 block mt-0.5">
                      = {product}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
