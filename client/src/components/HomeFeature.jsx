/**
 * HomeFeature Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Changed feature descriptions for complaint management
 * UPDATED: Updated color scheme to purple/indigo theme
 * UPDATED: Added complaint-specific features
 * UPDATED: Fixed styling and removed styled-jsx
 * 
 * @description Features section for the landing page showcasing complaint system capabilities
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React from 'react';
import { 
    ClipboardList, 
    Users, 
    Eye, 
    BarChart, 
    Bell, 
    ShieldCheck,
    Wrench,
    Plug,
    Droplets,
    Trash2,
    Cpu,
    Brush,
    GraduationCap
} from 'lucide-react';

const FeatureCard = ({ icon, title, description, color = "purple" }) => {
    const colorClasses = {
        purple: "bg-purple-100 text-purple-600",
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        orange: "bg-orange-100 text-orange-600",
        red: "bg-red-100 text-red-600",
        teal: "bg-teal-100 text-teal-600",
        cyan: "bg-cyan-100 text-cyan-600"
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center border border-gray-100 group">
            <div className={`${colorClasses[color]} p-4 rounded-full mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
};

export default function HomeFeature() {
    const featuresData = [
        { 
            icon: <ClipboardList size={32} />, 
            title: "Easy Complaint Filing", 
            description: "Submit complaints quickly with an intuitive form. Add title, description, category, priority, and upload evidence images, videos, or PDFs.",
            color: "purple"
        },
        { 
            icon: <Users size={32} />, 
            title: "Department-wise Assignment", 
            description: "Complaints are automatically routed to the right department - Network, Cleaning, Carpentry, PC Maintenance, Plumbing, or Electricity.",
            color: "blue"
        },
        { 
            icon: <Eye size={32} />, 
            title: "Real-Time Tracking", 
            description: "Track your complaint status at every stage - from submission to assignment, progress, resolution, and closure with complete history.",
            color: "green"
        },
        { 
            icon: <BarChart size={32} />, 
            title: "Admin Analytics Dashboard", 
            description: "Comprehensive analytics for admins to monitor complaint trends, department performance, worker efficiency, and resolution times.",
            color: "orange"
        },
        { 
            icon: <Bell size={32} />, 
            title: "Status Notifications", 
            description: "Receive real-time updates when your complaint status changes, when workers add remarks, or when resolution is completed.",
            color: "red"
        },
        { 
            icon: <ShieldCheck size={32} />, 
            title: "Secure & Confidential", 
            description: "Your personal information is protected. Only authorized admins and assigned workers can view your complaint details.",
            color: "teal"
        }
    ];

    // Department icons for additional visual appeal
    const departments = [
        { name: "Network", icon: <Plug size={20} />, color: "blue", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
        { name: "Cleaning", icon: <Trash2 size={20} />, color: "green", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
        { name: "Carpentry", icon: <Wrench size={20} />, color: "orange", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" },
        { name: "PC Maintenance", icon: <Cpu size={20} />, color: "purple", bgColor: "bg-purple-50", textColor: "text-purple-700", borderColor: "border-purple-200" },
        { name: "Plumbing", icon: <Droplets size={20} />, color: "cyan", bgColor: "bg-cyan-50", textColor: "text-cyan-700", borderColor: "border-cyan-200" },
        { name: "Electricity", icon: <Brush size={20} />, color: "red", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" }
    ];

    return (
        <section id="features" className="py-16 md:py-20 relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            {/* Background decorative elements with inline styles for animations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-200 rounded-full opacity-30 mix-blend-multiply filter blur-xl" style={{ animation: 'blob 7s infinite' }}></div>
                <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-30 mix-blend-multiply filter blur-xl" style={{ animation: 'blob 7s infinite', animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-100 rounded-full opacity-20 mix-blend-multiply filter blur-2xl -translate-x-1/2 -translate-y-1/2" style={{ animation: 'blob 7s infinite', animationDelay: '4s' }}></div>
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">IIIT Allahabad</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Smart Complaint Management System
                    </h2>
                    <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
                        Everything you need to submit, track, and resolve college complaints efficiently
                    </p>
                </div>

                {/* Department Tags */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {departments.map((dept, idx) => (
                        <div
                            key={idx}
                            className={`inline-flex items-center gap-2 px-4 py-2 ${dept.bgColor} ${dept.textColor} rounded-full text-sm font-medium border ${dept.borderColor}`}
                        >
                            {dept.icon}
                            {dept.name}
                        </div>
                    ))}
                </div>

                {/* Feature Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        ⚡ Quick resolution • 📊 Track progress • 🔔 Real-time updates • 🔒 Secure platform
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        Available 24/7 • Dedicated department teams • Complete transparency
                    </p>
                </div>
            </div>

            {/* Add keyframe animations to global styles - add this to your index.css or App.css */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
            `}</style>
        </section>
    );
}