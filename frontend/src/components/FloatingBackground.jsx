import { Briefcase, ShieldCheck, Award, Cpu, Globe, Compass, FileText, CheckCircle } from 'lucide-react';

const FloatingBackground = () => {
    const items = [
        { Icon: Briefcase, className: "top-[15%] left-[8%] animate-float-1 text-indigo-500", size: 48 },
        { Icon: ShieldCheck, className: "top-[25%] right-[12%] animate-float-2 text-emerald-500", size: 54 },
        { Icon: Award, className: "bottom-[20%] left-[10%] animate-float-3 text-amber-500", size: 44 },
        { Icon: Cpu, className: "bottom-[30%] right-[15%] animate-float-1 text-purple-500", size: 50 },
        { Icon: Globe, className: "top-[45%] left-[15%] animate-float-2 text-blue-500", size: 40 },
        { Icon: Compass, className: "top-[60%] right-[8%] animate-float-3 text-rose-500", size: 46 },
        { Icon: FileText, className: "top-[80%] left-[20%] animate-float-1 text-teal-500", size: 42 },
        { Icon: CheckCircle, className: "bottom-[45%] left-[5%] animate-float-2 text-emerald-500", size: 38 },
        { Icon: Briefcase, className: "top-[5%] right-[25%] animate-float-3 text-indigo-500", size: 36 },
        { Icon: ShieldCheck, className: "bottom-[10%] right-[30%] animate-float-1 text-indigo-500", size: 46 }
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
            {/* Soft Ambient Glows */}
            <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-indigo-400/5 dark:bg-indigo-500/5 blur-[120px]" />
            <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-emerald-400/3 dark:bg-emerald-500/3 blur-[140px]" />
            
            {/* Animated Icons */}
            {items.map((item, idx) => {
                const { Icon, className, size } = item;
                return (
                    <div 
                        key={idx} 
                        className={`absolute opacity-[0.03] dark:opacity-[0.07] hover:opacity-[0.15] dark:hover:opacity-[0.2] transition-opacity duration-700 ${className}`}
                    >
                        <Icon size={size} strokeWidth={1.5} />
                    </div>
                );
            })}
        </div>
    );
};

export default FloatingBackground;
