import React, { useState, useEffect } from 'react';
import { ChildProfile } from '../types';
import { sound } from '../services/soundService';
import {
  Volume2,
  VolumeX,
  Music,
  Shield,
  Download,
  Star,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface HeaderProps {
  currentProfile: ChildProfile;
  totalStars: number;
  onOpenParentGate: () => void;
  onOpenProfile: () => void;
  onOpenAITutor: () => void;
  onResetWelcome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  totalStars,
  onOpenParentGate,
  onOpenProfile,
  onOpenAITutor,
  onResetWelcome,
}) => {
  const [soundOn, setSoundOn] = useState(sound.soundEnabled);
  const [musicOn, setMusicOn] = useState(sound.musicEnabled);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const toggleSound = () => {
    sound.soundEnabled = !soundOn;
    setSoundOn(!soundOn);
    if (!soundOn) sound.playPop();
  };

  const toggleMusic = () => {
    const newState = sound.toggleMusic();
    setMusicOn(newState);
  };

  const handleInstallClick = async () => {
    sound.playPop();
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onResetWelcome}
              className="group flex items-center gap-2 text-left focus:outline-hidden"
              title="Return to Welcome Screen"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-pink-400 to-amber-300 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform text-xl border-2 border-white">
                🐼
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-display leading-tight flex items-center gap-1">
                  <span>LITTLE GENIUS</span>
                  <span className="text-sky-500 font-bold text-xs uppercase bg-sky-100 px-1.5 py-0.5 rounded-md">Kids</span>
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 -mt-0.5 hidden xs:inline">
                  Learn • Play • Grow
                </span>
              </div>
            </button>
          </div>

          {/* Quick Actions Zone */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Stars Counter */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-amber-50 border border-amber-200 rounded-full shadow-xs cursor-pointer hover:bg-amber-100 transition-colors"
              onClick={() => {
                sound.playSuccess();
              }}
              title="Total Stars Earned"
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-xs sm:text-sm font-extrabold text-amber-800 tabular-nums">
                {totalStars}
              </span>
            </div>

            {/* Active Child Profile Trigger */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenProfile();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-full transition-colors text-xs font-bold text-sky-800"
              title="Child Profile"
            >
              <span className="text-base">{currentProfile.avatar}</span>
              <span className="hidden sm:inline max-w-[80px] truncate">{currentProfile.name}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
              className={`p-2 rounded-xl transition-colors ${
                soundOn
                  ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Music Toggle */}
            <button
              onClick={toggleMusic}
              aria-label={musicOn ? 'Mute background lullaby' : 'Play background lullaby'}
              className={`p-2 rounded-xl transition-colors ${
                musicOn
                  ? 'bg-pink-100 text-pink-700 hover:bg-pink-200 animate-pulse'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Music className="w-4 h-4" />
            </button>

            {/* PWA Install Button (if available) */}
            {(!isInstalled && (deferredPrompt || isIOS)) && (
              <button
                onClick={handleInstallClick}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm active:scale-95 transition-all"
                title="Install Little Genius Kids App"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            {/* Parent Gate Lock */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenParentGate();
              }}
              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl transition-colors flex items-center gap-1"
              title="Parents Dashboard"
            >
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold hidden lg:inline">Parents</span>
            </button>
          </div>
        </div>
      </header>

      {/* iOS Safari Install Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-sky-200 text-center">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Install on iPhone or iPad</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              1. Tap the <strong className="text-sky-600">Share</strong> button at the bottom of Safari.<br />
              2. Scroll down and tap <strong className="text-sky-600">Add to Home Screen</strong>.<br />
              3. Enjoy Little Genius Kids fullscreen!
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-sky-500 text-white font-bold text-sm shadow-md hover:bg-sky-600 active:scale-95 transition-transform"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
