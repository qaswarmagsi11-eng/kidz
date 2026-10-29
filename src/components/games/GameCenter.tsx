import React, { useState, useEffect } from 'react';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  Gamepad2,
  Star,
} from 'lucide-react';

interface GameCenterProps {
  onBack: () => void;
  onEarnStar: () => void;
}

type ActiveGame =
  | 'menu'
  | 'memory'
  | 'balloon'
  | 'animal-sound'
  | 'counting'
  | 'missing-letter'
  | 'math-runner';

export const GameCenter: React.FC<GameCenterProps> = ({ onBack, onEarnStar }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryScore, setMemoryScore] = useState(0);

  // Balloon Pop State
  const [targetBalloonLetter, setTargetBalloonLetter] = useState('A');
  const [balloons, setBalloons] = useState<{ id: number; letter: string; color: string; popped: boolean }[]>([]);
  const [balloonScore, setBalloonScore] = useState(0);

  // Animal Sound State
  const [targetAnimal, setTargetAnimal] = useState<{ name: string; emoji: string; soundName: string }>({ name: 'Cat', emoji: '🐱', soundName: 'Meow' });
  const [animalChoices, setAnimalChoices] = useState<{ name: string; emoji: string }[]>([]);
  const [animalScore, setAnimalScore] = useState(0);

  // Counting Game State
  const [targetCountNumber, setTargetCountNumber] = useState(4);
  const [countItems, setCountItems] = useState<string[]>([]);
  const [countChoices, setCountChoices] = useState<number[]>([]);

  // Missing Letter State
  const [missingWord, setMissingWord] = useState<{ word: string; display: string; missing: string; emoji: string }>({ word: 'CAT', display: 'C _ T', missing: 'A', emoji: '🐱' });
  const [letterChoices, setLetterChoices] = useState<string[]>([]);

  // ===================== MEMORY GAME SETUP =====================
  const initMemoryGame = () => {
    sound.playPop();
    const emojis = ['🍎', '🐱', '⭐', '🎈', '🚗', '🦁'];
    const pairCount = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 4 : 6;
    const selected = emojis.slice(0, pairCount);
    const doubled = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({
        id: idx,
        symbol,
        flipped: false,
        matched: false,
      }));
    setMemoryCards(doubled);
    setFlippedIndices([]);
    setMemoryScore(0);
    sound.speak("Find the matching pairs!");
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || memoryCards[index].flipped || memoryCards[index].matched) return;

    sound.playPop();
    const newCards = [...memoryCards];
    newCards[index].flipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].symbol === newCards[secondIdx].symbol) {
        // Matched!
        setTimeout(() => {
          sound.playSuccess();
          newCards[firstIdx].matched = true;
          newCards[secondIdx].matched = true;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
          setMemoryScore((s) => s + 1);

          // Check if all matched
          if (newCards.every((c) => c.matched)) {
            confetti({ particleCount: 50, spread: 70 });
            sound.speak("Woohoo! You matched all pairs! You are a Memory Champion!");
            onEarnStar();
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          sound.playBoing();
          newCards[firstIdx].flipped = false;
          newCards[secondIdx].flipped = false;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  // ===================== BALLOON POP SETUP =====================
  const initBalloonGame = () => {
    sound.playPop();
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const colors = ['bg-rose-400', 'bg-sky-400', 'bg-amber-400', 'bg-emerald-400', 'bg-purple-400', 'bg-pink-400'];
    const target = letters[Math.floor(Math.random() * letters.length)];
    setTargetBalloonLetter(target);

    // Create 8 balloons
    const list = Array.from({ length: 8 }, (_, i) => {
      const isTarget = i === 0 || Math.random() > 0.6;
      return {
        id: i,
        letter: isTarget ? target : letters[Math.floor(Math.random() * letters.length)],
        color: colors[i % colors.length],
        popped: false,
      };
    }).sort(() => Math.random() - 0.5);

    setBalloons(list);
    sound.speak(`Pop all the balloons with letter ${target}!`);
  };

  const handlePopBalloon = (id: number, letter: string) => {
    if (letter === targetBalloonLetter) {
      sound.playPop();
      setBalloons((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
      setBalloonScore((s) => s + 1);
      confetti({ particleCount: 20, spread: 40 });
      onEarnStar();

      // Check remaining
      const unpoppedTargets = balloons.filter((b) => b.letter === targetBalloonLetter && !b.popped && b.id !== id);
      if (unpoppedTargets.length === 0) {
        sound.playSuccess();
        setTimeout(initBalloonGame, 1000);
      }
    } else {
      sound.playBoing();
      sound.speak(`That's letter ${letter}! Look for letter ${targetBalloonLetter}!`);
    }
  };

  // ===================== ANIMAL SOUND QUIZ =====================
  const initAnimalGame = () => {
    sound.playPop();
    const animalPool = [
      { name: 'Cat', emoji: '🐱', soundName: 'Meow' },
      { name: 'Dog', emoji: '🐶', soundName: 'Woof Woof' },
      { name: 'Cow', emoji: '🐄', soundName: 'Moo' },
      { name: 'Duck', emoji: '🦆', soundName: 'Quack' },
      { name: 'Lion', emoji: '🦁', soundName: 'Roar' },
      { name: 'Bird', emoji: '🐦', soundName: 'Chirp' },
    ];
    const picked = animalPool[Math.floor(Math.random() * animalPool.length)];
    setTargetAnimal(picked);

    const choices = [picked];
    while (choices.length < 3) {
      const r = animalPool[Math.floor(Math.random() * animalPool.length)];
      if (!choices.find((c) => c.name === r.name)) choices.push(r);
    }
    setAnimalChoices(choices.sort(() => Math.random() - 0.5));
    sound.playAnimalSound(picked.name);
    sound.speak(`Listen! Who makes this sound? ${picked.soundName}!`);
  };

  const handleAnswerAnimal = (name: string) => {
    if (name === targetAnimal.name) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 60 });
      sound.speak(`Yes! The ${targetAnimal.name} says ${targetAnimal.soundName}!`);
      onEarnStar();
      setAnimalScore((s) => s + 1);
      setTimeout(initAnimalGame, 1200);
    } else {
      sound.playBoing();
      sound.speak("Try listening again!");
    }
  };

  // ===================== COUNTING GAME =====================
  const initCountingGame = () => {
    sound.playPop();
    const count = Math.floor(Math.random() * 7) + 2;
    setTargetCountNumber(count);
    setCountItems(Array.from({ length: count }, () => '🍎'));

    const fake1 = count + 1;
    const fake2 = Math.max(1, count - 1);
    setCountChoices([count, fake1, fake2].sort(() => Math.random() - 0.5));
    sound.speak("How many apples do you see on the screen?");
  };

  const handleAnswerCount = (num: number) => {
    if (num === targetCountNumber) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 60 });
      sound.speak(`Correct! There are ${targetCountNumber} apples!`);
      onEarnStar();
      setTimeout(initCountingGame, 1200);
    } else {
      sound.playBoing();
      sound.speak("Count them carefully one by one!");
    }
  };

  // ===================== MISSING LETTER GAME =====================
  const initMissingLetterGame = () => {
    sound.playPop();
    const wordPool = [
      { word: 'CAT', display: 'C _ T', missing: 'A', emoji: '🐱' },
      { word: 'DOG', display: 'D _ G', missing: 'O', emoji: '🐶' },
      { word: 'SUN', display: 'S _ N', missing: 'U', emoji: '☀️' },
      { word: 'PEN', display: 'P _ N', missing: 'E', emoji: '🖊️' },
      { word: 'PIG', display: 'P _ G', missing: 'I', emoji: '🐷' },
    ];
    const picked = wordPool[Math.floor(Math.random() * wordPool.length)];
    setMissingWord(picked);

    const fakes = ['A', 'E', 'I', 'O', 'U'].filter((v) => v !== picked.missing);
    const choices = [picked.missing, fakes[0], fakes[1]].sort(() => Math.random() - 0.5);
    setLetterChoices(choices);
    sound.speak(`Complete the word: ${picked.display}! Which vowel is missing?`);
  };

  const handleAnswerMissingLetter = (letter: string) => {
    if (letter === missingWord.missing) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 60 });
      sound.speak(`Bravo! ${missingWord.word}!`);
      onEarnStar();
      setTimeout(initMissingLetterGame, 1200);
    } else {
      sound.playBoing();
      sound.speak("Try another letter!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          onClick={() => {
            if (activeGame === 'menu') onBack();
            else setActiveGame('menu');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-xs border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeGame === 'menu' ? 'Home' : 'Games Menu'}</span>
        </button>

        {activeGame !== 'menu' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Difficulty: {difficulty}
            </span>
          </div>
        )}
      </div>

      {/* GAMES HUB MENU */}
      {activeGame === 'menu' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
            <div className="text-5xl mb-2 animate-bounce">🎮</div>
            <h2 className="text-2xl sm:text-3xl font-black font-display drop-shadow-xs">
              Kids Educational Games Center
            </h2>
            <p className="text-xs sm:text-sm text-white/95 font-semibold mt-1 max-w-md mx-auto">
              Play interactive mini-games, test your memory, pop balloons, solve puzzles, and collect shiny stars!
            </p>

            {/* Difficulty Tabs */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-xs font-bold text-white/90">Difficulty:</span>
              {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    sound.playPop();
                    setDifficulty(d);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                    difficulty === d
                      ? 'bg-white text-slate-900 shadow-md scale-105'
                      : 'bg-black/20 text-white hover:bg-black/30'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Game 1: Memory Cards */}
            <div
              onClick={() => {
                setActiveGame('memory');
                initMemoryGame();
              }}
              className="p-5 bg-white rounded-3xl border-3 border-amber-200 shadow-md hover:shadow-xl hover:border-amber-400 cursor-pointer transition-all active:scale-98 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform">
                🃏
              </div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Memory Cards Match
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Flip cards and match cute animals and fruits!
              </p>
              <span className="mt-3 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                Play Memory →
              </span>
            </div>

            {/* Game 2: Balloon Pop */}
            <div
              onClick={() => {
                setActiveGame('balloon');
                initBalloonGame();
              }}
              className="p-5 bg-white rounded-3xl border-3 border-pink-200 shadow-md hover:shadow-xl hover:border-pink-400 cursor-pointer transition-all active:scale-98 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform">
                🎈
              </div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Balloon Pop Letter Challenge
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Pop balloons containing the target letter!
              </p>
              <span className="mt-3 text-xs font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-full">
                Play Balloon Pop →
              </span>
            </div>

            {/* Game 3: Animal Sound Quiz */}
            <div
              onClick={() => {
                setActiveGame('animal-sound');
                initAnimalGame();
              }}
              className="p-5 bg-white rounded-3xl border-3 border-cyan-200 shadow-md hover:shadow-xl hover:border-cyan-400 cursor-pointer transition-all active:scale-98 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform">
                🦁
              </div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Animal Sounds Detective
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Listen to the animal sound and identify the friend!
              </p>
              <span className="mt-3 text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
                Play Animal Sound →
              </span>
            </div>

            {/* Game 4: Number Counting */}
            <div
              onClick={() => {
                setActiveGame('counting');
                initCountingGame();
              }}
              className="p-5 bg-white rounded-3xl border-3 border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-400 cursor-pointer transition-all active:scale-98 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform">
                🍎
              </div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Quick Count Challenge
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Count the bouncy fruits and pick the right number!
              </p>
              <span className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Play Counting →
              </span>
            </div>

            {/* Game 5: Missing Letter */}
            <div
              onClick={() => {
                setActiveGame('missing-letter');
                initMissingLetterGame();
              }}
              className="p-5 bg-white rounded-3xl border-3 border-purple-200 shadow-md hover:shadow-xl hover:border-purple-400 cursor-pointer transition-all active:scale-98 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform">
                🔤
              </div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Missing Letter Vowel Builder
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Find the missing vowel to finish the 3-letter word!
              </p>
              <span className="mt-3 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                Play Missing Letter →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* GAME 1: MEMORY CARDS ACTIVE */}
      {activeGame === 'memory' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
              <span>🃏 Memory Flip Challenge</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Pairs: {memoryScore}
              </span>
            </h3>
            <button
              onClick={initMemoryGame}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto my-6">
            {memoryCards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`h-24 sm:h-28 rounded-2xl border-3 text-4xl flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
                  card.flipped || card.matched
                    ? 'bg-amber-50 border-amber-400 rotate-0 shadow-md'
                    : 'bg-gradient-to-tr from-amber-400 to-orange-400 border-white shadow-xs text-transparent'
                }`}
              >
                {card.flipped || card.matched ? card.symbol : '❓'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 2: BALLOON POP ACTIVE */}
      {activeGame === 'balloon' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 font-display">
                🎈 Pop Balloons with letter: <span className="text-pink-600 text-2xl font-black">{targetBalloonLetter}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tap on any balloon with letter "{targetBalloonLetter}" to pop it!
              </p>
            </div>
            <button
              onClick={initBalloonGame}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Letter</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4 my-6">
            {balloons.map((b) => (
              <button
                key={b.id}
                disabled={b.popped}
                onClick={() => handlePopBalloon(b.id, b.letter)}
                className={`h-28 sm:h-36 rounded-full flex flex-col items-center justify-center text-3xl sm:text-4xl font-black text-white shadow-md border-3 border-white transition-all transform active:scale-90 ${
                  b.popped ? 'opacity-20 scale-50 pointer-events-none' : `${b.color} hover:scale-105 animate-float`
                }`}
                style={{ animationDelay: `${b.id * 0.2}s` }}
              >
                <span>{b.popped ? '💥' : b.letter}</span>
                {!b.popped && <span className="text-[10px] opacity-70 font-bold mt-1">🎈</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 3: ANIMAL SOUND ACTIVE */}
      {activeGame === 'animal-sound' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-cyan-200 text-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-slate-900 font-display">
              🦁 Who Makes This Sound?
            </h3>
            <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full">
              Score: {animalScore} ⭐
            </span>
          </div>

          <div className="my-6 p-6 bg-cyan-50 rounded-3xl border-2 border-cyan-200 max-w-sm mx-auto">
            <button
              onClick={() => sound.playAnimalSound(targetAnimal.name)}
              className="w-20 h-20 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-3xl mx-auto shadow-md hover:scale-105 active:scale-95 transition-transform"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <span className="text-xs font-black text-slate-700 block mt-2">
              Tap to replay sound! ({targetAnimal.soundName})
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {animalChoices.map((choice) => (
              <button
                key={choice.name}
                onClick={() => handleAnswerAnimal(choice.name)}
                className="p-4 bg-slate-50 hover:bg-cyan-50 border-2 border-slate-200 hover:border-cyan-300 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95"
              >
                <span className="text-5xl mb-1">{choice.emoji}</span>
                <span className="text-xs font-bold text-slate-800">{choice.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 4: COUNTING ACTIVE */}
      {activeGame === 'counting' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-200 text-center">
          <h3 className="text-xl font-black text-slate-900 font-display mb-4">
            🍎 How Many Apples Are There?
          </h3>

          <div className="flex items-center justify-center gap-3 flex-wrap p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-200 max-w-md mx-auto my-4 shadow-inner">
            {countItems.map((_, i) => (
              <span key={i} className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
                🍎
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mt-6">
            {countChoices.map((choice) => (
              <button
                key={choice}
                onClick={() => handleAnswerCount(choice)}
                className="py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-3xl shadow-md hover:scale-105 active:scale-95 transition-transform btn-3d"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 5: MISSING LETTER ACTIVE */}
      {activeGame === 'missing-letter' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-purple-200 text-center">
          <h3 className="text-xl font-black text-slate-900 font-display mb-2">
            🔤 Complete the Word!
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Pick the missing vowel:
          </p>

          <div className="p-6 bg-purple-50 rounded-3xl border-2 border-purple-200 max-w-sm mx-auto my-4 shadow-inner">
            <span className="text-7xl block mb-2">{missingWord.emoji}</span>
            <span className="text-4xl sm:text-5xl font-black text-purple-900 font-display tracking-widest">
              {missingWord.display}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mt-6">
            {letterChoices.map((choice) => (
              <button
                key={choice}
                onClick={() => handleAnswerMissingLetter(choice)}
                className="py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-3xl shadow-md hover:scale-105 active:scale-95 transition-transform btn-3d"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
