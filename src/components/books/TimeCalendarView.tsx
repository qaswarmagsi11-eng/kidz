import React, { useState, useEffect } from 'react';
import { sound } from '../../services/soundService';
import {
  ArrowLeft,
  Volume2,
  Clock,
  Calendar,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';

interface TimeCalendarViewProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const TimeCalendarView: React.FC<TimeCalendarViewProps> = ({ onBack, onEarnStar }) => {
  const [tab, setTab] = useState<'clock' | 'days' | 'months'>('clock');
  const [hours, setHours] = useState(3);
  const [minutes, setMinutes] = useState(0);

  const daysOfWeek = [
    { en: 'Monday', ur: 'پیر (Peer)', emoji: '🎒', desc: 'First day of school week!' },
    { en: 'Tuesday', ur: 'منگل (Mangal)', emoji: '🎨', desc: 'Art and stories day!' },
    { en: 'Wednesday', ur: 'بدھ (Budh)', emoji: '🧮', desc: 'Middle of the week math fun!' },
    { en: 'Thursday', ur: 'جمعرات (Jumerat)', emoji: '⚽', desc: 'Sports and outdoor playground!' },
    { en: 'Friday', ur: 'جمعہ (Jummah)', emoji: '🕌', desc: 'Blessed Friday prayer and family time!' },
    { en: 'Saturday', ur: 'ہفتہ (Hafta)', emoji: '🚲', desc: 'Weekend fun, riding bikes!' },
    { en: 'Sunday', ur: 'اتوار (Itwar)', emoji: '🎈', desc: 'Picnics and resting with family!' },
  ];

  const monthsOfYear = [
    'January (جنوری)', 'February (فروری)', 'March (مارچ)', 'April (اپریل)',
    'May (مئی)', 'June (جون)', 'July (جولائی)', 'August (اگست)',
    'September (ستمبر)', 'October (اکتوبر)', 'November (نومبر)', 'December (دسمبر)'
  ];

  const handleAdjustHour = (delta: number) => {
    sound.playPop();
    setHours((prev) => {
      let next = prev + delta;
      if (next > 12) next = 1;
      if (next < 1) next = 12;
      return next;
    });
  };

  const handleAdjustMinute = (delta: number) => {
    sound.playPop();
    setMinutes((prev) => {
      let next = prev + delta;
      if (next >= 60) next = 0;
      if (next < 0) next = 45;
      return next;
    });
  };

  const speakTime = () => {
    const minText = minutes === 0 ? "o'clock" : minutes === 15 ? "quarter past" : minutes === 30 ? "half past" : `${minutes} minutes`;
    sound.speak(`The time is ${hours} ${minText}!`);
  };

  // Clock hand rotations
  const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;
  const minuteAngle = minutes * 6;

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
              setTab('clock');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              tab === 'clock' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            🕒 Interactive Clock
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setTab('days');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              tab === 'days' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            📅 Days of the Week
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setTab('months');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              tab === 'months' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            📆 12 Months
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-orange-200">
        {tab === 'clock' && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-black text-slate-900 font-display mb-1 text-center">
              Interactive Learning Clock
            </h2>
            <p className="text-xs text-slate-500 text-center mb-6">
              Adjust the hour and minute hands, and listen to the time!
            </p>

            {/* SVG Analog Clock */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2">
              <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-lg">
                {/* Clock Face Rim */}
                <circle cx="100" cy="100" r="92" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="8" />
                <circle cx="100" cy="100" r="82" fill="#FFFFFF" stroke="#FEF3C7" strokeWidth="2" />

                {/* 12 Hour Numbers */}
                {[
                  { n: 12, x: 100, y: 34 },
                  { n: 1, x: 135, y: 44 },
                  { n: 2, x: 160, y: 68 },
                  { n: 3, x: 170, y: 105 },
                  { n: 4, x: 160, y: 140 },
                  { n: 5, x: 135, y: 166 },
                  { n: 6, x: 100, y: 175 },
                  { n: 7, x: 65, y: 166 },
                  { n: 8, x: 40, y: 140 },
                  { n: 9, x: 30, y: 105 },
                  { n: 10, x: 40, y: 68 },
                  { n: 11, x: 65, y: 44 },
                ].map((pos) => (
                  <text
                    key={pos.n}
                    x={pos.x}
                    y={pos.y}
                    fontSize="13"
                    fontWeight="900"
                    fill="#1E293B"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {pos.n}
                  </text>
                ))}

                {/* Hour Hand (Thick, Red) */}
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="54"
                  stroke="#EF4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                  transform={`rotate(${hourAngle} 100 100)`}
                />

                {/* Minute Hand (Long, Blue) */}
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="38"
                  stroke="#3B82F6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  transform={`rotate(${minuteAngle} 100 100)`}
                />

                {/* Center Pin */}
                <circle cx="100" cy="100" r="6" fill="#F59E0B" />
                <circle cx="100" cy="100" r="2.5" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Digital Time Readout */}
            <div className="flex items-center gap-3 my-4">
              <div className="px-6 py-2 rounded-2xl bg-slate-900 text-amber-400 font-mono text-3xl font-black shadow-inner tracking-widest border-2 border-slate-700">
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
              </div>

              <button
                onClick={speakTime}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-md active:scale-95 transition-transform"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Time</span>
              </button>
            </div>

            {/* Adjustment Controls */}
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Hours:</span>
                <button
                  onClick={() => handleAdjustHour(-1)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="text-sm font-black w-6 text-center">{hours}</span>
                <button
                  onClick={() => handleAdjustHour(1)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Minutes:</span>
                <button
                  onClick={() => handleAdjustMinute(-15)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="text-sm font-black w-6 text-center">{minutes}</span>
                <button
                  onClick={() => handleAdjustMinute(15)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'days' && (
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display mb-1 text-center">
              The 7 Days of the Week (ہفتے کے سات دن)
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              Tap any day to hear its name in English and Urdu!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              {daysOfWeek.map((day, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${day.en}. In Urdu, ${day.ur}. ${day.desc}`);
                  }}
                  className="p-3.5 bg-slate-50 hover:bg-orange-50 border-2 border-slate-200 hover:border-orange-300 rounded-2xl flex items-center gap-3 cursor-pointer transition-all active:scale-95"
                >
                  <span className="text-3xl">{day.emoji}</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{day.en}</h4>
                    <span className="text-xs font-bold text-orange-700 font-urdu">{day.ur}</span>
                    <p className="text-[11px] text-slate-500">{day.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'months' && (
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display mb-1 text-center">
              The 12 Months of the Year (سال کے بارہ مہینے)
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              Tap any month to hear its name:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {monthsOfYear.map((m, i) => (
                <button
                  key={i}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`Month ${i + 1}: ${m}`);
                  }}
                  className="p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-2xl text-center active:scale-95 transition-transform"
                >
                  <span className="text-[10px] font-bold text-slate-400 block">
                    Month {i + 1}
                  </span>
                  <span className="text-xs font-black text-slate-800 block mt-0.5">
                    {m}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
