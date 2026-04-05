import { HintType } from './problem-card'

export interface Problem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    topic: string;
    type?: 'text' | 'latex';
    hintType: HintType;
}

export const mockProblems: Problem[] = [
    {
        id: '1',
        title: 'x^2 - 5x + 6 = 0',
        difficulty: 'Easy',
        topic: 'Quadratic',
        type: 'latex',
        hintType: 'concept'
    },
    {
        id: '2',
        title: '\\frac{1}{2} + 3',
        difficulty: 'Easy',
        topic: 'Fractions',
        type: 'latex',
        hintType: 'step'
    }
];