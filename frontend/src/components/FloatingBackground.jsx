import { Briefcase, ShieldCheck, Award, Cpu, Globe, Compass, FileText, CheckCircle } from 'lucide-react';

const FloatingBackground = () => {
    const items = [
        { Icon: Briefcase, className: "top-[12%] left-[8%] animate-float-1 text-indigo-500", depth: "depth-near", size: 48 },
        { Icon: ShieldCheck, className: "top-[22%] right-[10%] animate-float-2 text-emerald-500", depth: "depth-mid", size: 54 },
        { Icon: Award, className: "bottom-[20%] left-[8%] animate-float-3 text-amber-500", depth: "depth-far", size: 44 },
        { Icon: Cpu, className: "bottom-[28%] right-[12%] animate-float-1 text-purple-500", depth: "depth-near", size: 50 },
        { Icon: Globe, className: "top-[40%] left-[12%] animate-float-2 text-blue-500", depth: "depth-far", size: 40 },
        { Icon: Compass, className: "top-[55%] right-[6%] animate-float-3 text-rose-500", depth: "depth-mid", size: 46 },
        { Icon: FileText, className: "top-[75%] left-[16%] animate-float-1 text-teal-500", depth: "depth-mid", size: 42 },
        { Icon: CheckCircle, className: "bottom-[40%] left-[4%] animate-float-2 text-emerald-500", depth: "depth-near", size: 38 },
        { Icon: Briefcase, className: "top-[4%] right-[22%] animate-float-3 text-indigo-500", depth: "depth-far", size: 36 },
        { Icon: ShieldCheck, className: "bottom-[8%] right-[25%] animate-float-1 text-indigo-500", depth: "depth-mid", size: 46 }
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none perspective-container preserve-3d">
            {/* Soft Ambient Glows */}
            <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-indigo-400/5 dark:bg-indigo-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-emerald-400/3 dark:bg-emerald-500/3 blur-[140px] pointer-events-none" />
            
            {/* Animated 3D Icons */}
            {items.map((item, idx) => {
                const { Icon, className, depth, size } = item;
                return (
                    <div 
                        key={idx} 
                        className={`absolute opacity-[0.35] dark:opacity-[0.18] hover:opacity-[0.55] dark:hover:opacity-[0.35] transition-opacity duration-700 preserve-3d ${className}`}
                    >
                        <div className={`${depth} transition-transform duration-500`}>
                            <Icon size={size} strokeWidth={2.5} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FloatingBackground;
