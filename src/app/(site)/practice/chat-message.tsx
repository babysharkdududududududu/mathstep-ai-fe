import type { ChatMessage } from './chat-utils';

// Single chat bubble component for both user and AI messages.
// This component is intentionally simple so it can be extended later
// for avatars, attachments, or streaming responses.
export default function ChatMessage({ message }: { message: ChatMessage }) {
    const isAi = message.role === 'ai';

    return (
        <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
            <div
                className={`max-w-[90%] rounded-[28px] border p-5 shadow-sm transition ${isAi
                        ? 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100'
                        : 'bg-primary-500 text-white'
                    }`}
            >
                {isAi && message.title ? (
                    <p className="text-sm font-semibold">{message.title}</p>
                ) : null}

                <p className={`mt-3 text-sm leading-7 ${isAi ? 'text-slate-600 dark:text-slate-300' : 'text-white'}`}>
                    {message.text}
                </p>

                {isAi && message.hint ? (
                    <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {message.hint}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
