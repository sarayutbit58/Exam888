import { Domain, type ExamResult } from '../types';

export const isValidHistory = (data: any): data is ExamResult[] => {
    if (!Array.isArray(data)) {
        return false;
    }
    return data.every(item => {
        if (typeof item !== 'object' || item === null) return false;
        if (typeof item.id !== 'string') return false;
        if (typeof item.date !== 'string') return false;
        if (typeof item.score !== 'number') return false;
        if (typeof item.timeTaken !== 'number') return false;
        if (!Array.isArray(item.userAnswers)) return false;
        if (!Array.isArray(item.questions)) return false;
        if (!Array.isArray(item.domainScores)) return false;

        // Deep check userAnswers
        const hasValidUserAnswers = item.userAnswers.every((ua: any) =>
            typeof ua === 'object' && ua !== null &&
            typeof ua.questionId === 'number' &&
            typeof ua.selectedAnswer === 'string' &&
            typeof ua.isCorrect === 'boolean'
        );
        if (!hasValidUserAnswers) return false;

        // Deep check domainScores
        const hasValidDomainScores = item.domainScores.every((ds: any) =>
            typeof ds === 'object' && ds !== null &&
            typeof ds.domain === 'string' && Object.values(Domain).includes(ds.domain as Domain) &&
            typeof ds.total === 'number' &&
            typeof ds.correct === 'number' &&
            typeof ds.score === 'number'
        );
        if (!hasValidDomainScores) return false;
        
        return true;
    });
};
