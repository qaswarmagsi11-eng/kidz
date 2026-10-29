import React from 'react';
import { Home, BookOpen, Gamepad2, Palette, Trophy, Sparkles } from 'lucide-react';
import { sound } from '../services/soundService';

export type NavTab = 'home' | 'learn' | 'games' | 'create' | 'rewards';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAITutor: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAITutor,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home, color: 'text-sky-500' },
    { id: 'learn' as NavTab, label: 'Learn', icon: BookOpen, color: 'text-purple-500' },
    { id: 'games' as NavTab, label: 'Games', icon: Gamepad2, color: 'text-amber-500' },
    { id: 'create' as NavTab, label: 'Create', icon: Palette, color: 'text-pink-500' },
    { id: 'rewards' as NavTab, label: 'Rewards', icon: Trophy, color: 'text-emerald-500' },
  ];

  const handleTabClick = (id: NavTab) => {
    sound.playPop();
    onTabChange(id);
  };

  return (
    <>
      {/* Floating Buddy Panda AI Tutor Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => {
            sound.playSuccess();
            onOpenAITutor();
          }}
          className="group relative flex items-center gap-2 pl-3 pr-4 py-2 bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400 text-white rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all border-2 border-white btn-3d"
          title="Ask Buddy the Panda"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-inner">
            🐼
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black leading-none drop-shadow-xs">Ask Buddy!</span>
            <span className="text-[10px] font-bold text-amber-100 leading-none mt-0.5">AI Tutor</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin" style={{ animationDuration: '6s' }} />
        </button>
      </div>

      {/* Main Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 py-1.5 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all rounded-xl relative ${
                  isActive
                    ? 'text-sky-600 scale-105'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-sky-400 to-pink-400 rounded-full" />
                )}
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-sky-50 shadow-xs' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                    isActive ? 'font-black text-slate-900' : 'font-semibold'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
