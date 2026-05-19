import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import DashboardCandidate from './components/DashboardCandidate';
import DashboardEmployer from './components/DashboardEmployer';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import Footer from './components/Footer';
import Contact from './components/Contact';

const App = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 transition-colors flex flex-col">
                <Navbar />
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/candidate" element={<DashboardCandidate />} />
                        <Route path="/employer" element={<DashboardEmployer />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default App;
