import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ExamResult } from '../types';
import ReviewQuestion from './ReviewQuestion';

interface ResultsProps {
  result: ExamResult;
  onGoToDashboard: () => void;
  onAskAI?: (concept: string) => void;
  theme: 'light' | 'dark';
}

const IconHome = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

<<<<<<< HEAD
const Results: React.FC<ResultsProps> = ({ result, onGoToDashboard, onAskAI, theme }) => {
=======
const ReviewQuestion: React.FC<{ question: Question, userAnswer: UserAnswer }> = ({ question, userAnswer }) => {
    return (
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg mb-4">
            <div className="flex items-center text-sm text-slate-400 mb-3">
              <IconTag />
              <span>Domain: {question.domain}</span>
            </div>
            <p className="text-lg font-semibold text-slate-200 mb-4">{question.question}</p>
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const isCorrect = option === question.correctAnswer;
                    const isSelected = option === userAnswer.selectedAnswer;
                    let optionClass = 'border-slate-600 bg-slate-800';
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
                           <span className="font-mono text-cyan-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                           <span className="text-slate-300 flex-grow">{option}</span>
                           {icon}
                        </div>
                    )
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="font-semibold text-cyan-400 mb-2">Explanation:</p>
                <p className="text-slate-300 whitespace-pre-wrap">{question.explanation}</p>
            </div>
        </div>
    )
}

export const Results: React.FC<ResultsProps> = ({ result, onGoToDashboard }) => {
>>>>>>> parent of 9d8d146 (r4)
  const isPass = result.score >= 700;
  const timeTakenMinutes = Math.floor(result.timeTaken / 60);
  const timeTakenSeconds = result.timeTaken % 60;

  const textColor = theme === 'dark' ? '#94a3b8' : '#6b7280';
  const gridColor = theme === 'dark' ? '#475569' : '#e5e7eb';
  const tooltipBg = theme === 'dark' ? '#1e293b' : 'rgba(255,255,255,0.9)';
  const tooltipBorder = theme === 'dark' ? '#475569' : '#e5e7eb';
  const tooltipLabelColor = theme === 'dark' ? '#ffffff' : '#1e293b';

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Exam Results</h1>
                <p className="text-slate-500 dark:text-slate-400">Completed on {new Date(result.date).toLocaleString()}</p>
            </div>
            <button
                onClick={onGoToDashboard}
                className="flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-900 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
                <IconHome />
                Dashboard
            </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1 bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 text-center flex flex-col justify-center">
                <p className="text-lg text-slate-500 dark:text-slate-400">Your Score</p>
                <p className={`text-7xl font-bold my-2 ${isPass ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{result.score}</p>
                <p className="text-lg text-slate-500 dark:text-slate-400">out of 1000</p>
                <p className={`text-2xl font-semibold mt-4 py-2 px-4 rounded-lg ${isPass ? 'bg-green-500/10 text-green-600 dark:text-green-300' : 'bg-red-500/10 text-red-600 dark:text-red-300'}`}>
                    {isPass ? 'PASS' : 'FAIL'}
                </p>
                <div className="flex items-center justify-center mt-4 text-slate-600 dark:text-slate-300">
                    <IconClock />
                    <span>Time Taken: {timeTakenMinutes}m {timeTakenSeconds}s</span>
                </div>
            </div>
            <div className="md:col-span-2 bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Domain Performance</h2>
                 <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={result.domainScores} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis type="number" domain={[0, 100]} tick={{ fill: textColor }} />
                            <YAxis 
                                dataKey="domain" 
                                type="category" 
                                tick={{ fill: textColor, fontSize: '12px' }} 
                                width={120}
                                interval={0}
                                tickFormatter={(value) => value.replace(/ \(.+\)/, '').replace('Concepts', '').replace('Security ', 'Sec. ')}
                            />
                            <Tooltip
                                cursor={{fill: 'rgba(100,116,139,0.1)'}}
                                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: textColor }}
                                labelStyle={{ color: tooltipLabelColor, fontWeight: 'bold' }}
                                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                            />
                            <Legend wrapperStyle={{ color: textColor }} />
                            <Bar dataKey="score" fill="#22d3ee" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Question Review</h2>
            <div className="space-y-6">
                {result.questions.map((question, index) => {
                    const userAnswer = result.userAnswers.find(ua => ua.questionId === question.id);
                    if (!userAnswer) return null;
                    return <ReviewQuestion key={index} question={question} userAnswer={userAnswer} onAskAI={onAskAI} />
                })}
            </div>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
};

export default Results;
=======
};
>>>>>>> parent of 9d8d146 (r4)
