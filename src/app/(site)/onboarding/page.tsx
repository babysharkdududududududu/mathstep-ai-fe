'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Badge from './badge';
import StepPill from './step-pill';
import OptionButton from './option-button';

const gradeOptions = ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'];
const topicOptions = ['Đại số', 'Hình học', 'Giải tích'];
const modeOptions = ['Luyện tập thông minh', 'Thư viện công thức', 'Giải từng bước'];


export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedGrade, setSelectedGrade] = useState('Lớp 10');

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('loggedIn')) {
            router.replace('/signin');
        }
    }, [router]);
    const [selectedTopic, setSelectedTopic] = useState('Đại số');
    const [selectedMode, setSelectedMode] = useState('Luyện tập thông minh');

    const stepTitle = useMemo(() => {
        if (step === 1) return 'Chọn khối lớp của bạn';
        if (step === 2) return 'Chọn chủ đề ưu tiên';
        return 'Chọn chế độ luyện tập phù hợp';
    }, [step]);

    const stepDescription = useMemo(() => {
        if (step === 1)
            return 'Chúng tôi sẽ điều chỉnh đề bài theo khung chương trình của bạn.';
        if (step === 2)
            return 'Bắt đầu với chủ đề bạn muốn cải thiện nhất.';
        return 'Chọn cách học phù hợp với mục tiêu trong ngày.';
    }, [step]);

    const activeSelection = useMemo(() => {
        if (step === 1) return selectedGrade;
        if (step === 2) return selectedTopic;
        return selectedMode;
    }, [step, selectedGrade, selectedTopic, selectedMode]);

    const nextDisabled = useMemo(() => {
        return !activeSelection;
    }, [activeSelection]);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
            return;
        }

        router.push('/');
    };

    return (
        <section className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center py-10 sm:py-16">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">

                {/* HEADER */}
                <div className="mb-8 sm:mb-12 text-center">
                    <p className="text-primary-500 font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 text-xs sm:text-sm">
                        Welcome to MathStep AI
                    </p>

                    <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                        Let&apos;s Personalize Your Path
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
                        Tailor your learning experience by selecting your grade, topic, and mode.
                    </p>
                </div>

                {/* CARD */}
                <div className="rounded-[24px] sm:rounded-[32px] border border-slate-200 bg-white p-5 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">

                    {/* STEP HEADER */}
                    <div className="mb-8 sm:mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                Step {step} of 3
                            </p>
                            <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                                Bắt đầu cấu hình
                            </h2>
                        </div>

                        {/* STEP PILLS FIX */}
                        <div className="-mx-8 px-5 overflow-x-auto">
                            <div className="flex gap-2 snap-x">
                                <div className="snap-start shrink-0">
                                    <StepPill index={1} label="Grade" active={step === 1} />
                                </div>
                                <div className="snap-start shrink-0">
                                    <StepPill index={2} label="Topic" active={step === 2} />
                                </div>
                                <div className="snap-start shrink-0">
                                    <StepPill index={3} label="Mode" active={step === 3} />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* CONTENT */}
                    <div className="space-y-8">

                        {/* TITLE */}
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                                {stepTitle}
                            </h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                {stepDescription}
                            </p>
                        </div>

                        {/* OPTIONS */}
                        <div className="grid gap-3">

                            {/* STEP 1 */}
                            {step === 1 && (
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-3">
                                    {gradeOptions.map((grade) => (
                                        <OptionButton
                                            key={grade}
                                            label={grade}
                                            selected={selectedGrade === grade}
                                            onClick={() => setSelectedGrade(grade)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-3">
                                    {topicOptions.map((topic) => (
                                        <OptionButton
                                            key={topic}
                                            label={topic}
                                            selected={selectedTopic === topic}
                                            onClick={() => setSelectedTopic(topic)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-3">
                                    {modeOptions.map((mode) => (
                                        <OptionButton
                                            key={mode}
                                            label={mode}
                                            selected={selectedMode === mode}
                                            onClick={() => setSelectedMode(mode)}
                                        />
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* SELECTED */}
                        <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                Selected
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
                                {selectedGrade && <Badge label="Grade" value={selectedGrade} />}
                                {selectedTopic && <Badge label="Topic" value={selectedTopic} />}
                                {selectedMode && <Badge label="Mode" value={selectedMode} />}
                            </div>
                        </div>

                    </div>

                    {/* ACTION */}
                    <div className="mt-8 flex gap-3">

                        <button
                            onClick={() => setStep(Math.max(1, step - 1))}
                            disabled={step === 1}
                            className="btn-secondary flex-1"
                        >
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={nextDisabled}
                            className="btn-primary flex-1"
                        >
                            {step === 3 ? 'Finish setup' : 'Next step'}
                        </button>

                    </div>

                </div>
            </div>
        </section>
    );
}

