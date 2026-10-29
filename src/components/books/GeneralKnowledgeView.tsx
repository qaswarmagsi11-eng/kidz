import React, { useState } from 'react';
import { sound } from '../../services/soundService';
import {
  ArrowLeft,
  Volume2,
  Sparkles,
  Sun,
  Globe,
  Heart,
  Users,
} from 'lucide-react';

interface GeneralKnowledgeViewProps {
  onBack: () => void;
  onEarnStar: () => void;
}

type GKTab = 'planets' | 'seasons' | 'senses' | 'helpers' | 'pakistan';

export const GeneralKnowledgeView: React.FC<GeneralKnowledgeViewProps> = ({ onBack, onEarnStar }) => {
  const [tab, setTab] = useState<GKTab>('planets');

  const planets = [
    { name: 'Sun', emoji: '☀️', type: 'Giant Star', fact: 'The center of our solar system that gives us light and warmth!' },
    { name: 'Mercury', emoji: '🌑', type: '1st Planet', fact: 'The closest planet to the Sun and the smallest planet!' },
    { name: 'Venus', emoji: '🪐', type: '2nd Planet', fact: 'The hottest and brightest planet in our night sky!' },
    { name: 'Earth', emoji: '🌍', type: '3rd Planet', fact: 'Our beautiful home planet filled with oceans, animals, and life!' },
    { name: 'Mars', emoji: '🔴', type: '4th Planet', fact: 'The Red Planet with giant volcanoes and red dust!' },
    { name: 'Jupiter', emoji: '🟤', type: '5th Planet', fact: 'The biggest planet of all! More than 1,000 Earths could fit inside!' },
    { name: 'Saturn', emoji: '🪐', type: '6th Planet', fact: 'Famous for its dazzling sparkling rings made of ice and rock!' },
    { name: 'Uranus', emoji: '🧊', type: '7th Planet', fact: 'An icy cold giant planet that spins sideways like a rolling ball!' },
    { name: 'Neptune', emoji: '🔵', type: '8th Planet', fact: 'The windiest deep blue planet farthest from the Sun!' },
  ];

  const seasons = [
    { name: 'Spring (بہار)', emoji: '🌸', weather: 'Pleasant & Mild', fact: 'Flowers bloom, baby animals are born, and trees turn green!' },
    { name: 'Summer (گرما)', emoji: '☀️', weather: 'Hot & Sunny', fact: 'Long sunny days, swimming in pools, and eating sweet mangoes!' },
    { name: 'Autumn (خزاں)', emoji: '🍂', weather: 'Crisp & Breezy', fact: 'Golden brown leaves flutter down from trees!' },
    { name: 'Winter (سرما)', emoji: '❄️', weather: 'Cold & Snowy', fact: 'Warm cozy jackets, sipping hot cocoa, and watching snowflakes!' },
  ];

  const senses = [
    { sense: 'Sight (دیکھنا)', organ: 'Eyes 👁️', fact: 'We see colors, books, shapes, and smiles!' },
    { sense: 'Hearing (سننا)', organ: 'Ears 👂', fact: 'We hear music, bird songs, and friendly voices!' },
    { sense: 'Smell (سونگھنا)', organ: 'Nose 👃', fact: 'We smell fragrant flowers and warm baked cookies!' },
    { sense: 'Taste (چکھنا)', organ: 'Tongue 👅', fact: 'We taste sweet fruits, salty chips, and sour lemons!' },
    { sense: 'Touch (چھونا)', organ: 'Hands & Skin ✋', fact: 'We feel soft teddy bears, warm sunshine, and cool water!' },
  ];

  const communityHelpers = [
    { role: 'Doctor', emoji: '👩‍⚕️', duty: 'Helps us stay healthy and heals us when we are sick!' },
    { role: 'Teacher', emoji: '👨‍🏫', duty: 'Teaches us how to read, count, write, and explore the world!' },
    { role: 'Firefighter', emoji: '🧑‍🚒', duty: 'Bravely puts out dangerous fires and rescues people and pets!' },
    { role: 'Police Officer', emoji: '👮', duty: 'Keeps our neighborhoods, streets, and homes safe!' },
    { role: 'Pilot', emoji: '🧑‍✈️', duty: 'Flies giant airplanes high above the clouds across countries!' },
    { role: 'Farmer', emoji: '🧑‍🌾', duty: 'Grows healthy wheat, fresh vegetables, and delicious fruits!' },
  ];

  const pakistanSymbols = [
    { symbol: 'National Animal', name: 'Markhor (مارخور)', emoji: '🐐', fact: 'A majestic mountain goat with spiral horns!' },
    { symbol: 'National Bird', name: 'Chukar Partridge (چکور)', emoji: '🐦', fact: 'A beautiful bird with red legs and beak!' },
    { symbol: 'National Flower', name: 'Jasmine / Chambeli (چنبیلی)', emoji: '🌼', fact: 'A fragrant white flower symbolizing purity!' },
    { symbol: 'National Fruit', name: 'Mango (آم)', emoji: '🥭', fact: 'The sweet golden king of summer fruits!' },
    { symbol: 'National Tree', name: 'Deodar Cedar (دیودار)', emoji: '🌲', fact: 'A tall green cedar tree growing in northern valleys!' },
  ];

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

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sound.playPop();
              setTab('planets');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              tab === 'planets' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🪐 Solar System
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setTab('seasons');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              tab === 'seasons' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌦️ Weather & Seasons
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setTab('senses');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              tab === 'senses' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👁️ 5 Senses
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setTab('helpers');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              tab === 'helpers' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧑‍🚒 Helpers
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setTab('pakistan');
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              tab === 'pakistan' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🇵🇰 Pakistan Symbols
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-blue-200">
        {tab === 'planets' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                Our Solar System (نظام شمسی)
              </h2>
              <p className="text-xs text-slate-500">
                The Sun and the 8 planets that orbit around it:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {planets.map((p, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${p.name}. ${p.type}. ${p.fact}`);
                  }}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50 cursor-pointer transition-all active:scale-95 flex items-start gap-3"
                >
                  <span className="text-4xl">{p.emoji}</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{p.name}</h3>
                    <span className="text-[10px] font-bold text-blue-600 block">{p.type}</span>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">{p.fact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'seasons' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                The 4 Beautiful Seasons (چار موسم)
              </h2>
              <p className="text-xs text-slate-500">
                How our Earth changes throughout the year:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {seasons.map((s, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${s.name}. Weather is ${s.weather}. ${s.fact}`);
                  }}
                  className="p-5 rounded-3xl border-2 border-slate-200 hover:border-amber-300 bg-slate-50 hover:bg-amber-50 cursor-pointer transition-all active:scale-95 flex items-center gap-4"
                >
                  <span className="text-6xl">{s.emoji}</span>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{s.name}</h3>
                    <span className="text-xs font-bold text-amber-700 block">Weather: {s.weather}</span>
                    <p className="text-xs text-slate-600 mt-1">{s.fact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'senses' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                The 5 Wonderful Senses (پانچ حواس)
              </h2>
              <p className="text-xs text-slate-500">
                How our amazing body discovers the world:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {senses.map((sn, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${sn.sense}. Organ: ${sn.organ}. ${sn.fact}`);
                  }}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-pink-300 bg-slate-50 hover:bg-pink-50 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <span className="text-4xl block mb-2">{sn.organ.split(' ')[1]}</span>
                  <h3 className="text-sm font-black text-slate-900">{sn.sense}</h3>
                  <span className="text-[11px] font-bold text-pink-600 block">{sn.organ}</span>
                  <p className="text-xs text-slate-600 mt-2">{sn.fact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'helpers' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                Community Helpers
              </h2>
              <p className="text-xs text-slate-500">
                People who work hard to make our world safe, healthy, and happy:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {communityHelpers.map((h, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${h.role}! ${h.duty}`);
                  }}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-300 bg-slate-50 hover:bg-teal-50 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <span className="text-5xl block mb-2">{h.emoji}</span>
                  <h3 className="text-sm font-black text-slate-900">{h.role}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{h.duty}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'pakistan' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-emerald-900 font-display">
                National Symbols of Pakistan (قومی نشانات)
              </h2>
              <p className="text-xs text-slate-500">
                Proud heritage and nature symbols of Pakistan:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pakistanSymbols.map((sym, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${sym.symbol}. ${sym.name}. ${sym.fact}`);
                  }}
                  className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 cursor-pointer transition-all active:scale-95 flex items-center gap-4"
                >
                  <span className="text-6xl">{sym.emoji}</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                      {sym.symbol}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 font-urdu">{sym.name}</h3>
                    <p className="text-xs text-slate-600 mt-1">{sym.fact}</p>
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
