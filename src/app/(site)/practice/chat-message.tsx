'use client';

import type { ChatMessage } from './chat-utils';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * TypingIndicator Component
 * Modern animated dots for loading state
 */
function TypingIndicator() {
    return (
        <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse animation-delay-200" />
            <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse animation-delay-400" />
        </div>
    );
}

/**
 * HintMessage Component
 * Subtle highlight for hint text
 */
function HintMessage({ hint }: { hint: string }) {
    return (
        <div className="mt-3 flex gap-2.5 rounded-lg border border-amber-200/40 bg-gradient-to-r from-amber-50 to-orange-50 px-3.5 py-2.5 dark:border-amber-900/30 dark:from-amber-950/40 dark:to-orange-950/40">
            <span className="flex-shrink-0 text-base leading-none">💡</span>
            <p className="text-xs leading-relaxed text-amber-900/75 dark:text-amber-200/60 font-medium">
                {hint}
            </p>
        </div>
    );
}

/**
 * MessageBubble Component
 * Reusable chat bubble with role-based styling
 */
function MessageBubble({isAi,title,content,hint,isMath,}: {isAi: boolean;title?: string;content: string;hint?: string;isMath: boolean;}) {
    return (
        <div
            className={`
                flex w-full gap-3
                ${isAi ? 'justify-start' : 'justify-end'}
                animate-in fade-in slide-in-from-bottom-2 duration-300
            `}
        >
            <div
                className={`  max-w-xs sm:max-w-sm md:max-w-md  rounded-2xl px-4 py-3 sm:px-5 sm:py-4  transition-all duration-200
                    ${
                        isAi
                            ? `
                                bg-white dark:bg-slate-900 
                                border border-slate-200 dark:border-slate-700
                                shadow-sm dark:shadow-lg
                                text-slate-900 dark:text-slate-50
                            `
                            : `
                                bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700
                                shadow-md dark:shadow-indigo-900/30
                                text-white
                                rounded-2xl rounded-br-sm
                            `
                    }
                `}
            >
                {isAi && title && (
                    <div className="mb-2 flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                            AI
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {title}
                        </p>
                    </div>
                )}

                <div
                    className={`text-sm sm:text-base leading-relaxed overflow-x-auto overflow-y-hidden
                        ${isAi ? 'text-slate-700 dark:text-slate-200' : 'text-white'}
                    `}
                >
                    {isMath ? (
                        <div className="flex justify-center py-2 px-2 bg-slate-50 dark:bg-slate-800 rounded-lg my-1 overflow-x-auto">
                            <BlockMath math={content} />
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap break-words">{content}</p>
                    )}
                </div>

                {isAi && hint && <HintMessage hint={hint} />}
            </div>
        </div>
    );
}

/**
 * Main ChatMessage Component
 */
export default function ChatMessage({ message }: { message: ChatMessage }) {
    const isAi = message.role === 'ai';
    const isMath = message.type === 'math';

    return (
        <MessageBubble isAi={isAi} title={message.title} content={message.text} hint={message.hint} isMath={isMath}/>
    );
}

export { TypingIndicator, HintMessage, MessageBubble };