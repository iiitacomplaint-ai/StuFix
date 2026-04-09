/**
 * Footer Component - Simplified Version
 * UPDATED: Clean and simple footer for complaint system
 * UPDATED: Added proper role-based dashboard links
 * UPDATED: Improved responsive design
 * UPDATED: Added social media placeholder links
 * 
 * @description Simple footer with essential links for complaint system
 * @version 2.0.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Github, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import PrivacyPrompt from './PrivacyPrompt';

const Footer = () => {
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const currentYear = new Date().getFullYear();

    // Get user role from localStorage for dynamic dashboard link
    const getUserRole = () => {
        try {
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                return userData?.role || 'user';
            }
        } catch (e) {
            return 'user';
        }
        return 'user';
    };

    const userRole = getUserRole();
    const dashboardPath = `/${userRole}/dashboard`;

    return (
        <>
            <PrivacyPrompt
                isVisible={isPromptVisible}
                onClose={() => setIsPromptVisible(false)}
            />

            <footer className="bg-gray-900 text-gray-400 px-6 md:px-16 lg:px-24 py-8 mt-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
                        
                        {/* Logo & Description */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="h-7 w-7 text-purple-500" />
                                <span className="font-bold text-xl text-white">College Complaint System</span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                A comprehensive platform for students and staff to report college-related issues 
                                including network problems, cleaning, maintenance, and facility concerns. 
                                Get quick resolutions from dedicated department teams.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
                                    <Github className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link to="/" className="hover:text-purple-400 transition">Home</Link>
                                </li>
                                <li>
                                    <Link to={dashboardPath} className="hover:text-purple-400 transition">Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/about" className="hover:text-purple-400 transition">About Us</Link>
                                </li>
                                <li>
                                    <button onClick={() => setIsPromptVisible(true)} className="hover:text-purple-400 transition">
                                        Privacy Policy
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link to="/faq" className="hover:text-purple-400 transition">FAQ</Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="hover:text-purple-400 transition">Contact Us</Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="hover:text-purple-400 transition">Terms of Service</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-b border-gray-800">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-purple-500" />
                            <span>support@collegecomplaint.edu</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-purple-500" />
                            <span>+91 12345 67890</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-purple-500" />
                            <span>College Campus, Main Road, City - 123456</span>
                        </div>
                    </div>

                    {/* Bottom Text */}
                    <div className="text-center pt-6">
                        <p className="text-xs text-gray-500">
                            © {currentYear} College Complaint Management System. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            Available Departments: Network | Cleaning | Carpentry | PC Maintenance | Plumbing | Electricity
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            Empowering efficient complaint resolution in educational institutions
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;