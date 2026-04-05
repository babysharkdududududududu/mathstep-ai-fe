// Sidebar component for the practice screen. This isolates layout from
// the chat and problem view so the page can stay focused on message logic.
export default function PracticeSidebar() {
    return (
        <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Learning Path</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Algebra II · Limits</h2>
            </div>

            <div className="space-y-3">
                <button className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
                    Current Problem
                </button>
                <button className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                    History
                </button>
                <button className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                    Formula Sheet
                </button>
                <button className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                    Settings
                </button>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-100 p-5 dark:bg-slate-950">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Next problem</p>
                <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Explain x² - 5x + 6 = 0</p>
                <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 w-2/5 rounded-full bg-primary-500" />
                </div>
            </div>

            <button className="mt-8 w-full rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
                + New Problem
            </button>
        </aside>
    );
}
