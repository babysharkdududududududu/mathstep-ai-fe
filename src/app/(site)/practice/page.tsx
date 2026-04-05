'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInput from './chat-input';
import ChatMessage from './chat-message';
import PracticeSidebar from './practice-sidebar';
import { ChatMessage as ChatMessageType, getAiResponse, getDefaultMessages } from './chat-utils';

const problemTitle = 'x² - 5x + 6 = 0';

export default function PracticePage() {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessageType[]>(getDefaultMessages());
    const [isSending, setIsSending] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const responseTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('completedOnboarding')) {
            router.replace('/onboarding');
        }
    }, [router]);

    useEffect(() => {
        // Scroll chat to the bottom when new messages are added.
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

    const handleSend = (text: string) => {
        if (!text.trim() || isSending) {
            return;
        }

        const userMessage: ChatMessageType = {
            id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            role: 'user',
            text,
        };

        setMessages((current) => [...current, userMessage]);
        setIsSending(true);

        // Simulated AI response. Replace this with a real API request later.
        responseTimeoutRef.current = window.setTimeout(() => {
            const aiMessage = getAiResponse(text);
            setMessages((current) => [...current, aiMessage]);
            setIsSending(false);
        }, 700);
    };

    return (
        // <section className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 sm:py-14">
        //     < className="justify-center w-full ">


        //         <div className="grid gap-6 xl:grid-cols-[280px_1.4fr_320px]">

        <section className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center py-10 sm:py-16">

            {/* full width wrapper */}
            <div className="w-full px-6">

                {/* centered content */}
                <div className="max-w-[1600px] mx-auto grid xl:grid-cols-[280px_1.4fr_320px] gap-6">
                    <PracticeSidebar />

                    <main className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Current Problem</p>
                                <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">Solve for x:</h1>
                                <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{problemTitle}</p>
                            </div>
                            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active Task
                                </span>
                            </div>
                        </div>

                        <div className="gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-6">
                                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">Difficulty: Moderate</span>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                                            Topic: Quadratic Equations
                                        </span>
                                    </div>
                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">Solve for x:</p>
                                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{problemTitle}</p>
                                </div>

                                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">AI Tutor Is Ready</p>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                                            {isSending ? 'Typing...' : 'Awaiting response...'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        I&apos;m here to guide you through factoring this quadratic. Think about numbers that multiply to 6.
                                    </p>
                                </div>

                                <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                                    <div ref={scrollContainerRef} className="space-y-5 max-h-[540px] overflow-y-auto pr-1">
                                        {messages.map((message) => (
                                            <ChatMessage key={message.id} message={message} />
                                        ))}
                                        {isSending ? (
                                            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">AI Tutor</p>
                                                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Đang trả lời câu hỏi của bạn...</p>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <ChatInput onSend={handleSend} isSending={isSending} />
                            </div>

                            <div className="space-y-6">
                                {/* <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">AI Tutor</p>
                                    <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Support</h2>
                                    <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                                        I&apos;m here to guide you through factoring this quadratic equation step by step.
                                    </p>
                                    <div className="mt-6 space-y-4">
                                        <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Next action</p>
                                            <p className="mt-2 font-semibold text-slate-900 dark:text-white">Think about numbers that multiply to 6.</p>
                                        </div>
                                        <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Hint</p>
                                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try pairs: (1, 6), (2, 3), (-2, -3).</p>
                                        </div>
                                    </div>
                                </div> */}

                                {/* <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Current progress</p>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
                                            <span>Completion</span>
                                            <span className="font-semibold">40%</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                            <div className="h-full w-2/5 rounded-full bg-primary-500" />
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
                                            <span>Mastery</span>
                                            <span className="font-semibold">Intermediate</span>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </main>
                    <PracticeSidebar />

                </div>
            </div>
        </section>
    );
}
