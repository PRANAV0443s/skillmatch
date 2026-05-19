import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Input, Badge } from './ui';
import { PlusCircle, Briefcase, Users, FileText, CheckCircle, Search } from 'lucide-react';

const DashboardEmployer = () => {
    const [jobs, setJobs] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', requiredSkills: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    async function fetchJobs() {
        try {
            const res = await axios.get('http://localhost:8080/api/jobs', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            setJobs(res.data);
        } catch (error) { console.error(error); }
    }

    const handlePostJob = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const skillsArray = form.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== '');
            await axios.post('http://localhost:8080/api/jobs', { ...form, requiredSkills: skillsArray }, {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            fetchJobs();
            setForm({ title: '', description: '', requiredSkills: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 sm:p-10 space-y-10">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Employer Console</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Post new opportunities and manage your talent pool.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 h-fit">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <PlusCircle size={20} className="text-indigo-500" /> Post a Job
                    </h2>
                    <form onSubmit={handlePostJob} className="space-y-5">
                        <Input 
                            label="Job Title" 
                            placeholder="Software Engineer" 
                            value={form.title} 
                            onChange={(e)=>setForm({...form, title: e.target.value})} 
                            required 
                        />
                        <Input 
                            label="Required Skills (comma separated)" 
                            placeholder="Java, React, MongoDB" 
                            value={form.requiredSkills} 
                            onChange={(e)=>setForm({...form, requiredSkills: e.target.value})} 
                            required 
                        />
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Description</label>
                            <textarea 
                                placeholder="Describe the role, responsibilities, and requirements..." 
                                value={form.description} 
                                onChange={(e)=>setForm({...form, description: e.target.value})} 
                                className="w-full px-4 py-2.5 premium-card premium-input border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none min-h-[120px] resize-none bg-white dark:bg-slate-800"
                                required
                            ></textarea>
                        </div>
                        <Button type="submit" className="w-full h-12" loading={loading}>
                            Create Listing
                        </Button>
                    </form>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Briefcase size={20} className="text-indigo-500" /> Active Listings
                        </h2>
                        <Badge variant="info">{jobs.length} Jobs Total</Badge>
                    </div>

                    {jobs.length === 0 ? (
                        <Card className="py-20 text-center bg-slate-50/50 dark:bg-slate-800/30 border-dashed border-2 dark:border-slate-700">
                            <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 italic">No jobs posted yet. Start by creating your first listing.</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {jobs.map(job => (
                                <Card key={job.id} className="hover:border-indigo-100 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{job.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{job.description}</p>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                                            <Badge variant="success" className="flex items-center gap-1">
                                                <CheckCircle size={10} /> Active
                                            </Badge>
                                            <Button variant="ghost" className="text-xs p-1 h-auto text-indigo-600">
                                                View Applicants
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                                        <span className="flex items-center gap-1"><Users size={12} /> 0 Applicants</span>
                                        <span className="flex items-center gap-1"><FileText size={12} /> Verified Profiles Only</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardEmployer;

