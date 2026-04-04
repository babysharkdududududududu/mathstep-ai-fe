'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const gradeOptions = ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'];
const topicOptions = ['Đại số', 'Hình học', 'Giải tích'];
const modeOptions = ['Luyện tập thông minh', 'Thư viện công thức', 'Giải từng bước'];

function StepPill({ index, label, active }: { index: number; label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      <span className="h-8 w-8 rounded-full grid place-items-center bg-white text-sm font-bold text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white">
        {index}
      </span>
      {label}
    </div>
  );
}

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${
        selected
          ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900'
      }`}
    >
      {label}
    </button>
  );
}

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
    <section className="min-h-screen bg-slate-50 py-20 dark:bg-slate-950">
      <div className="wrapper">
        <div className="mb-12 text-center">
          <p className="text-primary-500 font-semibold uppercase tracking-[0.3em] mb-3">Welcome to MathStep AI</p>
          <h1 className="text-4xl font-bold sm:text-5xl text-slate-900 dark:text-white">
            Let&apos;s Personalize Your Path
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Tailor your learning experience by selecting your grade, current topics, and goal for today.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="rounded-[32px] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-700 p-8 text-white shadow-2xl">
            <div className="h-full flex flex-col justify-between gap-8">
              <div>
                <div className="mb-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 shadow-sm">
                  Build Mastery
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Every problem you solve fine-tunes your personal AI tutor&apos;s understanding of your learning style.</h2>
                <p className="mt-5 text-slate-200 text-base leading-7">
                  Start with your grade and goals, then let the platform recommend practice content that fits your pace. This onboarding helps us set up a learning path made for you.
                </p>
              </div>

              <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Daily stat</p>
                    <p className="mt-2 text-3xl font-bold">14,203</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-slate-200">Problems solved today</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white/10 px-4 py-5">
                    <p className="text-sm text-slate-300">Smart Practice</p>
                    <p className="mt-3 text-lg font-semibold">Adaptive review</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 px-4 py-5">
                    <p className="text-sm text-slate-300">Formula Lab</p>
                    <p className="mt-3 text-lg font-semibold">Fast recall</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 px-4 py-5">
                    <p className="text-sm text-slate-300">Step-by-Step</p>
                    <p className="mt-3 text-lg font-semibold">Guided solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Step {step} of 3</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">Bắt đầu cấu hình</h2>
              </div>
              <div className="inline-flex items-center gap-3">
                <StepPill index={1} label="Grade" active={step === 1} />
                <StepPill index={2} label="Topic" active={step === 2} />
                <StepPill index={3} label="Mode" active={step === 3} />
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{stepTitle}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stepDescription}</p>
              </div>

              <div className="grid gap-4">
                {step === 1 && (
                  <div className="grid gap-3 sm:grid-cols-2">
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

                {step === 2 && (
                  <div className="grid gap-3 sm:grid-cols-2">
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

                {step === 3 && (
                  <div className="grid gap-3 sm:grid-cols-1">
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

              <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Selected</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <span className="rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">{selectedGrade}</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">{selectedTopic}</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">{selectedMode}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={nextDisabled}
                className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {step === 3 ? 'Finish setup' : 'Next step'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
