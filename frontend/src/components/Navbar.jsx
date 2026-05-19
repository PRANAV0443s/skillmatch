import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui';
import { LogOut, User, Shield, Moon, Sun } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name') || 'User';

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-[var(--card-glass)] backdrop-blur-lg border-b border-[var(--border-glass)] px-6 py-3 transition-colors">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <Shield size={20} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400">
                        SkillMatch
                    </span>
                </Link>

                <div className="flex items-center gap-4 sm:gap-6">
                    <button 
                        onClick={toggleTheme} 
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-300 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {token ? (
                        <>
                            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-gray-700">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 dark:text-gray-400">
                                    <User size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 dark:text-gray-200 leading-tight">{name}</span>
                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{role}</span>
                                </div>
                            </div>
                            <Button onClick={handleLogout} variant="ghost" className="text-slate-600 dark:text-gray-300 gap-2">
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="ghost" className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">Sign In</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Create Account</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
