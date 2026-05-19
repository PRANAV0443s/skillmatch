import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[var(--card-glass)] border-t border-[var(--border-glass)] backdrop-blur-md mt-auto transition-colors">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} SkillMatch. All rights reserved.
                        </span>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
