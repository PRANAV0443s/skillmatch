import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} SkillMatch. All rights reserved.
                        </span>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link to="/terms" className="hover:text-blue-600 transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
