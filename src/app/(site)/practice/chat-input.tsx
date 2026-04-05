'use client';

import { useState, type FormEvent } from 'react';

interface ChatInputProps {
    onSend: (value: string) => void;
    isSending: boolean;
}

// Chat input component isolates the text box and send button.
// Later, this can be replaced with a debounced input, speech-to-text,
// or a websocket client without changing the parent page.
export default function ChatInput({ onSend, isSending }: ChatInputProps) {
    const [value, setValue] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (!trimmed || isSending) {
            return;
        }

        onSend(trimmed);
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Type your question, e.g. 'How do I factor this?'"
                className="min-h-[52px] w-full rounded-full border border-slate-200 bg-slate-50 px-5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                disabled={isSending}
            />
            <button
                type="submit"
                disabled={isSending}
                className="inline-flex h-12 min-w-[120px] items-center justify-center rounded-full bg-primary-500 px-5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSending ? 'Sending...' : 'Send'}
            </button>
        </form>
    );
}
