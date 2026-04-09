/**
 * UserNavbar Component
 * UPDATED: Converted from CitizenNavbar to UserNavbar for complaint system
 * UPDATED: Removed verification status checks (not needed in complaint system)
 * UPDATED: Updated navigation links for complaint management
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Updated dashboard route to /user/dashboard
 * UPDATED: Removed police/crime reporting references
 * UPDATED: Added complaint-specific navigation items
 * 
 * @description Navigation bar for regular users (students/staff) of the College Complaint Management System
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Building2, ClipboardList, LayoutDashboard, FileText, History, LogOut, User, Home, Info, Phone } from 'lucide-react';

const UserNavbar = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
        { name: 'My Complaints', path: '/user/complaints', icon: ClipboardList },
        { name: 'New Complaint', path: '/user/new-complaint', icon: FileText },
        { name: 'History', path: '/user/history', icon: History },
        { name: 'About', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: Phone }
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const getUserName = () => {
        if (user?.name) {
            return user.name.split(' ')[0]; // Return first name only
        }
        return 'User';
    };

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 lg:px-16 xl:px-24 transition-all duration-300 z-50 ${
            isScrolled 
                ? "bg-white/90 shadow-lg backdrop-blur-lg py-3" 
                : "bg-gradient-to-r from-purple-700 to-indigo-700 py-5"
        }`}>
            
            {/* Logo */}
            <div 
                onClick={() => navigate('/user/dashboard')}
                className="flex items-center gap-2 font-bold text-xl md:text-2xl group cursor-pointer"
            >
                <Building2 className={`h-7 w-7 md:h-8 md:w-8 transition-all duration-300 ${
                    isScrolled ? "text-purple-600" : "text-white"
                } group-hover:scale-110`} />
                <span className={`transition-colors duration-300 ${
                    isScrolled ? "bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent" : "text-white"
                }`}>
                    College Complaint
                </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
                {navLinks.map((link, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(link.path)}
                        className={`group flex flex-col gap-0.5 focus:outline-none transition-colors duration-300 ${
                            isScrolled ? "text-gray-700 hover:text-purple-600" : "text-white/90 hover:text-white"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <link.icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{link.name}</span>
                        </div>
                        <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${
                            isScrolled ? "bg-purple-600" : "bg-white"
                        }`} />
                    </button>
                ))}
            </div>

            {/* Desktop Right - User Info & Logout */}
            <div className="hidden md:flex items-center gap-4">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                    isScrolled ? "bg-gray-100" : "bg-white/10 backdrop-blur-sm"
                }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isScrolled ? "bg-purple-100" : "bg-white/20"
                    }`}>
                        <User className={`h-4 w-4 ${isScrolled ? "text-purple-600" : "text-white"}`} />
                    </div>
                    <div className="hidden lg:block">
                        <p className={`text-sm font-medium ${isScrolled ? "text-gray-800" : "text-white"}`}>
                            {getUserName()}
                        </p>
                        <p className={`text-xs ${isScrolled ? "text-gray-500" : "text-white/70"}`}>
                            Student
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                        isScrolled 
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                            : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                    }`}
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-2 rounded-lg transition-colors ${
                        isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                    }`}
                    aria-label="Menu"
                >
                    <svg className={`h-6 w-6 ${isScrolled ? "text-gray-700" : "text-white"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Panel */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-transform duration-500 ease-in-out z-50 ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <button 
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors" 
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Mobile Logo */}
                <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-7 w-7 text-purple-600" />
                        <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            College Complaint
                        </span>
                    </div>
                </div>

                {/* Mobile User Info */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{user?.email || 'student@college.edu'}</p>
                    </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    {navLinks.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                navigate(link.path);
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                        >
                            <link.icon className="h-5 w-5" />
                            <span className="text-base">{link.name}</span>
                        </button>
                    ))}
                </div>

                <div className="h-px w-48 bg-gray-200 my-4"></div>

                {/* Mobile Logout */}
                <button
                    onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 w-full max-w-xs"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default UserNavbar;