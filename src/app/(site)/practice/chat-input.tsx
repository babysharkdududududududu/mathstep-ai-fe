'use client';

import { useState, type FormEvent } from 'react';
import { evaluate } from 'mathjs';
interface ChatInputProps {
    onSend: (payload: { type: 'text' | 'math'; content: string }) => void;
    isSending: boolean;
}

// Math formula toolbar buttons for common operations
const mathButtons = [

    { label: '→', latex: '\\to' },
    { label: '←', latex: '\\leftarrow' },
    { label: '↔', latex: '\\leftrightarrow' },
    { label: '↑', latex: '\\uparrow' },
    { label: '↓', latex: '\\downarrow' },

    { label: '∈', latex: '\\in' },
    { label: '∉', latex: '\\notin' },
    { label: '∩', latex: '\\cap' },
    { label: '∪', latex: '\\cup' },
    { label: '⊂', latex: '\\subset' },
    { label: '⊆', latex: '\\subseteq' },
    { label: '⇒', latex: '\\Rightarrow' },
    { label: '⇔', latex: '\\Leftrightarrow' },

    { label: 'sin', latex: '\\sin' },
    { label: 'cos', latex: '\\cos' },
    { label: 'tan', latex: '\\tan' },
    { label: 'cot', latex: '\\cot' },
    { label: 'sec', latex: '\\sec' },
    { label: 'csc', latex: '\\csc' },
    { label: 'θ', latex: '\\theta' },
    { label: 'π', latex: '\\pi' },

    { label: 'log', latex: '\\log_{}' },
    { label: 'ln', latex: '\\ln' },
    { label: 'eˣ', latex: 'e^{}' },
    { label: '10ˣ', latex: '10^{}' },

    { label: '∫', latex: '\\int' },
    { label: '∫ₐᵇ', latex: '\\int_{}^{}' },
    { label: 'd/dx', latex: '\\frac{d}{dx}' },
    { label: '∂', latex: '\\partial' },
    { label: 'lim', latex: '\\lim_{x \\to }' },
    { label: '∞', latex: '\\infty' },
    { label: 'Σ', latex: '\\sum' },
    { label: 'Π', latex: '\\prod' },

    { label: 'x²', latex: 'x^{2}' },
    { label: 'x³', latex: 'x^{3}' },
    { label: 'x₁', latex: 'x_{1}' },
    { label: '±', latex: '\\pm' },
    // { label: '∓', latex: '\\mp' },
    { label: '×', latex: '\\times' },
    { label: '÷', latex: '\\div' },
    { label: '≈', latex: '\\approx' },
    { label: '=', latex: '=' },
    { label: '≠', latex: '\\neq' },
    { label: '<', latex: '<' },
    { label: '>', latex: '>' },
    { label: '≤', latex: '\\le' },
    { label: '≥', latex: '\\ge' },

    { label: 'a/b', latex: '\\frac{}{}' },
    { label: '()', latex: '\\left( \\right)' },
    { label: '[]', latex: '\\left[ \\right]' },
    { label: '{}', latex: '\\left\\{ \\right\\}' },
    { label: '^', latex: '^{}' },
    { label: '_', latex: '_{}' },
    { label: '|x|', latex: '\\left| x \\right|' },
    { label: '√', latex: '\\sqrt{}' },
    { label: '∛', latex: '\\sqrt[3]{}' },
];

