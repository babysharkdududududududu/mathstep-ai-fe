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
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div className="flex-1">
                {/* Header: Label & Status Badge on Mobile */}
                <div className="flex items-center justify-between sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Current Problem
                    </p>
                    
                    {/* Status badge chỉ hiện ở đây trên Mobile */}
                    <div className="sm:hidden">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ACTIVE
                        </span>
                    </div>
                </div>

                <h1 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
                    Solve for x:
                </h1>

                {/* Công thức/Đề bài - Thêm overflow để không vỡ layout mobile */}
                <div className="mt-3 overflow-x-auto py-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    {isLatex ? (
                        <div className="flex justify-start">
                            <BlockMath math={problem.title} />
                        </div>
                    ) : (
                        problem.title
                    )}
                </div>

                {/* Nhóm Tag: Co dãn tốt trên mọi màn hình */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                        {problem.difficulty}
                    </span>

                    <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        #{problem.topic}
                    </span>
                </div>

                {/* Nút Gợi ý: Full width trên mobile rất nhỏ, nhưng ở đây dùng w-fit để tinh tế */}
                <button
                    onClick={() => onHint(problem.hintType)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-95 sm:w-auto sm:py-2"
                >
                    💡 Xem gợi ý
                </button>
            </div>

            {/* Desktop Status Sidebar */}
            <div className="hidden sm:block">
                <div className="rounded-2xl bg-white/50 p-3 dark:bg-slate-900/50">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Active Task
                    </span>
                </div>
            </div>
        </div>
    );
}