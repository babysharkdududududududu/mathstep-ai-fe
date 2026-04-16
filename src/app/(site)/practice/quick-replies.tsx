'use client';

interface QuickRepliesProps {
    onSelect: (payload: { type: 'text'; content: string }) => void;
    disabled?: boolean;
}

const chips = [
    { label: 'Giải thích lại 📋', content: 'Giải thích lại cho em' },
    { label: 'Cho ví dụ khác 📝', content: 'Cho em ví dụ khác' },
    { label: 'Tôi chưa hiểu 😕', content: 'Em chưa hiểu bước này' },
];

export default function QuickReplies({ onSelect, disabled }: QuickRepliesProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
                <button
                    key={chip.content}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect({ type: 'text', content: chip.content })}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {chip.label}
                </button>
            ))}
        </div>
    );
}
