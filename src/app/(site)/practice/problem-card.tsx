'use client';
import { BlockMath } from 'react-katex';

export type HintType = 'concept' | 'step' | 'formula' | 'solution';

interface Problem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    topic: string;
    type?: 'text' | 'latex';
    hintType: HintType;
}

interface ProblemCardProps {
    problem: Problem;
    onHint: (type: HintType) => void;
}

export default function ProblemCard({ problem, onHint }: ProblemCardProps) {
    const isLatex = problem.type === 'latex' || problem.title.includes('\\');

    return (
        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Current Problem
                </p>

                <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
                    Solve for x:
                </h1>

                <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                    {isLatex ? (
                        <BlockMath math={problem.title} />
                    ) : (
                        problem.title
                    )}
                </div>

                {/* 🔥 NÚT GỢI Ý */}
                <button
                    onClick={() => onHint(problem.hintType)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
                >
                    💡 Gợi ý
                </button>

                <div className="mt-4 flex gap-2 text-sm">
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">
                        Difficulty: {problem.difficulty}
                    </span>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                        Topic: {problem.topic}
                    </span>
                </div>
            </div>

            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active Task
                </span>
            </div>
        </div>
    );
}