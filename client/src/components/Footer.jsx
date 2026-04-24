/**
 * Footer Component - College Complaint System
 * UPDATED: Clean and simple footer for complaint system
 * UPDATED: Added proper role-based dashboard links
 * UPDATED: Improved responsive design
 * UPDATED: Added social media placeholder links
 * UPDATED: IIIT Allahabad branding and department links
 * 
 * @description Simple footer with essential links for complaint system
 * @version 3.0.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Github, Twitter, Mail, Phone, MapPin, GraduationCap, Wifi, Droplets, Zap, Hammer, Cpu, Brush } from 'lucide-react';
import PrivacyPrompt from './PrivacyPrompt';

const Footer = () => {
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const navigate = useNavigate();
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
    const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : 
                         userRole === 'worker' ? '/worker/dashboard' : '/user/dashboard';

    const departments = [
        { name: "Network", icon: <Wifi className="h-3 w-3" />, color: "text-blue-400" },
        { name: "Cleaning", icon: <Brush className="h-3 w-3" />, color: "text-green-400" },
        { name: "Carpentry", icon: <Hammer className="h-3 w-3" />, color: "text-amber-400" },
        { name: "PC Maintenance", icon: <Cpu className="h-3 w-3" />, color: "text-purple-400" },
        { name: "Plumbing", icon: <Droplets className="h-3 w-3" />, color: "text-cyan-400" },
        { name: "Electricity", icon: <Zap className="h-3 w-3" />, color: "text-red-400" }
    ];

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
                                <GraduationCap className="h-7 w-7 text-purple-500" />
                                <div>
                                    <span className="font-bold text-xl text-white">IIIT Allahabad</span>
                                    <p className="text-xs text-gray-500">Student Complaint System</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                A comprehensive platform for students to report campus-related issues 
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

                        {/* Departments */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Departments</h3>
                            <ul className="space-y-2 text-sm">
                                {departments.map((dept, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className={dept.color}>{dept.icon}</span>
                                        <span className="text-gray-400">{dept.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-b border-gray-800">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-purple-500" />
                            <span>support@iiita.ac.in</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-purple-500" />
                            <span>+91-532-292-1400</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-purple-500" />
                            <span>IIIT Allahabad, Devghat, Jhalwa, Prayagraj - 211015</span>
                        </div>
                    </div>

                    {/* Bottom Text */}
                    <div className="text-center pt-6">
                        <p className="text-xs text-gray-500">
                            © {currentYear} IIIT Allahabad Student Complaint System. All rights reserved.
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