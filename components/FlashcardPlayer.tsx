import React, { useState, useEffect, useCallback } from 'react';
import type { Flashcard } from '../types';

const IconHome = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

const IconRotateCw = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
);

const IconShuffle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="4" y2="4"/></svg>
);


interface FlashcardPlayerProps {
  flashcards: Flashcard[];
  onGoToDashboard: () => void;
}

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ flashcards, onGoToDashboard }) => {
  const [shuffledFlashcards, setShuffledFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardHeight, setCardHeight] = useState('400px');
  
  const frontEl = React.useRef<HTMLDivElement>(null);
  const backEl = React.useRef<HTMLDivElement>(null);

  const shuffleCards = useCallback(() => {
    const array = [...flashcards];
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setShuffledFlashcards(array);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  useEffect(() => {
    if (flashcards.length > 0) {
      shuffleCards();
    }
  }, [flashcards, shuffleCards]);

  const setMaxHeight = useCallback(() => {
    const frontHeight = frontEl.current?.scrollHeight || 400;
    const backHeight = backEl.current?.scrollHeight || 400;
    // Use the max height of the front or back, plus padding, to set the container height
    const maxHeight = Math.max(frontHeight, backHeight, 200); // Minimum height of 200px
    setCardHeight(`${maxHeight + 48}px`);
  }, []);

  useEffect(() => {
    if (shuffledFlashcards.length > 0) {
      setMaxHeight();
      window.addEventListener('resize', setMaxHeight);
      return () => window.removeEventListener('resize', setMaxHeight);
    }
  }, [shuffledFlashcards, setMaxHeight]);
  
  useEffect(() => {
    if (shuffledFlashcards.length > 0) {
        // Recalculate height when card content changes or flip happens
        setMaxHeight();
    }
  }, [currentIndex, isFlipped, shuffledFlashcards, setMaxHeight]);


  const handleNext = () => {
    if (currentIndex < shuffledFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onGoToDashboard();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (!shuffledFlashcards || shuffledFlashcards.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl text-white mb-4">No Flashcards Available</h2>
        <p className="text-slate-400 mb-8">There are no flashcards to review in this session.</p>
        <button onClick={onGoToDashboard} className="flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg">
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const currentFlashcard = shuffledFlashcards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <header className="mb-6 flex justify-between items-center gap-4">
          <button onClick={onGoToDashboard} className="flex items-center text-slate-400 hover:text-cyan-400 transition-colors">
            <IconHome /> Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Flashcard Review</h1>
            <p className="text-slate-400">Card {currentIndex + 1} of {shuffledFlashcards.length}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={shuffleCards}
              className="flex items-center justify-center text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-md transition-colors"
              aria-label="Shuffle cards"
            >
              <IconShuffle /> Shuffle
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center justify-center text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-md transition-colors"
              aria-label="Flip card"
            >
              <IconRotateCw /> Flip
            </button>
          </div>
        </header>

        <div className="flex flex-col items-center">
            <div className="[perspective:1000px] w-full" style={{ height: cardHeight }}>
                <div 
                    className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                    
                >
                    <div ref={frontEl} className="absolute w-full h-full [backface-visibility:hidden] bg-slate-800 border-2 border-cyan-500 rounded-2xl flex flex-col justify-center items-center p-8 cursor-pointer shadow-lg shadow-cyan-500/10" onClick={() => setIsFlipped(!isFlipped)}>
                        <p className="text-center text-3xl font-bold text-white">{currentFlashcard.front}</p>
                    </div>
                    <div ref={backEl} className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-700 border-2 border-slate-600 rounded-2xl flex flex-col justify-start items-start p-8 cursor-pointer overflow-y-auto" onClick={() => setIsFlipped(!isFlipped)}>
                        <p className="text-slate-200 whitespace-pre-wrap">{currentFlashcard.back}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between w-full mt-8">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-8 rounded-lg transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg transition-colors"
                >
                    {currentIndex === shuffledFlashcards.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};