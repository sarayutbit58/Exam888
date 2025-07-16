
import { getQuestions, getFlashcards, calculateResults } from './examService';
import { Domain, Question } from '../types';

// --- Test Utilities ---
class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

function assertEquals(actual: any, expected: any, message: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new AssertionError(`${message}\nExpected: ${JSON.stringify(expected, null, 2)}\nActual:   ${JSON.stringify(actual, null, 2)}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new AssertionError(message);
  }
}

// --- Test Data ---
const mockQuestions: Question[] = [
  { id: 1, question: 'Q1', options: ['A', 'B'], correctAnswer: 'A', domain: Domain.SecurityPrinciples, explanation: '', keywords: [] },
  { id: 2, question: 'Q2', options: ['C', 'D'], correctAnswer: 'D', domain: Domain.SecurityPrinciples, explanation: '', keywords: [] },
  { id: 3, question: 'Q3', options: ['E', 'F'], correctAnswer: 'E', domain: Domain.NetworkSecurity, explanation: '', keywords: [] },
  { id: 4, question: 'Q4', options: ['G', 'H'], correctAnswer: 'H', domain: Domain.AccessControls, explanation: '', keywords: [] },
];


// --- Test Cases ---
const tests = {
  'calculateResults: should return 1000 for a perfect score': () => {
    const userAnswers = new Map<number, string>([[1, 'A'], [2, 'D'], [3, 'E'], [4, 'H']]);
    const result = calculateResults(mockQuestions, userAnswers, 100);
    assertEquals(result.score, 1000, 'Score should be 1000');
  },

  'calculateResults: should return 0 for a zero score': () => {
    const userAnswers = new Map<number, string>([[1, 'B'], [2, 'C'], [3, 'F'], [4, 'G']]);
    const result = calculateResults(mockQuestions, userAnswers, 100);
    assertEquals(result.score, 0, 'Score should be 0');
  },

  'calculateResults: should calculate partial scores correctly': () => {
    const userAnswers = new Map<number, string>([[1, 'A'], [2, 'C']]); // 1 correct, 1 incorrect, 2 unanswered
    const result = calculateResults(mockQuestions, userAnswers, 100);
    assertEquals(result.score, 250, 'Score should be 250 for 1/4 correct');
  },

  'calculateResults: should handle empty exams gracefully': () => {
    const result = calculateResults([], new Map(), 100);
    assertEquals(result.score, 0, 'Score should be 0 for an empty exam');
  },

  'calculateResults: should calculate domain scores correctly': () => {
    const userAnswers = new Map<number, string>([[1, 'A'], [2, 'C'], [4, 'H']]); // Q1(SP)-correct, Q2(SP)-incorrect, Q3(NS)-unanswered, Q4(AC)-correct
    const result = calculateResults(mockQuestions, userAnswers, 100);
    const spScore = result.domainScores.find(ds => ds.domain === Domain.SecurityPrinciples)?.score;
    const nsScore = result.domainScores.find(ds => ds.domain === Domain.NetworkSecurity)?.score;
    const acScore = result.domainScores.find(ds => ds.domain === Domain.AccessControls)?.score;
    
    assertEquals(spScore, 50, 'Security Principles score should be 50%');
    assertEquals(nsScore, 0, 'Network Security score should be 0%');
    assertEquals(acScore, 100, 'Access Controls score should be 100%');
  },
  
  'getQuestions: should parse a significant number of questions': () => {
    const questions = getQuestions();
    assert(questions.length > 200, `Expected > 200 questions, but got ${questions.length}`);
  },

  'getQuestions: should parse question content correctly': () => {
    const questions = getQuestions();
    const firstQuestion = questions.find(q => q.id === 1);
    assert(firstQuestion !== undefined, 'First question should exist');
    assertEquals(firstQuestion?.question, "One of the ST members has a malware on their PC. They claim they downloaded only a spreadsheet tool, not malware. Which type of malware did they encounter if the malware was designed to look legitimate but was actually malicious?", "First question text mismatch");
    assertEquals(firstQuestion?.correctAnswer, "Trojan", "First question correct answer mismatch");
    assertEquals(firstQuestion?.options.length, 4, "First question should have 4 options");
  },

  'getQuestions: all questions should have valid data and correct answer in options': () => {
    const questions = getQuestions();
    questions.forEach(q => {
      assert(q.id !== undefined, `Question ${q.id} is missing id`);
      assert(q.question && q.question.length > 0, `Question ${q.id} has empty question text`);
      assert(q.options && q.options.length > 1, `Question ${q.id} has insufficient options`);
      assert(q.correctAnswer && q.correctAnswer.length > 0, `Question ${q.id} has empty correct answer`);
      assert(q.explanation && q.explanation.length > 0, `Question ${q.id} has empty explanation`);
      assert(q.domain && q.domain !== Domain.Unknown, `Question ${q.id} has Unknown domain`);
      assert(q.options.includes(q.correctAnswer), `Correct answer for Q_ID ${q.id} ("${q.correctAnswer}") not found in its options: ${JSON.stringify(q.options)}`);
    });
  },

  'getFlashcards: should parse a significant number of flashcards': () => {
    const flashcards = getFlashcards();
    assert(flashcards.length > 20, `Expected > 20 flashcards, but got ${flashcards.length}`);
  },

  'getFlashcards: all flashcards should have valid data': () => {
    const flashcards = getFlashcards();
    flashcards.forEach(f => {
      assert(f.id !== undefined, `Flashcard is missing id`);
      assert(f.front && f.front.length > 0, `Flashcard ${f.id} has empty front`);
      assert(f.back && f.back.length > 0, `Flashcard ${f.id} has empty back`);
      assert(f.domain && f.domain !== Domain.Unknown, `Flashcard ${f.id} has Unknown domain`);
    });
  },
};


export interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
}

export function runAllTests(): TestResult[] {
    const results: TestResult[] = [];
    for (const [name, testFn] of Object.entries(tests)) {
        try {
            testFn();
            results.push({ name, passed: true });
        } catch (e: any) {
            results.push({ name, passed: false, error: e.message || 'An unknown error occurred' });
        }
    }
    return results;
}
