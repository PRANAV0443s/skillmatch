$baseDir = "src/components"
New-Item -ItemType Directory -Force -Path $baseDir

# Navbar
Set-Content -Path "$baseDir/Navbar.jsx" -Value @"
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">SkillMatch</Link>
            <div>
                {token ? (
                    <>
                        <span className="mr-4">Role: {role}</span>
                        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-4">Login</Link>
                        <Link to="/register" className="bg-green-500 px-4 py-2 rounded">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
"@

# Login
Set-Content -Path "$baseDir/Login.jsx" -Value @"
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            if(res.data.role === 'CANDIDATE') navigate('/candidate');
            else navigate('/employer');
        } catch (error) {
            alert('Login failed: ' + (error.response?.data || error.message));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border p-2 mb-4 rounded" required />
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border p-2 mb-4 rounded" required />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
            </form>
        </div>
    );
};

export default Login;
"@

# Register
Set-Content -Path "$baseDir/Register.jsx" -Value @"
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', form);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed: ' + (error.response?.data || error.message));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <input type="text" placeholder="Name" onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full border p-2 mb-4 rounded" required />
                <input type="email" placeholder="Email" onChange={(e)=>setForm({...form, email: e.target.value})} className="w-full border p-2 mb-4 rounded" required />
                <input type="password" placeholder="Password" onChange={(e)=>setForm({...form, password: e.target.value})} className="w-full border p-2 mb-4 rounded" required />
                <select onChange={(e)=>setForm({...form, role: e.target.value})} className="w-full border p-2 mb-4 rounded">
                    <option value="CANDIDATE">Candidate</option>
                    <option value="EMPLOYER">Employer</option>
                </select>
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;
"@

# DashboardCandidate
Set-Content -Path "$baseDir/DashboardCandidate.jsx" -Value @"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardCandidate = () => {
    const [file, setFile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchProfile();
        fetchJobs();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/candidate/profile', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            setProfile(res.data);
        } catch (error) { console.error(error); }
    };

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/jobs', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            setJobs(res.data);
        } catch (error) { console.error(error); }
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8080/api/candidate/upload-resume', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + localStorage.getItem('token') 
                }
            });
            alert('Resume verified and stored on Blockchain!');
            fetchProfile();
            fetchJobs(); // Fetch jobs after verification
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>
            
            <div className="bg-white p-6 rounded shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Profile Verification</h2>
                {profile?.verified ? (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                        <p className="font-bold">Verified Profile Badge Active</p>
                        <p>IPFS CID: {profile.resumeCid}</p>
                        <p>Blockchain TX: {profile.resumeHashTx}</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-red-500 mb-4">Please upload your resume to verify your profile and see matching jobs.</p>
                        <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files[0])} className="mb-4" />
                        <button onClick={handleUpload} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                            {loading ? 'Uploading & Verifying...' : 'Upload Resume'}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">Matching Jobs</h2>
                {!profile?.verified ? (
                    <p className="text-gray-500 italic">Upload resume to see matching jobs.</p>
                ) : jobs.length === 0 ? (
                    <p>No jobs found.</p>
                ) : (
                    <div className="grid gap-4">
                        {jobs.map(job => (
                            <div key={job.id} className="border p-4 rounded">
                                <h3 className="font-bold text-lg">{job.title}</h3>
                                <p>{job.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCandidate;
"@

# DashboardEmployer
Set-Content -Path "$baseDir/DashboardEmployer.jsx" -Value @"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardEmployer = () => {
    const [jobs, setJobs] = useState([]);
    const [form, setForm] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/jobs', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            setJobs(res.data);
        } catch (error) { console.error(error); }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/jobs', form, {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            alert('Job Posted');
            fetchJobs();
            setForm({ title: '', description: '' });
        } catch (error) {
            alert('Failed to post job');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
            
            <div className="bg-white p-6 rounded shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
                <form onSubmit={handlePostJob}>
                    <input type="text" placeholder="Job Title" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} className="w-full border p-2 mb-4 rounded" required />
                    <textarea placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="w-full border p-2 mb-4 rounded" required></textarea>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post Job</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Posted Jobs</h2>
                <div className="grid gap-4">
                    {jobs.map(job => (
                        <div key={job.id} className="border p-4 rounded">
                            <h3 className="font-bold text-lg">{job.title}</h3>
                            <p>{job.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardEmployer;
"@

# App.jsx
Set-Content -Path "src/App.jsx" -Value @"
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import DashboardCandidate from './components/DashboardCandidate';
import DashboardEmployer from './components/DashboardEmployer';

const App = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/candidate" element={<DashboardCandidate />} />
                    <Route path="/employer" element={<DashboardEmployer />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
"@

# main.jsx
Set-Content -Path "src/main.jsx" -Value @"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"@
