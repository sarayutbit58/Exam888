import React, { useState } from 'react';
import { Domain, StudyConfigOptions, StudyMode, ExamResult } from '../types';

interface StudyConfigProps {
  onStartStudySession: (options: StudyConfigOptions) => void;
  onGoToDashboard: () => void;
  examHistory: ExamResult[];
  flaggedQuestions: number[];
}

const IconBrain = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-cyan-400"><path d="M12 2a9.5 9.5 0 0 0-3.57 18.26a.5.5 0 0 1-.43.64H6.5a2.5 2.5 0 0 1-2.5-2.5V17a4.5 4.5 0 0 1 4.5-4.5h0A4.5 4.5 0 0 1 13 17v1.5a2.5 2.5 0 0 1 0 5h0a2.5 2.5 0 0 1 2.5-2.5V17A4.5 4.5 0 0 1 20 12.5h0A4.5 4.5 0 0 1 15.5 8H12a2.5 2.5 0 0 0-2.5-2.5V2"/><path d="M12 2v5.5"/><path d="m15.5 8-3-2.5"/><path d="m8.5 8 3-2.5"/></svg>
);


const StudyConfig: React.FC<StudyConfigProps> = ({ onStartStudySession, onGoToDashboard, examHistory, flaggedQuestions }) => {
  const allDomains = Object.values(Domain).filter(d => d !== Domain.Unknown);
  const [selectedDomains, setSelectedDomains] = useState<Domain[]>(allDomains);
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [studyMode, setStudyMode] = useState<StudyMode>('all-domains');

  const hasIncorrect = examHistory.some(r => r.userAnswers.some(a => !a.isCorrect));
  const hasFlagged = flaggedQuestions.length > 0;

  const handleDomainChange = (domain: Domain) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDomains.length === allDomains.length) {
      setSelectedDomains([]);
    } else {
      setSelectedDomains(allDomains);
    }
  };
  
  const handleStart = () => {
    const options: StudyConfigOptions = {
      studyMode,
      domains: selectedDomains,
      questionCount
    };
    onStartStudySession(options);
  };

  const isStartDisabled = () => {
    if (studyMode === 'all-domains' && selectedDomains.length === 0) return true;
    if (studyMode === 'incorrect' && !hasIncorrect) return true;
    if (studyMode === 'flagged' && !hasFlagged) return true;
    return false;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
                <IconBrain />
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Advanced Study</h1>
            </div>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Customize your practice session. Focus on what you need to learn.
          </p>
        </header>

        <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-8 rounded-2xl shadow-2xl space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">1. Select Study Mode</h2>
                <div className="grid grid-cols-1 gap-4">
                  {(['all-domains', 'incorrect', 'flagged'] as StudyMode[]).map(mode => (
                    <label key={mode} className={`flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border-2 ${studyMode === mode ? 'border-cyan-500' : 'border-gray-200 dark:border-slate-700'} ${ (mode === 'incorrect' && !hasIncorrect) || (mode === 'flagged' && !hasFlagged) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50'}`}>
                        <input
                            type="radio"
                            name="studyMode"
                            value={mode}
                            checked={studyMode === mode}
                            onChange={() => setStudyMode(mode)}
                            disabled={(mode === 'incorrect' && !hasIncorrect) || (mode === 'flagged' && !hasFlagged)}
                            className="h-5 w-5 bg-gray-100 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-white dark:focus:ring-offset-slate-800 disabled:opacity-50"
                        />
                        <span className="text-slate-700 dark:text-slate-300 capitalize">{mode.replace('-', ' ')}</span>
                        {mode === 'incorrect' && !hasIncorrect && <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">(No incorrect answers yet)</span>}
                        {mode === 'flagged' && !hasFlagged && <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">(No flagged questions yet)</span>}
                    </label>
                  ))}
                </div>
            </div>

            {studyMode === 'all-domains' && (
              <>
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">2. Select Domains</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {allDomains.map(domain => (
                            <label key={domain} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={selectedDomains.includes(domain)}
                                    onChange={() => handleDomainChange(domain)}
                                    className="h-5 w-5 rounded bg-gray-100 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-white dark:focus:ring-offset-slate-800"
                                />
                                <span className="text-slate-700 dark:text-slate-300">{domain}</span>
                            </label>
                        ))}
                    </div>
                    <button onClick={toggleSelectAll} className="mt-4 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300">
                        {selectedDomains.length === allDomains.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
            
                <div>
                     <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">3. Number of Questions</h2>
                     <select
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:ring-cyan-500 focus:border-cyan-500"
                     >
                         <option value="10">10 Questions</option>
                         <option value="25">25 Questions</option>
                         <option value="50">50 Questions</option>
                         <option value="100">100 Questions</option>
                     </select>
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                    onClick={onGoToDashboard}
                    className="flex-1 flex items-center justify-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-300 font-bold py-3 px-6 rounded-lg transition-colors active:scale-95"
                >
                    Back to Dashboard
                </button>
                 <button
                    onClick={handleStart}
                    disabled={isStartDisabled()}
                    className="flex-1 flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 active:scale-95 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Start Studying
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudyConfig;