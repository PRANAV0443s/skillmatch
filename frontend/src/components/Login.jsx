import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from './ui';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            if (localStorage.getItem('role') === 'CANDIDATE') navigate('/candidate');
            else navigate('/employer');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            setIsTransitioning(true);
            setTimeout(() => {
                if(res.data.role === 'CANDIDATE') navigate('/candidate');
                else navigate('/employer');
            }, 1000);
        } catch (error) {
            setError(error.response?.data || 'Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4 bg-transparent transition-colors">
            {isTransitioning && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--card-glass)] backdrop-blur-2xl transition-all duration-700 ease-out animate-fade-in">
                    <div className="flex flex-col items-center space-y-6 animate-scale-up">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-indigo-500/30 animate-pulse">
                            S
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Securing Session...</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Verifying blockchain identity</p>
                        </div>
                        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            )}
            <Card className="w-full max-w-md p-8 sm:p-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-indigo-200">
                        S
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center">Welcome to SkillMatch</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">Verified Hiring for Modern Teams</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <Input 
                        label="Email Address" 
                        type="email" 
                        placeholder="name@company.com" 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)} 
                        required 
                    />
                    <Input 
                        label="Password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)} 
                        required 
                    />
                    
                    <div className="flex justify-end pt-1">
                        <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</button>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base" loading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        Don't have an account? {' '}
                        <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline-offset-4 hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;