export default function ChatInput({ onSend, isSending }: ChatInputProps) {
    const [mode, setMode] = useState<'text' | 'math'>('text');
    const [textValue, setTextValue] = useState('');
    const [mathValue, setMathValue] = useState('');
    const [showToolbar, setShowToolbar] = useState(false);

    const latexToMathjs = (latex: string) => {
        return latex
            .replace(/\\frac{([^}]*)}{([^}]*)}/g, '($1)/($2)')
            .replace(/\\sqrt{([^}]*)}/g, 'sqrt($1)')
            .replace(/\\sin\s*([^\s()]+)/g, 'sin($1)')
            .replace(/\\cos\s*([^\s()]+)/g, 'cos($1)')
            .replace(/\\tan\s*([^\s()]+)/g, 'tan($1)')
            .replace(/\\cot\s*([^\s()]+)/g, 'cot($1)')
            .replace(/\\sec\s*([^\s()]+)/g, 'sec($1)')
            .replace(/\\csc\s*([^\s()]+)/g, 'csc($1)')
            .replace(/\\ln\s*([^\s()]+)/g, 'ln($1)')
            .replace(/\\log\s*([^\s()]+)/g, 'log($1)')
            .replace(/\\pi/g, 'pi')
            .replace(/\s+/g, '')
            .replace(/\\times/g, '*')
            .replace(/\\cdot/g, '*')
            .replace(/\\div/g, '/');
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const content = mode === 'text' ? textValue.trim() : mathValue.trim();
        if (!content || isSending) return;

        if (mode === 'math') {
            // 1️⃣ Log LaTeX
            console.log('📐 LaTeX input:', content);

            // 2️⃣ Chuyển LaTeX sang MathJS
            const mathExpr = latexToMathjs(content);
            console.log('🔧 Converted MathJS expression:', mathExpr);

            // 3️⃣ Tính toán
            try {
                const result = evaluate(mathExpr);
                console.log('✅ RESULT:', result);
            } catch (err) {
                console.error('❌ Cannot evaluate:', err);
            }
        }

        onSend({
            type: mode,
            content,
        });

        setTextValue('');
        setMathValue('');
    };

    // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();

    //     const content = mode === 'text' ? textValue.trim() : mathValue.trim();
    //     console.log('🔥 SUBMIT CONTENT:', content, 'MODE:', mode);

    //     if (!content || isSending) return;

    //     if (mode === 'math') {
    //         // Chỉ log LaTeX, không tính toán
    //         console.log('📐 LaTeX input:', content);
    //     }

    //     onSend({
    //         type: mode,
    //         content,
    //     });

    //     setTextValue('');
    //     setMathValue('');
    // };

    const insertLatex = (latex: string) => {
        setMathValue((prev) => prev + latex);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {/* MODE SWITCH */}
            <div className="flex gap-2 flex-wrap">
                <button
                    type="button"
                    onClick={() => {
                        setMode('text');
                        setShowToolbar(false);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${mode === 'text'
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                >
                    📝 Text
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setMode('math');
                        setShowToolbar(!showToolbar);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${mode === 'math'
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                >
                    ∑ Math
                </button>
            </div>

            {/* MATH TOOLBAR */}
            {mode === 'math' && showToolbar && (
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Formula symbols</p>
                    <div className="grid grid-cols-5 gap-1 sm:grid-cols-10">
                        {mathButtons.map((btn) => (
                            <button
                                key={btn.latex}
                                type="button"
                                onClick={() => insertLatex(btn.latex)}
                                className="px-2 py-1 text-sm font-semibold rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 transition dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* INPUT AREA */}
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
                {mode === 'text' ? (
                    <input
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder="Nhập câu hỏi của bạn, ví dụ: 'Làm sao để phân tích?'"
                        disabled={isSending}
                        className="min-h-[52px] w-full rounded-full border border-slate-200 bg-slate-50 px-5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                ) : (
                    <input
                        value={mathValue}
                        onChange={(e) => setMathValue(e.target.value)}
                        placeholder="Nhập công thức LaTeX, ví dụ: x^2 - 5x + 6 = 0"
                        disabled={isSending}
                        className="min-h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                )}

                {/* SEND BUTTON */}
                <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex h-12 min-w-[120px] items-center justify-center rounded-full bg-primary-500 px-5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSending ? 'Gửi...' : 'Gửi'}
                </button>
            </div>
        </form>
    );
}
