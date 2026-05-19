import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Badge } from './ui';
import { Upload, CheckCircle, Search, Briefcase, ShieldCheck, Clock } from 'lucide-react';

const DashboardCandidate = () => {
    const [file, setFile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchJobs();
        fetchAppliedJobs();
    }, []);

    async function fetchProfile() {
        try {
            const res = await axios.get('http://localhost:8080/api/candidate/profile', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            setProfile(res.data);
        } catch (error) { console.error(error); }
    }

    async function fetchJobs() {
        try {
            const res = await axios.get('http://localhost:8080/api/jobs', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            setJobs(res.data);
        } catch (error) { console.error(error); }
    }

    async function fetchAppliedJobs() {
        try {
            const res = await axios.get('http://localhost:8080/api/candidate/applied-jobs', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            setAppliedJobs(res.data);
        } catch (error) { console.error(error); }
    }

    const handleApply = async (jobId) => {
        try {
            await axios.post(`http://localhost:8080/api/candidate/apply/${jobId}`, {}, {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            alert('Application submitted successfully!');
            fetchAppliedJobs();
        } catch (error) {
            alert(error.response?.data || 'Failed to apply.');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/candidate/upload-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            fetchProfile();
            fetchJobs();
            fetchAppliedJobs();
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 sm:p-10 space-y-10">
            <header>
                <h1 className="text-4xl font-bold text-slate-800">SkillMatch Dashboard</h1>
                <p className="text-slate-500 mt-2">Manage your verified profile and discover matching opportunities.</p>
            </header>

            <section>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 flex flex-col justify-center items-center py-12 text-center">
                        {profile?.verified ? (
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                    <ShieldCheck size={40} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Profile Verified</h2>
                                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">Your resume has been hashed and secured on the blockchain network.</p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <Badge variant="verified" className="py-1.5 px-4 flex items-center gap-2">
                                        <CheckCircle size={14} /> Verified Member
                                    </Badge>
                                    <Badge variant="info" className="py-1.5 px-4 flex items-center gap-2">
                                        IPFS Ready
                                    </Badge>
                                </div>
                                <div className="pt-4 flex flex-col gap-2 items-center text-xs font-mono text-slate-400">
                                    <span>CID: {profile.resumeCid?.substring(0, 20)}...</span>
                                    <span>TX: {profile.resumeHashTx?.substring(0, 20)}...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-md mx-auto">
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
                                    <Upload size={40} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Verify Your Profile</h2>
                                    <p className="text-slate-500 mt-2">Upload your resume to get the "Verified" badge and unlock access to matching job listings.</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="w-full cursor-pointer">
                                        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
                                        <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center">
                                            {file ? (
                                                <span className="text-indigo-600 font-medium">{file.name}</span>
                                            ) : (
                                                <span className="text-slate-400">Click to select PDF resume</span>
                                            )}
                                        </div>
                                    </label>
                                    <Button onClick={handleUpload} disabled={!file || loading} loading={loading} className="mt-6 w-full h-12">
                                        Upload & Secure on Blockchain
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="flex flex-col">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-indigo-500" /> Stats Overview
                        </h3>
                        <div className="space-y-4 flex-1">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Matches</p>
                                <p className="text-2xl font-bold text-slate-800">{profile?.verified ? jobs.length : '0'}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applications</p>
                                <p className="text-2xl font-bold text-indigo-600">{appliedJobs.length}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <Briefcase className="text-indigo-500" /> Recommended Jobs
                        </h2>
                        <p className="text-slate-500 mt-1">Based on your verified skills and resume analysis.</p>
                    </div>
                </div>

                {!profile?.verified ? (
                    <Card className="py-20 text-center bg-slate-50/50 border-dashed border-2">
                        <ShieldCheck size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700">Verification Required</h3>
                        <p className="text-slate-500 mt-2">Unlock these opportunities by completing your profile verification above.</p>
                    </Card>
                ) : jobs.length === 0 ? (
                    <Card className="py-20 text-center">
                        <Search size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700">No matches found yet</h3>
                        <p className="text-slate-500 mt-2">We'll notify you when new jobs match your verified profile.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.map(job => (
                            <Card key={job.id} className="hover:border-indigo-200 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Briefcase size={24} />
                                    </div>
                                    {appliedJobs.includes(job.id) ? (
                                        <Badge variant="success">Applied</Badge>
                                    ) : (
                                        <Button onClick={() => handleApply(job.id)} variant="outline" className="text-xs py-1 h-auto">
                                            Apply Now
                                        </Button>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                                <p className="text-slate-500 mt-2 line-clamp-2 text-sm leading-relaxed">{job.description}</p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {job.requiredSkills?.map(skill => (
                                        <Badge key={skill} variant="info">{skill}</Badge>
                                    ))}
                                    <Badge variant="success" className="ml-auto flex items-center gap-1">
                                        <CheckCircle size={10} /> Verified
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardCandidate;
