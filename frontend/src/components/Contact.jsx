import React from 'react';

const Contact = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Contact Us</h1>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:px-6 bg-blue-50">
                    <h3 className="text-lg leading-6 font-medium text-blue-900">Get in Touch</h3>
                    <p className="mt-1 max-w-2xl text-sm text-blue-700">
                        Have questions about SkillMatch? Reach out to us using the details below.
                    </p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Founder & Developer</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Pranav Pathak</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <a href="mailto:pathakpranav79@gmail.com" className="text-blue-600 hover:text-blue-500 font-medium">
                                    pathakpranav79@gmail.com
                                </a>
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <a href="tel:+919960244272" className="text-blue-600 hover:text-blue-500 font-medium">
                                    +91 9960244272
                                </a>
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">LinkedIn Profile</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <a 
                                    href="https://www.linkedin.com/posts/%E1%B4%98%CA%80%E1%B4%80%C9%B4%E1%B4%80%E1%B4%A0-%E1%B4%98%E1%B4%80%E1%B4%9B%CA%9C%E1%B4%80%E1%B4%8B-2636b2322_hyperledgerfabric-blockchain-docker-ugcPost-7451672231404826624-0uay?utm_source=share&utm_medium=member_android&rcm=ACoAAFGd8esBCR25OrgSVFiLgNWslrCQCDouhdQ" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                    </svg>
                                    Connect with Pranav on LinkedIn
                                </a>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Contact;
