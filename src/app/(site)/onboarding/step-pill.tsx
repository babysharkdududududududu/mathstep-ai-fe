function StepPill({ index, label, active }: { index: number; label: string; active: boolean }) {
    return (
        <div
            className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
        >
            <span className="h-6 w-6 rounded-full grid place-items-center bg-white text-sm font-bold text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white">
                {index}
            </span>
            {label}
        </div>
    );
}

export default StepPill;