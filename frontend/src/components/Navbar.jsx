import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui';
import { LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name') || 'User';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <Shield size={20} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        SkillMatch
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    {token ? (
                        <>
                            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-200">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <User size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 leading-tight">{name}</span>
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{role}</span>
                                </div>
                            </div>
                            <Button onClick={handleLogout} variant="ghost" className="text-slate-600 gap-2">
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="ghost">Sign In</Button>
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

