'use client';

import { useState } from 'react';
import 'katex/dist/katex.min.css';
import 'react-mathquill/dist/mathquill.css';
import { EditableMathField } from 'react-mathquill';

interface ChatInputProps {
    onSend: (payload: { type: 'text' | 'math'; content: string }) => void;
    isSending: boolean;
}

export default function ChatInput({ onSend, isSending }: ChatInputProps) {
    const [mode, setMode] = useState<'text' | 'math'>('text');
    const [textValue, setTextValue] = useState('');
    const [mathValue, setMathValue] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const content =
            mode === 'text'
                ? textValue.trim()
                : mathValue.trim();

        if (!content || isSending) return;

        onSend({
            type: mode,
            content,
        });

        setTextValue('');
        setMathValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {/* MODE SWITCH */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setMode('text')}
                    className={`px-3 py-1 rounded-full text-sm ${mode === 'text'
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                >
                    Text
                </button>

                <button
                    type="button"
                    onClick={() => setMode('math')}
                    className={`px-3 py-1 rounded-full text-sm ${mode === 'math'
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                >
                    Math
                </button>
            </div>

            {/* INPUT AREA */}
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                {mode === 'text' ? (
                    <input
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder="Type your question..."
                        disabled={isSending}
                        className="min-h-[52px] w-full rounded-full border border-slate-200 bg-slate-50 px-5 text-sm text-slate-900 outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                ) : (
                    <div className="min-h-[52px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-950">
                        <EditableMathField
                            latex={mathValue}
                            onChange={(mathField) => {
                                setMathValue(mathField.latex());
                            }}
                            className="w-full text-lg"
                        />
                    </div>
                )}

                {/* SEND BUTTON */}
                <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex h-12 min-w-[120px] items-center justify-center rounded-full bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60"
                >
                    {isSending ? 'Sending...' : 'Send'}
                </button>
            </div>
        </form>
    );
}