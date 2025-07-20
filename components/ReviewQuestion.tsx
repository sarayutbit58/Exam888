import React from 'react';
import type { UserAnswer, Question } from '../types';
import ClickableExplanation from './ClickableExplanation';

interface ReviewQuestionProps {
  question: Question;
  userAnswer: UserAnswer;
  onAskAI?: (concept: string) => void;
}

const IconTag = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 ml-auto text-green-500 dark:text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconXCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 ml-auto text-red-500 dark:text-red-400"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;


const ReviewQuestion: React.FC<ReviewQuestionProps> = ({ question, userAnswer, onAskAI }) => {
    return (
        <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-6 rounded-lg mb-4">
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3">
              <IconTag />
              <span>Domain: {question.domain}</span>
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{question.question}</p>
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const isCorrect = option === question.correctAnswer;
                    const isSelected = option === userAnswer.selectedAnswer;
                    let optionClass = 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800';
                    let icon = null;

                    if(isCorrect) {
                        optionClass = 'border-green-500 bg-green-500/10';
                        icon = <IconCheckCircle />;
                    } else if (isSelected) {
                        optionClass = 'border-red-500 bg-red-500/10';
                        icon = <IconXCircle />;
                    }

                    return (
                        <div key={index} className={`p-3 border-2 rounded-md flex items-center ${optionClass}`}>
                           <span className="font-mono text-cyan-600 dark:text-cyan-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                           <span className="text-slate-700 dark:text-slate-300 flex-grow">{option}</span>
                           {icon}
                        </div>
                    )
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <p className="font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Explanation:</p>
                {onAskAI ? (
                    <ClickableExplanation
                        explanation={question.explanation}
                        keywords={question.keywords}
                        onKeywordClick={onAskAI}
                    />
                ) : (
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{question.explanation}</p>
                )}
            </div>
        </div>
    )
}

export default ReviewQuestion;