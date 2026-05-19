import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
            
            <div className="prose prose-blue max-w-none text-gray-700">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">1. Information We Collect</h2>
                <p className="mb-4">
                    We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, resume, and other information you choose to provide.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2. How We Use Your Information</h2>
                <div className="mb-4">
                    We may use the information we collect about you to:
                    <ul className="list-disc pl-6 mt-2">
                        <li>Provide, maintain, and improve our Services.</li>
                        <li>Verify credentials through our blockchain network.</li>
                        <li>Send you technical notices, updates, security alerts and support messages.</li>
                        <li>Respond to your comments, questions and requests.</li>
                    </ul>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3. Blockchain and IPFS Data</h2>
                <p className="mb-4">
                    Due to the nature of blockchain technology and IPFS (InterPlanetary File System), data published to the network is immutable and public. While we only store cryptographic hashes and essential verification data on-chain, you should be aware that this data cannot be deleted once published.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">4. Sharing of Information</h2>
                <p className="mb-4">
                    We do not share your personal information with third parties except as described in this privacy policy, such as with potential employers when you actively apply for a job or make your profile public.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">5. Security</h2>
                <p className="mb-4">
                    We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">6. Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about this Privacy Policy, please contact us at skillmatchofficiall@gmail.com.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
