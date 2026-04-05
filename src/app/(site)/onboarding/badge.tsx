
function Badge({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-slate-900">
            <span className="text-xs text-slate-500 dark:text-slate-400">
                {label}:
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-100">
                {value}
            </span>
        </div>
    );
}

export default Badge;
