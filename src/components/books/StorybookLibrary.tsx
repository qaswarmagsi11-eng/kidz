import React, { useState, useEffect } from 'react';
import { STORYBOOKS } from '../../data/learningData';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface StorybookLibraryProps {
  onBack: () => void;
  onEarnStar: () => void;
}

export const StorybookLibrary: React.FC<StorybookLibraryProps> = ({ onBack, onEarnStar }) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  const currentStory = STORYBOOKS[selectedStoryIndex] || STORYBOOKS[0];
  const currentPage = currentStory.pages[pageIndex] || currentStory.pages[0];
  const isLastPage = pageIndex === currentStory.pages.length - 1;

  useEffect(() => {
    sound.speak(currentPage.text);
  }, [pageIndex, selectedStoryIndex]);

  const handleNextPage = () => {
    sound.playPop();
    if (pageIndex < currentStory.pages.length - 1) {
      setPageIndex((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    sound.playPop();
    if (pageIndex > 0) {
      setPageIndex((p) => p - 1);
    }
  };

  const handleQuizChoice = (idx: number) => {
    setQuizAnswered(idx);
    if (idx === currentStory.quiz.correctIndex) {
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      sound.speak("Brilliant! You answered correctly! You earned a Story Champion Star!");
      onEarnStar();
    } else {
      sound.playBoing();
      sound.speak("Good attempt! Think back to what happened in the story!");
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

        <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Story {selectedStoryIndex + 1} of {STORYBOOKS.length}</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-rose-200 relative overflow-hidden">
        {/* Story Selector Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-slate-100">
          {STORYBOOKS.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => {
                sound.playPop();
                setSelectedStoryIndex(idx);
                setPageIndex(0);
                setQuizAnswered(null);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap border ${
                selectedStoryIndex === idx
                  ? 'bg-rose-500 text-white border-rose-600 shadow-xs scale-105'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{story.coverEmoji}</span>
              <span>{story.title}</span>
            </button>
          ))}
        </div>

        {/* Story Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display">
              {currentStory.title}
            </h2>
            {currentStory.urduTitle && (
              <span className="text-sm font-bold text-rose-700 font-urdu block">
                {currentStory.urduTitle}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              sound.playPop();
              sound.speak(currentPage.text);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>Read Aloud</span>
          </button>
        </div>

        {/* Illustrated Story Page */}
        <div className="my-6 p-6 sm:p-8 bg-gradient-to-b from-amber-50 via-rose-50 to-pink-50 rounded-3xl border-2 border-rose-200 text-center shadow-inner">
          <span className="text-8xl sm:text-9xl mb-4 block animate-float drop-shadow-md">
            {currentPage.sceneEmoji}
          </span>
          <p className="text-lg sm:text-2xl font-bold text-slate-800 leading-relaxed max-w-xl mx-auto">
            {currentPage.text}
          </p>
        </div>

        {/* Comprehension Quiz when on final page */}
        {isLastPage && (
          <div className="mt-6 p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900">
                Story Comprehension Quiz: {currentStory.quiz.question}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {currentStory.quiz.options.map((opt, i) => {
                const isCorrect = i === currentStory.quiz.correctIndex;
                const isSelected = quizAnswered === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleQuizChoice(i)}
                    className={`p-3 rounded-xl text-xs font-bold transition-all border text-left ${
                      isSelected && isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-black'
                        : isSelected && !isCorrect
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Moral of the Story */}
            <div className="mt-4 pt-3 border-t border-amber-200 text-xs text-amber-900 font-semibold">
              🌟 <strong className="font-bold">Moral:</strong> {currentStory.moral}
            </div>
          </div>
        )}

        {/* Page Flip Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrevPage}
            disabled={pageIndex === 0}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-sm active:scale-95 disabled:opacity-40 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous Page</span>
          </button>

          <span className="text-xs font-black text-slate-400">
            Page {pageIndex + 1} of {currentStory.pages.length}
          </span>

          <button
            onClick={handleNextPage}
            disabled={isLastPage}
            className="flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 disabled:opacity-40 transition-transform btn-3d"
          >
            <span>Next Page</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
