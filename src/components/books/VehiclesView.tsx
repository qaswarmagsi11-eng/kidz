import React, { useState } from 'react';
import { sound } from '../../services/soundService';
import { ArrowLeft, Volume2, Sparkles } from 'lucide-react';

interface VehiclesViewProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({ onBack, onEarnStar }) => {
  const vehicles = [
    { name: 'Car', urdu: 'کار (Car)', emoji: '🚗', soundName: 'Vroom Vroom!', fact: 'Cars travel on roads and take families on trips!' },
    { name: 'School Bus', urdu: 'سکول بس (School Bus)', emoji: '🚌', soundName: 'Honk Honk!', fact: 'Buses can carry dozens of students to school together!' },
    { name: 'Train', urdu: 'ریل گاڑی (Rail Gaadi)', emoji: '🚂', soundName: 'Choo Choo!', fact: 'Trains run smoothly along long metal tracks and over bridges!' },
    { name: 'Airplane', urdu: 'ہوائی جہاز (Hawai Jahaaz)', emoji: '✈️', soundName: 'Whoooosh!', fact: 'Airplanes fly high up in the clouds faster than any car!' },
    { name: 'Space Rocket', urdu: 'راکٹ (Rocket)', emoji: '🚀', soundName: '3, 2, 1 Blast Off!', fact: 'Rockets travel to outer space to visit the Moon and planets!' },
    { name: 'Bicycle', urdu: 'سائیکل (Cycle)', emoji: '🚲', soundName: 'Ring Ring!', fact: 'Riding a bicycle is great exercise and good for the planet!' },
    { name: 'Sailboat', urdu: 'کشتی (Kashti)', emoji: '⛵', soundName: 'Splash Splash!', fact: 'Sailboats use the natural ocean wind to glide over the waves!' },
    { name: 'Ambulance', urdu: 'ایمبولینس (Ambulance)', emoji: '🚑', soundName: 'Wee-Woo Wee-Woo!', fact: 'Ambulances have sirens to rush sick people quickly to doctors!' },
    { name: 'Fire Engine', urdu: 'فائر بریگیڈ (Fire Engine)', emoji: '🚒', soundName: 'Nee-Naw!', fact: 'Fire engines carry long ladders and powerful water hoses!' },
    { name: 'Helicopter', urdu: 'ہیلی کاپٹر (Helicopter)', emoji: '🚁', soundName: 'Chop Chop Chop!', fact: 'Helicopters have spinning blades and can land in tight spots!' },
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

        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
          🚗 10 Travel Vehicles
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-blue-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Vehicles & Transportation (گاڑیاں اور سواریاں)
          </h2>
          <p className="text-xs text-slate-500">
            Tap any vehicle to hear its name and fun sound!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {vehicles.map((v, i) => (
            <div
              key={i}
              onClick={() => {
                sound.playPop();
                sound.speak(`${v.name}! In Urdu, ${v.urdu}. It says ${v.soundName}! ${v.fact}`);
              }}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 cursor-pointer transition-all active:scale-95 flex items-center gap-3.5 group"
            >
              <span className="text-5xl group-hover:scale-110 transition-transform">
                {v.emoji}
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900">{v.name}</h3>
                <span className="text-xs font-bold text-blue-700 font-urdu block">{v.urdu}</span>
                <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Sound: {v.soundName}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{v.fact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
