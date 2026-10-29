export type AgeGroup = '2-4' | '5-6' | '7-8' | '9-10';
export type AppLanguage = 'english' | 'urdu' | 'roman-urdu';

export interface ChildProfile {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  avatar: string;
  language: AppLanguage;
  stars: number;
  completedLessons: string[];
  favoriteMascot: string;
  createdAt: number;
  timeSpentMinutes: number;
}

export type CategoryId =
  | 'abc'
  | 'numbers'
  | 'colors'
  | 'shapes'
  | 'animals'
  | 'fruits-veg'
  | 'vehicles'
  | 'body'
  | 'math'
  | 'english'
  | 'urdu'
  | 'islamic'
  | 'games'
  | 'drawing'
  | 'rhymes'
  | 'stories'
  | 'gk'
  | 'puzzles'
  | 'time'
  | 'rewards';

export interface LearningCategory {
  id: CategoryId;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  textColor: string;
  badge: string;
  ageRecommendation: string;
}

export interface AlphabetItem {
  letter: string;
  lowercase: string;
  word: string;
  emoji: string;
  phonetic: string;
  sentence: string;
  fact: string;
  color: string;
}

export interface NumberItem {
  number: number;
  word: string;
  urduWord?: string;
  urduNumber?: string;
  itemsEmoji: string;
  fact: string;
}

export interface ColorItem {
  id: string;
  name: string;
  urduName: string;
  hex: string;
  lightHex: string;
  description: string;
  examples: { name: string; emoji: string }[];
}

export interface ShapeItem {
  id: string;
  name: string;
  urduName: string;
  type: '2D' | '3D';
  sides: number | string;
  emoji: string;
  realWorld: string[];
  description: string;
}

export interface AnimalItem {
  id: string;
  name: string;
  urduName: string;
  category: 'Farm' | 'Wild' | 'Pet' | 'Birds' | 'Sea';
  emoji: string;
  soundDescription: string;
  habitat: string;
  funFact: string;
}

export interface FruitVegItem {
  id: string;
  name: string;
  urduName: string;
  urduScript: string;
  type: 'Fruit' | 'Vegetable';
  color: string;
  emoji: string;
  fact: string;
}

export interface UrduLetterItem {
  letter: string;
  name: string;
  romanName: string;
  word: string;
  urduScriptWord: string;
  meaning: string;
  emoji: string;
}

export interface IslamicItem {
  id: string;
  category: 'Dua' | 'Pillar' | 'Kalima' | 'Manners' | 'Names';
  title: string;
  arabic: string;
  urduMeaning: string;
  englishMeaning: string;
  explanation: string;
}

export interface StoryPage {
  pageNum: number;
  sceneEmoji: string;
  text: string;
  urduText?: string;
}

export interface Storybook {
  id: string;
  title: string;
  urduTitle?: string;
  category: string;
  coverEmoji: string;
  moral: string;
  pages: StoryPage[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface RhymeItem {
  id: string;
  title: string;
  urduTitle?: string;
  emoji: string;
  category: string;
  lines: string[];
  urduLines?: string[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredStars: number;
  unlocked: boolean;
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  narrationEnabled: boolean;
  speechRate: number;
  screenTimeLimitMinutes: number;
}
