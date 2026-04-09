/**
 * HomeCallToAction Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Changed messaging to focus on college issues
 * UPDATED: Updated color scheme to purple/indigo theme
 * UPDATED: Changed button text to "Submit a Complaint"
 * UPDATED: Updated navigation to login page
 * 
 * @description Call to action section for the landing page encouraging users to submit complaints
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRight, Building2 } from 'lucide-react';

export default function HomeCallToAction() {
    const navigate = useNavigate();

    return (
        <section className="py-16 md:py-20 bg-gradient-to-r from-purple-700 to-indigo-700 text-white overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="container mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <Building2 className="h-5 w-5" />
                    <span className="text-sm font-medium">College Complaint System</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Ready to Submit a Complaint?
                </h2>
                
                <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Your voice matters! Report issues related to network, cleaning, maintenance, 
                    and facilities. Help us make our campus better for everyone.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="group w-full sm:w-auto bg-white text-purple-700 font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    >
                        <ClipboardList className="h-5 w-5" />
                        Submit a Complaint
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/10 transition-all duration-300"
                    >
                        Create New Account
                    </button>
                </div>
                
                <p className="text-sm text-purple-200 mt-8">
                    ⚡ Quick resolution • 🔒 Secure & Confidential • 📱 Track your complaint
                </p>
            </div>
        </section>
    );
}