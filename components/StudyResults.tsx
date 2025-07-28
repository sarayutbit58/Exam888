
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ExamResult } from '../types';
import ReviewQuestion from './ReviewQuestion';

type FilterType = 'all' | 'correct' | 'incorrect' | 'flagged';

interface StudyResultsProps {
  result: ExamResult;
  onGoToDashboard: () => void;
  theme: 'light' | 'dark';
  flaggedQuestions: number[];
}

const IconHome = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

const StudyResults: React.FC<StudyResultsProps> = ({ result, onGoToDashboard, theme, flaggedQuestions }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const correctCount = result.userAnswers.filter(ua => ua.isCorrect).length;
  const totalCount = result.questions.length;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const textColor = theme === 'dark' ? '#94a3b8' : '#6b7280';
  const gridColor = theme === 'dark' ? '#475569' : '#e5e7eb';
  const tooltipBg = theme === 'dark' ? '#1e293b' : 'rgba(255,255,255,0.9)';
  const tooltipBorder = theme === 'dark' ? '#475569' : '#e5e7eb';
  const tooltipLabelColor = theme === 'dark' ? '#ffffff' : '#1e293b';

  const filteredQuestionsAndAnswers = result.questions.map(question => {
      const userAnswer = result.userAnswers.find(ua => ua.questionId === question.id);
      return { question, userAnswer };
  }).filter(item => {
      if (!item.userAnswer) return false;
      switch (filter) {
          case 'correct':
              return item.userAnswer.isCorrect;
          case 'incorrect':
              return !item.userAnswer.isCorrect;
          case 'flagged':
              return flaggedQuestions.includes(item.question.id);
          case 'all':
          default:
              return true;
      }
  });

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Study Session Results</h1>
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
                <p className="text-lg text-slate-500 dark:text-slate-400">Overall Accuracy</p>
                <p className="text-7xl font-bold my-2 text-cyan-500 dark:text-cyan-400">{accuracy}%</p>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white">{correctCount}</span> / <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> correct
                </p>
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
                                tickFormatter={(value) => typeof value === 'string' ? value.replace(/ \(.+\)/, '').replace('Concepts', '').replace('Security ', 'Sec. ') : value}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Question Review</h2>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter questions">
                  {(['all', 'correct', 'incorrect', 'flagged'] as FilterType[]).map(filterType => (
                    <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === filterType ? 'bg-cyan-500 text-slate-900' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'}`}
                    >
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ))}
                </div>
            </div>
            <div className="space-y-6">
                {filteredQuestionsAndAnswers.map(({ question, userAnswer }, index) => {
                    if (!userAnswer) return null;
                    return <ReviewQuestion key={question.id || index} question={question} userAnswer={userAnswer} />
                })}
                 {filteredQuestionsAndAnswers.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-slate-500 dark:text-slate-400">No questions match the filter '{filter}'.</p>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudyResults;
