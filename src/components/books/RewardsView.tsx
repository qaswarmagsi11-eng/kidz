import React from 'react';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Trophy,
  Star,
  Award,
  Sparkles,
  CheckCircle2,
  PartyPopper,
} from 'lucide-react';
import { ChildProfile } from '../../types';

interface RewardsViewProps {
  onBack: () => void;
  profile: ChildProfile;
}

export const RewardsView: React.FC<RewardsViewProps> = ({ onBack, profile }) => {
  const milestones = [
    { title: 'Bronze Star', req: 5, icon: '⭐', desc: 'Started learning journey!', unlocked: profile.stars >= 5 },
    { title: 'Silver Star', req: 15, icon: '🌟', desc: 'Completed multiple learning lessons!', unlocked: profile.stars >= 15 },
    { title: 'Gold Trophy', req: 30, icon: '🏆', desc: 'Math & Alphabet Explorer!', unlocked: profile.stars >= 30 },
    { title: 'Learning Champion', req: 50, icon: '👑', desc: 'Mastered stories, numbers & games!', unlocked: profile.stars >= 50 },
    { title: 'Little Genius Graduate', req: 75, icon: '🎓', desc: 'Ultimate all-in-one learning master!', unlocked: profile.stars >= 75 },
  ];

  const handleCelebrate = () => {
    sound.playSuccess();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
    });
    sound.speak(`You have earned ${profile.stars} stars! Keep shining, Little Genius!`);
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

        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>Achievements</span>
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300">
        {/* Big Champion Header */}
        <div className="text-center py-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-pink-50 rounded-3xl border-2 border-amber-200 mb-8 shadow-inner">
          <div className="text-6xl mb-2 animate-bounce">🏆</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            {profile.name}'s Star Trophy Room
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Every lesson, game, and book you finish earns shiny stars!
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-md text-amber-950 font-black text-xl sm:text-2xl border-2 border-white">
            <Star className="w-6 h-6 fill-amber-300 text-amber-900" />
            <span>{profile.stars} Total Stars Earned!</span>
          </div>

          <div className="mt-4">
            <button
              onClick={handleCelebrate}
              className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs shadow-md active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <PartyPopper className="w-4 h-4" />
              <span>Celebrate With Confetti! 🎉</span>
            </button>
          </div>
        </div>

        {/* Milestones List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Badges & Trophies to Unlock:</span>
          </h3>

          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  m.unlocked
                    ? 'border-amber-300 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl p-2 bg-white rounded-2xl shadow-2xs border border-amber-100">
                    {m.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <span>{m.title}</span>
                      {m.unlocked && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Unlocked!
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{m.desc}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">
                    {m.unlocked ? `${m.req} / ${m.req}` : `${profile.stars} / ${m.req}`} ⭐
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
