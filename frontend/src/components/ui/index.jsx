

export const Button = ({ children, className = '', variant = 'primary', loading = false, ...props }) => {
    const variants = {
        primary: 'premium-btn-primary text-white',
        secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)]',
        ghost: 'bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]',
        outline: 'bg-transparent border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
    };
    
    return (
        <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            {children}
        </button>
    );
};

export const Card = ({ children, className = '', ...props }) => (
    <div className={`premium-card p-6 ${className}`} {...props}>
        {children}
    </div>
);

export const Input = ({ label, className = '', ...props }) => (
    <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-[var(--muted-foreground)] ml-1">{label}</label>}
        <input 
            className={`w-full px-4 py-2 premium-input rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none transition-all ${className}`} 
            {...props} 
        />
    </div>
);

export const Badge = ({ children, variant = 'info', className = '' }) => {
    const variants = {
        info: 'bg-[var(--secondary)] text-[var(--muted-foreground)]',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        verified: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        primary: 'bg-[var(--primary)] text-[var(--primary-foreground)]'
    };
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
