import React from 'react';

const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Terms of Service</h1>
            
            <div className="prose prose-blue max-w-none text-gray-700">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">1. Acceptance of Terms</h2>
                <p className="mb-4">
                    By accessing and using SkillMatch, you accept and agree to be bound by the terms and provision of this agreement.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2. Description of Service</h2>
                <p className="mb-4">
                    SkillMatch provides a blockchain-based job portal for candidates and employers. We utilize Web3 technologies to verify candidate credentials and maintain a transparent hiring ecosystem.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3. User Obligations</h2>
                <p className="mb-4">
                    Users must provide accurate information. For candidates, this means uploading authentic resumes. The platform reserves the right to terminate accounts that provide false or misleading information.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">4. Blockchain Verification</h2>
                <p className="mb-4">
                    By using our service, you acknowledge that certain data (such as educational and professional credentials) may be cryptographically hashed and stored on a public or private blockchain for verification purposes.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">5. Limitation of Liability</h2>
                <p className="mb-4">
                    SkillMatch shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">6. Changes to Terms</h2>
                <p className="mb-4">
                    We reserve the right to modify these terms at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;
