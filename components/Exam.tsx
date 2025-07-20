import React, { useState, useEffect, useCallback } from 'react';
import { calculateResults } from '../services/examService';
import type { Question, ExamResult } from '../types';
import Timer from './Timer';

interface ExamProps {
  questions: Question[];
  onFinish: (result: ExamResult) => void;
  onGoToDashboard: () => void;
  flaggedQuestions: number[];
  onToggleFlag: (questionId: number) => void;
}

const ProgressBar: React.FC<{ current: number, total: number }> = ({ current, total }) => {
    const percentage = (current / total) * 100;
    return (
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${percentage}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
    );
};

const IconHome = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

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


const Exam: React.FC<ExamProps> = ({ questions, onFinish, onGoToDashboard, flaggedQuestions, onToggleFlag }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const EXAM_DURATION = 2 * 60 * 60; // 2 hours in seconds

  const handleFinishExam = useCallback(() => {
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    const result = calculateResults(questions, userAnswers, timeTaken);
    onFinish(result);
  }, [questions, userAnswers, onFinish, startTime]);

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const newAnswers = new Map(userAnswers);
    newAnswers.set(questions[currentQuestionIndex].id, selectedOption);
    setUserAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // This is the last question, finishing with the last answer
      const finalAnswers = new Map(newAnswers);
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      const result = calculateResults(questions, finalAnswers, timeTaken);
      onFinish(result);
    }
  };
  
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button onClick={onGoToDashboard} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                <IconHome /> Dashboard
            </button>
            <div className="w-full sm:w-auto text-center sm:text-right">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ISC2 CC Practice Exam</h1>
                <p className="text-slate-500 dark:text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <Timer duration={EXAM_DURATION} onTimeUp={handleFinishExam} />
        </header>

        <div className="mb-6">
            <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
        </div>

        {currentQuestion && (
          <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-8 rounded-2xl shadow-2xl relative">
            <FlagButton questionId={currentQuestion.id} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} />
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 leading-relaxed pr-12">
              {currentQuestion.question}
            </h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                    ${selectedOption === option
                      ? 'bg-cyan-500/20 border-cyan-500 ring-2 ring-cyan-500'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-cyan-500 dark:hover:border-cyan-600 active:bg-cyan-500/10'
                    }`}
                >
                  <span className="font-mono text-cyan-500 dark:text-cyan-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-slate-700 dark:text-slate-200">{option}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish Exam'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;