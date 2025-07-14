
export enum Domain {
  SecurityPrinciples = "Security Principles",
  BC_DR_IncidentResponse = "Business Continuity (BC), Disaster Recovery (DR) & Incident Response Concepts",
  AccessControls = "Access Controls Concepts",
  NetworkSecurity = "Network Security",
  SecurityOperations = "Security Operations",
  Unknown = "Unknown"
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  keywords: string[];
  domain: Domain;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface DomainScore {
  domain: Domain;
  total: number;
  correct: number;
  score: number;
}

export interface ExamResult {
  id: string;
  date: string;
  score: number;
  userAnswers: UserAnswer[];
  questions: Question[];
  domainScores: DomainScore[];
  timeTaken: number;
}

export type StudyMode = 'all-domains' | 'incorrect' | 'flagged';

export interface StudyConfigOptions {
    domains: Domain[];
    questionCount: number;
    studyMode: StudyMode;
}

export interface Flashcard {
    id: number;
    front: string;
    back: string;
    domain: Domain;
}
