/**
 * HomeTestimonial Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Removed testimonials - kept as placeholder
 * UPDATED: Added IIIT Allahabad branding
 * 
 * @description Testimonial section for the landing page (placeholder for future testimonials)
 * @version 2.0.0 (Placeholder for college complaint system)
 */

import React from 'react';
import { GraduationCap, MessageCircle, Star, Users } from 'lucide-react';

export default function HomeTestimonial() {
    return (
        <section id="testimonials" className="py-16 md:py-20 relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-200 rounded-full opacity-30 mix-blend-multiply filter blur-xl" style={{ animation: 'blob 7s infinite' }}></div>
                <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-30 mix-blend-multiply filter blur-xl" style={{ animation: 'blob 7s infinite', animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-100 rounded-full opacity-20 mix-blend-multiply filter blur-2xl -translate-x-1/2 -translate-y-1/2" style={{ animation: 'blob 7s infinite', animationDelay: '4s' }}></div>
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
                        <MessageCircle className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Student Voices</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        What Students Say
                    </h2>
                    <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
                        Real experiences from students using our complaint management system
                    </p>
                </div>

                {/* Placeholder content - testimonials coming soon */}
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="text-center max-w-md mx-auto bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-100">
                        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="h-10 w-10 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Student Testimonials Coming Soon</h3>
                        <p className="text-gray-600">
                            We're collecting feedback from students who have used our complaint system. 
                            Their experiences will be shared here shortly.
                        </p>
                        <div className="mt-6 flex justify-center gap-2">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <Star className="h-5 w-5 text-gray-300" />
                        </div>
                    </div>
                </div>

                {/* Stats row - alternative content */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-purple-600">5000+</div>
                        <div className="text-gray-600 text-sm mt-1">Complaints Resolved</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-purple-600">98%</div>
                        <div className="text-gray-600 text-sm mt-1">Resolution Rate</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-purple-600">24h</div>
                        <div className="text-gray-600 text-sm mt-1">Avg Response Time</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-purple-600">6</div>
                        <div className="text-gray-600 text-sm mt-1">Departments</div>
                    </div>
                </div>
            </div>

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