import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from './ui';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            if (localStorage.getItem('role') === 'CANDIDATE') navigate('/candidate');
            else navigate('/employer');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:8080/api/auth/register', form);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            const rawMsg = error.response?.data?.message || 
                        (typeof error.response?.data === 'string' ? error.response.data : null) || 
                        error.message;
            const msg = typeof rawMsg === 'string' ? rawMsg : JSON.stringify(rawMsg);
            setError(msg || 'Registration failed. Please check if the backend is running and MongoDB is connected.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4 bg-transparent py-12 transition-colors">
            <Card className="w-full max-w-md p-8 sm:p-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-indigo-200">
                        S
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center">Join SkillMatch</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">Your path to a verified career starts here</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <Input 
                        label="Full Name" 
                        placeholder="John Doe" 
                        onChange={(e)=>setForm({...form, name: e.target.value})} 
                        required 
                    />
                    <Input 
                        label="Email Address" 
                        type="email" 
                        placeholder="john@example.com" 
                        onChange={(e)=>setForm({...form, email: e.target.value})} 
                        required 
                    />
                    <Input 
                        label="Password" 
                        type="password" 
                        placeholder="••••••••" 
                        onChange={(e)=>setForm({...form, password: e.target.value})} 
                        required 
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Account Type</label>
                        <select 
                            onChange={(e)=>setForm({...form, role: e.target.value})} 
                            className="w-full px-4 py-2.5 premium-card premium-input border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none bg-white dark:bg-slate-800 cursor-pointer"
                        >
                            <option value="CANDIDATE">Candidate (Job Seeker)</option>
                            <option value="EMPLOYER">Employer (Recruiter)</option>
                        </select>
                    </div>

                    <div className="flex items-start pt-1">
                        <input type="checkbox" id="terms" required className="mt-1 mr-3 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                            I agree to the <button type="button" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Terms of Service</button> and <button type="button" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Privacy Policy</button>.
                        </label>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base mt-4" loading={loading}>
                        Get Started
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        Already have an account? {' '}
                        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline-offset-4 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Register;

