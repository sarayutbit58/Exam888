
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Exam from './components/Exam';
import { Results } from './components/Results';
import StudyConfig from './components/StudyConfig';
import { Study } from './components/Study';
import { FlashcardPlayer } from './components/FlashcardPlayer';
import { getQuestions, getFlashcards } from './services/examService';
import type { Question, ExamResult, Domain, StudyConfigOptions, Flashcard } from './types';

export type Page = 'dashboard' | 'exam' | 'results' | 'study-config' | 'study-session' | 'flashcard';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentExamQuestions, setCurrentExamQuestions] = useState<Question[]>([]);
  const [currentStudyQuestions, setCurrentStudyQuestions] = useState<Question[]>([]);
  const [examHistory, setExamHistory] = useState<ExamResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
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

  const startNewExam = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setCurrentExamQuestions(shuffled.slice(0, 100));
    setCurrentPage('exam');
  };

  const goToStudyConfig = () => {
    setCurrentPage('study-config');
  };
  
  const startStudySession = (options: StudyConfigOptions) => {
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
  };

  const startFlashcards = () => {
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
          />
        );
      case 'flashcard':
        return (
          <FlashcardPlayer
            flashcards={flashcards}
            onGoToDashboard={goToDashboard}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            onStartExam={startNewExam}
            onStartStudyConfig={goToStudyConfig}
            onStartFlashcards={startFlashcards}
            examHistory={examHistory}
            onViewResult={viewResultDetails}
            onImportHistory={saveHistory}
          />
        );
    }
  };

  return <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">{renderPage()}</div>;
};

export default App;
