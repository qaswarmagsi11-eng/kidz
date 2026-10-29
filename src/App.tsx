import React, { useState, useEffect } from 'react';
import { ChildProfile, CategoryId } from './types';
import { sound } from './services/soundService';

// Components
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { ParentModal } from './components/ParentModal';
import { ChildProfileModal } from './components/ChildProfileModal';
import { AITutorModal } from './components/AITutorModal';

// Books & Modules
import { AlphabetBook } from './components/books/AlphabetBook';
import { NumberBook } from './components/books/NumberBook';
import { ColorBook } from './components/books/ColorBook';
import { ShapeBook } from './components/books/ShapeBook';
import { AnimalBook } from './components/books/AnimalBook';
import { FruitVegBook } from './components/books/FruitVegBook';
import { MathLearning } from './components/books/MathLearning';
import { UrduLearning } from './components/books/UrduLearning';
import { IslamicLearning } from './components/books/IslamicLearning';
import { EnglishLearning } from './components/books/EnglishLearning';
import { RhymesLibrary } from './components/books/RhymesLibrary';
import { StorybookLibrary } from './components/books/StorybookLibrary';
import { GeneralKnowledgeView } from './components/books/GeneralKnowledgeView';
import { TimeCalendarView } from './components/books/TimeCalendarView';
import { VehiclesView } from './components/books/VehiclesView';
import { BodyView } from './components/books/BodyView';
import { RewardsView } from './components/books/RewardsView';
import { GameCenter } from './components/games/GameCenter';
import { DrawingStudio } from './components/studio/DrawingStudio';

const STORAGE_KEY_PROFILES = 'little_genius_profiles_v1';
const STORAGE_KEY_CURRENT = 'little_genius_active_profile_v1';
const STORAGE_KEY_WELCOME = 'little_genius_has_seen_welcome_v1';

const DEFAULT_PROFILE: ChildProfile = {
  id: 'profile-default',
  name: 'Little Genius',
  ageGroup: '5-6',
  avatar: '🐼',
  language: 'english',
  stars: 12,
  completedLessons: ['abc-intro', 'numbers-1-10', 'animals-farm'],
  favoriteMascot: 'Panda',
  createdAt: Date.now(),
  timeSpentMinutes: 25,
};

export default function App() {
  // Profiles persistence
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [DEFAULT_PROFILE];
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) return saved;
    } catch {}
    return DEFAULT_PROFILE.id;
  });

  const currentProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILE;

  // Welcome Screen state
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY_WELCOME);
      return !seen;
    } catch {
      return true;
    }
  });

  // Navigation & Active View state
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);

  // Modals state
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);

  // Save profiles
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
      localStorage.setItem(STORAGE_KEY_CURRENT, activeProfileId);
    } catch {}
  }, [profiles, activeProfileId]);

  // Handle Stars Increment
  const handleEarnStar = () => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === currentProfile.id) {
          return { ...p, stars: p.stars + 1 };
        }
        return p;
      })
    );
  };

  const handleUpdateProfile = (updated: ChildProfile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreateProfile = (newProfile: ChildProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const handleResetProgress = () => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === currentProfile.id) {
          return { ...p, stars: 0, completedLessons: [] };
        }
        return p;
      })
    );
  };

  const handleStartFromWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem(STORAGE_KEY_WELCOME, 'true');
  };

  // Bottom Navigation tab switch
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setActiveCategory(null);
    } else if (tab === 'learn') {
      setActiveCategory('abc');
    } else if (tab === 'games') {
      setActiveCategory('games');
    } else if (tab === 'create') {
      setActiveCategory('drawing');
    } else if (tab === 'rewards') {
      setActiveCategory('rewards');
    }
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setActiveCategory(catId);
    if (catId === 'games' || catId === 'puzzles') setActiveTab('games');
    else if (catId === 'drawing') setActiveTab('create');
    else if (catId === 'rewards') setActiveTab('rewards');
    else setActiveTab('learn');
  };

  const handleBackToDashboard = () => {
    sound.playPop();
    setActiveCategory(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/60 text-slate-800 antialiased selection:bg-amber-300">
      {/* Welcome Screen Intro Overlay */}
      {showWelcome && (
        <WelcomeScreen onStart={handleStartFromWelcome} />
      )}

      {/* Persistent Child-Friendly Header */}
      <Header
        currentProfile={currentProfile}
        totalStars={currentProfile.stars}
        onOpenParentGate={() => setIsParentOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAITutor={() => setIsAITutorOpen(true)}
        onResetWelcome={() => setShowWelcome(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If no specific category is selected, or on Home tab */}
        {activeCategory === null || activeTab === 'home' ? (
          <HomeDashboard
            currentProfile={currentProfile}
            onSelectCategory={handleSelectCategory}
            onOpenAITutor={() => setIsAITutorOpen(true)}
          />
        ) : (
          /* Render Active Learning Category / Book */
          <>
            {activeCategory === 'abc' && (
              <AlphabetBook onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'numbers' && (
              <NumberBook onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'colors' && (
              <ColorBook onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'shapes' && (
              <ShapeBook onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'animals' && (
              <AnimalBook onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'fruits-veg' && (
              <FruitVegBook onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'vehicles' && (
              <VehiclesView onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'body' && (
              <BodyView onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'math' && (
              <MathLearning onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'english' && (
              <EnglishLearning onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'urdu' && (
              <UrduLearning onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'islamic' && (
              <IslamicLearning onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {(activeCategory === 'games' || activeCategory === 'puzzles') && (
              <GameCenter onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'drawing' && (
              <DrawingStudio onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'rhymes' && (
              <RhymesLibrary onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'stories' && (
              <StorybookLibrary onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'gk' && (
              <GeneralKnowledgeView onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'time' && (
              <TimeCalendarView onBack={handleBackToDashboard} onEarnStar={handleEarnStar} />
            )}
            {activeCategory === 'rewards' && (
              <RewardsView onBack={handleBackToDashboard} profile={currentProfile} />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation Bar with Buddy Panda launcher */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenAITutor={() => setIsAITutorOpen(true)}
      />

      {/* Parental Gate & Dashboard Modal */}
      <ParentModal
        isOpen={isParentOpen}
        onClose={() => setIsParentOpen(false)}
        profiles={profiles}
        currentProfile={currentProfile}
        onSelectProfile={(p) => setActiveProfileId(p.id)}
        onUpdateProfile={handleUpdateProfile}
        onResetProgress={handleResetProgress}
      />

      {/* Quick Profile Switcher Modal */}
      <ChildProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profiles={profiles}
        currentProfile={currentProfile}
        onSelectProfile={(p) => setActiveProfileId(p.id)}
        onCreateProfile={handleCreateProfile}
      />

      {/* Buddy the Panda AI Learning Assistant Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        profile={currentProfile}
      />
    </div>
  );
}
