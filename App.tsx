
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Exam from './components/Exam';
import Results from './components/Results';
import StudyConfig from './components/StudyConfig';
import Study from './components/Study';
import StudyResults from './components/StudyResults';
import FlashcardConfig from './components/FlashcardConfig';
import FlashcardPlayer from './components/FlashcardPlayer';
import { getQuestions, getFlashcards, calculateResults } from './services/examService';
import type { Question, ExamResult, Domain, StudyConfigOptions, Flashcard } from './types';
import TestRunner from './components/TestRunner';

export type Page = 'dashboard' | 'exam' | 'results' | 'study-config' | 'study-session' | 'study-results' | 'flashcard-config' | 'flashcard';

const App: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('test') === 'true') {
    return <TestRunner />;
  }

  // Anti-inspection measures to deter source code viewing
  useEffect(() => {
    // These are deterrents against casual inspection, not foolproof security.
    const handleContextMenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F12' ||
         (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key.toUpperCase())) ||
         (event.ctrlKey && event.key.toUpperCase() === 'U')) {
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Anti-debugging: Continuously trigger the debugger to frustrate inspection.
    const intervalId = setInterval(() => {
      try {
        (function() { return false; }['constructor']('debugger')['call']());
      } catch (e) {
        // Ignore errors when dev tools are not open
      }
    }, 50);

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);


  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentExamQuestions, setCurrentExamQuestions] = useState<Question[]>([]);
  const [currentStudyQuestions, setCurrentStudyQuestions] = useState<Question[]>([]);
  const [currentFlashcards, setCurrentFlashcards] = useState<Flashcard[]>([]);
  const [examHistory, setExamHistory] = useState<ExamResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [currentStudyResult, setCurrentStudyResult] = useState<ExamResult | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

  useEffect(() => {
    const loadedQuestions = getQuestions();
    setQuestions(loadedQuestions);
    const loadedFlashcards = getFlashcards();
    setFlashcards(loadedFlashcards);

    const storedHistory = localStorage.getItem('examHistory');
    if (storedHistory) {
      setExamHistory(JSON.parse(storedHistory));
    }
    const storedFlags = localStorage.getItem('flaggedQuestions');
    if (storedFlags) {
      setFlaggedQuestions(JSON.parse(storedFlags));
    }
  }, []);

  const saveHistory = useCallback((history: ExamResult[]) => {
    setExamHistory(history);
    localStorage.setItem('examHistory', JSON.stringify(history));
  }, []);
  
  const saveFlaggedQuestions = useCallback((flags: number[]) => {
    setFlaggedQuestions(flags);
    localStorage.setItem('flaggedQuestions', JSON.stringify(flags));
  }, []);

  const handleToggleFlag = (questionId: number) => {
    const newFlags = flaggedQuestions.includes(questionId)
      ? flaggedQuestions.filter(id => id !== questionId)
      : [...flaggedQuestions, questionId];
    saveFlaggedQuestions(newFlags);
  };
  
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startNewExam = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const examQuestions = shuffled.slice(0, 100).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setCurrentExamQuestions(examQuestions);
    setCurrentPage('exam');
  };

  const goToStudyConfig = () => {
    setCurrentPage('study-config');
  };
  
  const startStudySession = useCallback((options: StudyConfigOptions) => {
    let questionPool: Question[] = [];

    switch (options.studyMode) {
      case 'incorrect':
        const incorrectQuestionIds = new Set<number>();
        examHistory.forEach(result => {
          result.userAnswers.forEach(answer => {
            if (!answer.isCorrect) {
              incorrectQuestionIds.add(answer.questionId);
            }
          });
        });
        questionPool = questions.filter(q => incorrectQuestionIds.has(q.id));
        break;
      
      case 'flagged':
        questionPool = questions.filter(q => flaggedQuestions.includes(q.id));
        break;

      case 'all-domains':
      default:
        questionPool = questions.filter(q => options.domains.includes(q.domain));
        break;
    }
    
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    let finalQuestions = options.studyMode === 'all-domains'
      ? shuffled.slice(0, options.questionCount)
      : shuffled;
    
    finalQuestions = finalQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
    }));

    setCurrentStudyQuestions(finalQuestions);
    setCurrentPage('study-session');
  }, [examHistory, questions, flaggedQuestions]);

  const startStudyForDomain = (domain: Domain) => {
    const studyOptions: StudyConfigOptions = {
        studyMode: 'all-domains',
        domains: [domain],
        questionCount: 999, // Get all questions from this domain
    };
    startStudySession(studyOptions);
  };

  const startWeakestDomainStudy = () => {
    if (examHistory.length === 0) return;
    const lastResult = examHistory[examHistory.length - 1];
    if (!lastResult.domainScores || lastResult.domainScores.length === 0) return;

    const weakestDomainScore = lastResult.domainScores.reduce((weakest, current) =>
      current.score < weakest.score ? current : weakest
    );
    
    if (weakestDomainScore) {
      startStudyForDomain(weakestDomainScore.domain);
    }
  };

  const goToFlashcardConfig = () => {
    setCurrentPage('flashcard-config');
  };

  const startFlashcardSession = (selectedDomains: Domain[]) => {
    const filteredFlashcards = flashcards.filter(f => selectedDomains.includes(f.domain));
    setCurrentFlashcards(filteredFlashcards);
    setCurrentPage('flashcard');
  };

  const finishExam = (result: ExamResult) => {
    const newHistory = [...examHistory, result];
    saveHistory(newHistory);
    setSelectedResult(result);
    setCurrentPage('results');
  };

  const finishStudySession = (answeredQuestions: Question[], answers: Map<number, string>) => {
    // Study sessions are not timed.
    const result = calculateResults(answeredQuestions, answers, 0); 
    setCurrentStudyResult(result);
    setCurrentPage('study-results');
  };

  const viewResultDetails = (result: ExamResult) => {
    setSelectedResult(result);
    setCurrentPage('results');
  };

  const goToDashboard = () => {
    setSelectedResult(null);
    setCurrentStudyResult(null);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'exam':
        return (
          <Exam
            questions={currentExamQuestions}
            onFinish={finishExam}
            onGoToDashboard={goToDashboard}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={handleToggleFlag}
          />
        );
      case 'results':
        if (selectedResult) {
          return (
            <Results
              result={selectedResult}
              onGoToDashboard={goToDashboard}
              theme={theme}
              flaggedQuestions={flaggedQuestions}
              onStartStudyForDomain={startStudyForDomain}
            />
          );
        }
        goToDashboard();
        return null;
      case 'study-config':
        return (
          <StudyConfig
            onStartStudySession={startStudySession}
            onGoToDashboard={goToDashboard}
            examHistory={examHistory}
            flaggedQuestions={flaggedQuestions}
          />
        );
      case 'study-session':
        return (
          <Study
            questions={currentStudyQuestions}
            onFinish={finishStudySession}
            onGoToDashboard={goToDashboard}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={handleToggleFlag}
          />
        );
      case 'study-results':
        if (currentStudyResult) {
          return (
            <StudyResults
              result={currentStudyResult}
              onGoToDashboard={goToDashboard}
              theme={theme}
              flaggedQuestions={flaggedQuestions}
            />
          );
        }
        goToDashboard();
        return null;
      case 'flashcard-config':
        return (
          <FlashcardConfig
            onStartFlashcardSession={startFlashcardSession}
            onGoToDashboard={goToDashboard}
          />
        );
      case 'flashcard':
        return (
          <FlashcardPlayer
            flashcards={currentFlashcards}
            onGoToDashboard={goToDashboard}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            onStartExam={startNewExam}
            onStartStudyConfig={goToStudyConfig}
            onStartFlashcardConfig={goToFlashcardConfig}
            onStartWeakestDomainStudy={startWeakestDomainStudy}
            examHistory={examHistory}
            onViewResult={viewResultDetails}
            onImportHistory={saveHistory}
            theme={theme}
            setTheme={setTheme}
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 font-sans">
      {renderPage()}
    </main>
  );
};

export default App;
