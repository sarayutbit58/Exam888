import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { explainConcept } from '../services/aiService';

interface AITutorProps {
  concept: string;
  onClose: () => void;
}

const IconLoader = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 animate-spin text-cyan-500 dark:text-cyan-400"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;

const AITutor: React.FC<AITutorProps> = ({ concept, onClose }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getExplanation = async () => {
      setIsLoading(true);
      const result = await explainConcept(concept);
      const unsafeHtml = await marked.parse(result);
      // In a real production app, you would sanitize this HTML
      // using a library like DOMPurify to prevent XSS attacks.
      setExplanation(unsafeHtml);
      setIsLoading(false);
    };

    getExplanation();
  }, [concept]);

  // Handle closing with Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-tutor-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 id="ai-tutor-title" className="text-xl font-bold text-cyan-600 dark:text-cyan-400">AI Security Tutor: <span className="text-slate-800 dark:text-white">{concept}</span></h2>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-slate-500 dark:text-slate-400">
              <IconLoader />
              <p className="mt-4">Generating explanation...</p>
            </div>
          ) : (
            <div 
                className="prose prose-sm sm:prose-base dark:prose-invert prose-headings:text-cyan-600 dark:prose-headings:text-cyan-400 prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-strong:text-slate-800 dark:prose-strong:text-white max-w-none"
                dangerouslySetInnerHTML={{ __html: explanation }} 
            />
          )}
        </div>

        <footer className="p-3 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-gray-200 dark:border-slate-700">
            AI-generated content by Google Gemini. Please verify critical information.
        </footer>
      </div>
    </div>
  );
};

export default AITutor;