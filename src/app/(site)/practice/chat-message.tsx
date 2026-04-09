'use client';

import type { ChatMessage } from './chat-utils';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function ChatMessage({ message }: { message: ChatMessage }) {
    const isAi = message.role === 'ai';
    const isMath = message.type === 'math';

    return (
        <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
            <div
                className={`
                    /* Trên mobile dùng 85%, laptop dùng 70% để text không bị quá dài khó đọc */
                    max-w-[85%] sm:max-w-[70%] 
                    /* Bo góc: Mobile bo ít hơn chút cho hiện đại, laptop bo rộng */
                    rounded-[20px] sm:rounded-[28px] 
                    border p-4 sm:p-5 shadow-sm transition-all
                    ${isAi
                        ? 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100'
                        : 'bg-indigo-600 text-white border-transparent shadow-indigo-100 dark:shadow-none'
                    }
                `}
            >
                {isAi && message.title ? (
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider opacity-60">
                        {message.title}
                    </p>
                ) : null}

                <div
                    className={`
                        text-[14px] sm:text-sm leading-6 sm:leading-7 
                        /* QUAN TRỌNG: Xử lý tràn cho công thức Toán trên mobile */
                        overflow-x-auto overflow-y-hidden
                        ${isAi ? 'text-slate-600 dark:text-slate-300' : 'text-white'}
                    `}
                >
                    {isMath ? (
                        <div className="py-1 min-w-[200px]"> 
                            <BlockMath math={message.text} />
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    )}
                </div>

                {isAi && message.hint ? (
                    <div className="mt-3 rounded-xl bg-slate-100/80 p-3 text-[13px] italic text-slate-700 dark:bg-slate-900/80 dark:text-slate-400 border-l-4 border-indigo-400">
                        <span className="mr-1 inline-block">💡</span>
                        {message.hint}
                    </div>
                ) : null}
            </div>
        </div>
    );
}