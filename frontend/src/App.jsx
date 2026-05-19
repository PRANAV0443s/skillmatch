import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import DashboardCandidate from './components/DashboardCandidate';
import DashboardEmployer from './components/DashboardEmployer';

const App = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 transition-colors">
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
