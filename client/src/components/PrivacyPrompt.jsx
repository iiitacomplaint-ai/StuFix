/**
 * PrivacyPrompt Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Changed messaging for college complaint context
 * UPDATED: Updated color scheme to purple/indigo theme
 * UPDATED: Removed anonymous reporting (not applicable for college system)
 * 
 * @description A responsive privacy notice component that displays as a modal overlay
 * @version 2.0.0 (Updated for college complaint system)
 */

import React from 'react';

// Inline SVG for the ShieldCheck icon (from lucide-react)
const ShieldCheckIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

// Inline SVG for the X icon (from lucide-react)
const XIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// Inline SVG for the GraduationCap icon
const GraduationCapIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

/**
 * A responsive privacy notice component that displays as a modal overlay.
 * @param {object} props - The component props.
 * @param {boolean} props.isVisible - Controls the visibility of the prompt.
 * @param {function} props.onClose - Function to call when the prompt is dismissed.
 * @returns {JSX.Element|null} The rendered component or null if not visible.
 */
const PrivacyPrompt = ({ isVisible, onClose }) => {
    // If not visible, don't render anything
    if (!isVisible) {
        return null;
    }

    return (
        // The main container, acting as a modal overlay
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-heading"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        >
            {/* The modal content card */}
            <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-2xl shadow-2xl transform transition-all duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close privacy notice"
                    className="absolute top-4 right-4 text-gray-400 hover:text-purple-600 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                {/* Header Section */}
                <div className="flex items-center mb-4">
                    <div className="bg-purple-100 rounded-full p-2">
                        <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 id="privacy-heading" className="ml-3 text-2xl font-bold text-gray-800">
                        Your Privacy Matters
                    </h2>
                </div>

                {/* Body Content */}
                <div className="space-y-4 text-gray-600">
                    <p>
                        At IIIT Allahabad, your privacy is our priority. Your personal information is 
                        protected and only shared with authorized personnel responsible for handling 
                        your complaint.
                    </p>
                    <p>
                        Your data is 100% safe and secure. We strictly follow privacy-first practices 
                        and do not share your personal information with third parties. All complaint 
                        details are encrypted and accessible only to relevant department staff.
                    </p>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-2">
                            <GraduationCapIcon className="w-5 h-5 text-purple-600" />
                            <p className="text-sm text-purple-800 font-medium">
                                IIIT Allahabad Student Data Protection Policy
                            </p>
                        </div>
                        <p className="text-xs text-purple-600 mt-1">
                            Your data is used solely for complaint resolution and campus improvement purposes.
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPrompt;