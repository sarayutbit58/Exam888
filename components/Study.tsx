import React, { useState } from 'react';
import type { Question } from '../types';

interface StudyProps {
  questions: Question[];
  onFinish: (questions: Question[], userAnswers: Map<number, string>) => void;
  onGoToDashboard: () => void;
  flaggedQuestions: number[];
  onToggleFlag: (questionId: number) => void;
}

const IconHome = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-green-500 dark:text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconXCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-red-500 dark:text-red-400"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

const FlagButton: React.FC<{ questionId: number, flaggedQuestions: number[], onToggleFlag: (id: number) => void }> = ({ questionId, flaggedQuestions, onToggleFlag }) => {
    const isFlagged = flaggedQuestions.includes(questionId);
    return (
        <button
            onClick={() => onToggleFlag(questionId)}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isFlagged ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
            aria-label={isFlagged ? 'Unflag question' : 'Flag question for review'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFlagged ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        </button>
    );
};


const Study: React.FC<StudyProps> = ({ questions, onFinish, onGoToDashboard, flaggedQuestions, onToggleFlag }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);

    const newAnswers = new Map(userAnswers);
    newAnswers.set(currentQuestion.id, option);
    setUserAnswers(newAnswers);

    setIsAnswered(true);
  };
  
  const handleNextQuestion = () => {
      if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsAnswered(false);
      } else {
          onFinish(questions, userAnswers);
      }
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
        return 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-cyan-500 dark:hover:border-cyan-600 active:bg-cyan-500/10';
    }
    
    const isCorrectAnswer = option === currentQuestion.correctAnswer;
    const isSelectedAnswer = option === selectedOption;

    if (isCorrectAnswer) {
        return 'bg-green-500/10 dark:bg-green-500/20 border-green-500 ring-2 ring-green-500';
    }
    if (isSelectedAnswer && !isCorrectAnswer) {
        return 'bg-red-500/10 dark:bg-red-500/20 border-red-500 ring-2 ring-red-500';
    }
    
    return 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 opacity-60';
  };

  if (!currentQuestion) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <h2 className="text-2xl text-slate-900 dark:text-white mb-4">Study Session Complete!</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">You've finished all the questions in this session.</p>
              <button onClick={onGoToDashboard} className="flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-900 font-bold py-3 px-6 rounded-lg">
                  Back to Dashboard
              </button>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <header className="mb-6 flex justify-between items-center gap-4">
            <button onClick={onGoToDashboard} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                <IconHome /> Dashboard
            </button>
            <div className="text-right">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Advanced Study Session</h1>
                <p className="text-slate-500 dark:text-slate-400">Question {currentIndex + 1} of {questions.length}</p>
            </div>
        </header>

        <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-8 rounded-2xl shadow-2xl relative">
            <FlagButton questionId={currentQuestion.id} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} />
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 leading-relaxed pr-12">
              {currentQuestion.question}
            </h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 disabled:cursor-not-allowed ${getOptionClass(option)}`}
                >
                  <span className="font-mono text-cyan-500 dark:text-cyan-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-slate-700 dark:text-slate-200">{option}</span>
                </button>
              ))}
            </div>

            {isAnswered && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-4 animate-fade-in">
                    {selectedOption === currentQuestion.correctAnswer ? (
                        <div className="flex items-center text-green-600 dark:text-green-400 font-bold text-lg"><IconCheckCircle/> Correct!</div>
                    ) : (
                        <div className="flex items-center text-red-600 dark:text-red-400 font-bold text-lg"><IconXCircle/> Incorrect.</div>
                    )}
                    <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg">
                        <p className="text-cyan-600 dark:text-cyan-400 font-semibold mb-2">Explanation:</p>
                        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-end">
              {isAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                  >
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
                  </button>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default Study;