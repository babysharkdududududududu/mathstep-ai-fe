function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${selected
                ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900'
                }`}
        >
            {label}
        </button>
    );
}

export default OptionButton;