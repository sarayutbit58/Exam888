
import React, { useState } from 'react';
import { Domain } from '../types';

interface FlashcardConfigProps {
  onStartFlashcardSession: (domains: Domain[]) => void;
  onGoToDashboard: () => void;
}

const IconLayers = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-violet-400"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
);


const FlashcardConfig: React.FC<FlashcardConfigProps> = ({ onStartFlashcardSession, onGoToDashboard }) => {
  const allDomains = Object.values(Domain).filter(d => d !== Domain.Unknown);
  const [selectedDomains, setSelectedDomains] = useState<Domain[]>(allDomains);

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
    onStartFlashcardSession(selectedDomains);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
                <IconLayers />
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Flashcard Review</h1>
            </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Select domains to focus your review session.
          </p>
        </header>

        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl shadow-2xl space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Select Domains</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allDomains.map(domain => (
                        <label key={domain} className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-colors">
                            <input
                                type="checkbox"
                                checked={selectedDomains.includes(domain)}
                                onChange={() => handleDomainChange(domain)}
                                className="h-5 w-5 rounded bg-slate-900 border-slate-600 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-800"
                            />
                            <span className="text-slate-300">{domain.replace(/ \(.+\)/, '')}</span>
                        </label>
                    ))}
                </div>
                <button onClick={toggleSelectAll} className="mt-4 text-sm text-violet-400 hover:text-violet-300">
                    {selectedDomains.length === allDomains.length ? 'Deselect All' : 'Select All'}
                </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-700">
                <button
                    onClick={onGoToDashboard}
                    className="flex-1 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    Back to Dashboard
                </button>
                 <button
                    onClick={handleStart}
                    disabled={selectedDomains.length === 0}
                    className="flex-1 flex items-center justify-center bg-violet-500 hover:bg-violet-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Start Review
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardConfig;
