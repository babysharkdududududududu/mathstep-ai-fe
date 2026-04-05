// 'use client';

// import type { ChatMessage } from './chat-utils';
// // @ts-expect-error - react-katex doesn't have type definitions
// import { BlockMath } from 'react-katex';
// // @ts-expect-error - CSS import for KaTeX
// import 'katex/dist/katex.min.css';

// // Single chat bubble component for both user and AI messages.
// // Supports text and math formulas (KaTeX rendering).
// export default function ChatMessage({ message }: { message: ChatMessage }) {
//     const isAi = message.role === 'ai';
//     const isMath = message.type === 'math';

//     return (
//         <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
//             <div
//                 className={`max-w-[90%] rounded-[28px] border p-5 shadow-sm transition ${isAi
//                     ? 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100'
//                     : 'bg-primary-500 text-white'
//                     }`}
//             >
//                 {isAi && message.title ? (
//                     <p className="text-sm font-semibold">{message.title}</p>
//                 ) : null}

//                 <div className={`mt-3 text-sm leading-7 ${isAi ? 'text-slate-600 dark:text-slate-300' : 'text-white'}`}>
//                     {isMath ? (
//                         <BlockMath math={message.text} />
//                     ) : (
//                         <p>{message.text}</p>
//                     )}
//                 </div>

//                 {isAi && message.hint ? (
//                     <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
//                         {message.hint}
//                     </div>
//                 ) : null}
//             </div>
//         </div>
//     );
// }


'use client';

import type { ChatMessage } from './chat-utils';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Không cần @ts-expect-error nữa

// Single chat bubble component for both user and AI messages.
// Supports text and math formulas (KaTeX rendering).
export default function ChatMessage({ message }: { message: ChatMessage }) {
    const isAi = message.role === 'ai';
    const isMath = message.type === 'math';

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

                <div
                    className={`mt-3 text-sm leading-7 ${isAi ? 'text-slate-600 dark:text-slate-300' : 'text-white'
                        }`}
                >
                    {isMath ? <BlockMath math={message.text} /> : <p>{message.text}</p>}
                </div>

                {isAi && message.hint ? (
                    <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {message.hint}
                    </div>
                ) : null}
            </div>
        </div>
    );
}