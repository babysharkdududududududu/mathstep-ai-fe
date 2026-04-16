'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInput from './chat-input';
import ChatMessage, { TypingIndicator } from './chat-message';
import PracticeSidebar from './practice-sidebar';
import { ChatMessage as ChatMessageType, getAiResponse, getDefaultMessages } from './chat-utils';

import ProblemCard, { HintType } from './problem-card';
import { mockProblems } from './mock-problems';

export default function PracticePage() {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessageType[]>(getDefaultMessages());
    const [isSending, setIsSending] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const responseTimeoutRef = useRef<number | null>(null);
    const currentProblem = mockProblems[1];

    const handleHint = (type: HintType) => {
        const hintText = {
            concept: 'Hãy nhớ công thức nghiệm của phương trình bậc hai. Tập trung vào cách tìm hệ số phù hợp.',
            step: 'Thử phân tích thành nhân tử: tìm hai số nhân bằng 6 và cộng bằng -5.',
            formula: 'Công thức nghiệm bậc hai: x = (-b ± √(b² - 4ac)) / (2a).',
            solution: 'Nghiệm của phương trình này là x = 2 và x = 3.',
        }[type];

        const aiMessage: ChatMessageType = {
            id: `hint-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            role: 'ai',
            type: 'text',
            title: 'AI Tutor',
            text: 'Đây là gợi ý cho bạn:',
            hint: hintText,
        };

        setMessages((prev) => [...prev, aiMessage]);
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('completedOnboarding')) {
            router.replace('/onboarding');
        }
    }, [router]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    useEffect(() => {
        return () => {
            if (responseTimeoutRef.current) {
                window.clearTimeout(responseTimeoutRef.current);
            }
        };
    }, []);

    const handleSend = (payload: { type: 'text' | 'math'; content: string }) => {
        if (!payload.content.trim() || isSending) {
            return;
        }

        const userMessage: ChatMessageType = {
            id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            role: 'user',
            type: payload.type,
            text: payload.content,
        };

        setMessages((current) => [...current, userMessage]);
        setIsSending(true);

        responseTimeoutRef.current = window.setTimeout(() => {
            const aiMessage = getAiResponse(payload.content, payload.type);
            setMessages((current) => [...current, aiMessage]);
            setIsSending(false);
        }, 700);
    };

    return (
        <section className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center py-10 sm:py-16">

            {/* full width wrapper */}
            <div className="w-full px-6">

                {/* centered content */}
                <div className="max-w-[1600px] mx-auto grid gap-6 lg:grid-cols-[1fr_320px]">

                    <main className="">
                        <ProblemCard problem={currentProblem} onHint={handleHint} />

                        <div className="gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-6">

                                <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 p-4 sm:p-6 shadow-sm dark:shadow-lg">
                                    <div ref={scrollContainerRef} className="space-y-4 max-h-[540px] overflow-y-auto pr-1 scroll-smooth">
                                        {messages.map((message) => (
                                            <ChatMessage key={message.id} message={message} />
                                        ))}
                                        {isSending ? (
                                            <div className="flex justify-start">
                                                <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm dark:shadow-lg">
                                                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                                        AI
                                                    </div>
                                                    <TypingIndicator />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <ChatInput onSend={handleSend} isSending={isSending} />

                            </div>

                        </div>
                    </main>

                    {/* Right Sidebar — user profile data from API */}
                    <PracticeSidebar />

                </div>
            </div>
        </section>
    );
}
