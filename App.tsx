import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Exam from './components/Exam';
import { Results } from './components/Results';
import StudyConfig from './components/StudyConfig';
import { Study } from './components/Study';
import FlashcardConfig from './components/FlashcardConfig';
<<<<<<< HEAD
import FlashcardPlayer from './components/FlashcardPlayer';
import AITutor from './components/AITutor';
import { getQuestions, getFlashcards, calculateResults } from './services/examService';
=======
import { FlashcardPlayer } from './components/FlashcardPlayer';
import { getQuestions, getFlashcards } from './services/examService';
>>>>>>> parent of 9d8d146 (r4)
import type { Question, ExamResult, Domain, StudyConfigOptions, Flashcard } from './types';

export type Page = 'dashboard' | 'exam' | 'results' | 'study-config' | 'study-session' | 'flashcard-config' | 'flashcard';

const App: React.FC = () => {
<<<<<<< HEAD
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('test') === 'true') {
    return <TestRunner />;
  }

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


=======
>>>>>>> parent of 9d8d146 (r4)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentExamQuestions, setCurrentExamQuestions] = useState<Question[]>([]);
  const [currentStudyQuestions, setCurrentStudyQuestions] = useState<Question[]>([]);
  const [currentFlashcards, setCurrentFlashcards] = useState<Flashcard[]>([]);
  const [examHistory, setExamHistory] = useState<ExamResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

  // AI Tutor State
  const [isAiEnabled, setIsAiEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('isAiEnabled');
    return saved ? JSON.parse(saved) : false; // Default to opt-out
  });
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorConcept, setTutorConcept] = useState('');

  const handleToggleAiFeatures = useCallback(() => {
    setIsAiEnabled(prev => {
      const newState = !prev;
      localStorage.setItem('isAiEnabled', JSON.stringify(newState));
      if (!newState) setIsTutorOpen(false); // Close tutor if AI is disabled
      return newState;
    });
  }, []);

  const handleAskAI = (concept: string) => {
    if (!isAiEnabled) return;
    setTutorConcept(concept);
    setIsTutorOpen(true);
  };

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

  const startNewExam = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setCurrentExamQuestions(shuffled.slice(0, 100));
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
    const finalQuestions = options.studyMode === 'all-domains'
      ? shuffled.slice(0, options.questionCount)
      : shuffled;

    setCurrentStudyQuestions(finalQuestions);
    setCurrentPage('study-session');
  }, [examHistory, questions, flaggedQuestions]);

  const startWeakestDomainStudy = () => {
    if (examHistory.length === 0) return;
    const lastResult = examHistory[examHistory.length - 1];
    if (!lastResult.domainScores || lastResult.domainScores.length === 0) return;

    const weakestDomainScore = lastResult.domainScores.reduce((weakest, current) =>
      current.score < weakest.score ? current : weakest
    );
    
    if (weakestDomainScore) {
      const studyOptions: StudyConfigOptions = {
        studyMode: 'all-domains',
        domains: [weakestDomainScore.domain],
        questionCount: 999, // Get all questions from this domain
      };
      startStudySession(studyOptions);
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

  const viewResultDetails = (result: ExamResult) => {
    setSelectedResult(result);
    setCurrentPage('results');
  };

  const goToDashboard = () => {
    setSelectedResult(null);
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
              onAskAI={isAiEnabled ? handleAskAI : undefined}
              theme={theme}
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
            onGoToDashboard={goToDashboard}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={handleToggleFlag}
            onAskAI={isAiEnabled ? handleAskAI : undefined}
          />
        );
<<<<<<< HEAD
      case 'study-results':
        if (currentStudyResult) {
          return (
            <StudyResults
              result={currentStudyResult}
              onGoToDashboard={goToDashboard}
              onAskAI={isAiEnabled ? handleAskAI : undefined}
              theme={theme}
            />
          );
        }
        goToDashboard();
        return null;
=======
>>>>>>> parent of 9d8d146 (r4)
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
            isAiEnabled={isAiEnabled}
            onToggleAiFeatures={handleToggleAiFeatures}
            theme={theme}
            setTheme={setTheme}
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 font-sans">
      {renderPage()}
      {isAiEnabled && isTutorOpen && <AITutor concept={tutorConcept} onClose={() => setIsTutorOpen(false)} />}
    </main>
  );
};

export default App;