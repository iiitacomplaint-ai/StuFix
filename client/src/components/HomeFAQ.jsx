/**
 * HomeFAQ Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: FAQ questions and answers for college complaints
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Updated platform description for complaint management
 * 
 * @description FAQ section for the landing page addressing common questions about the complaint system
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FaqItem = ({ question, answer, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-200 py-5 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center text-left text-base md:text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-200"
                aria-expanded={isOpen}
            >
                <span className="pr-4">{question}</span>
                <ChevronDown className={`flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-600' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-3">
                    <p className="text-gray-600 leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
};

export default function HomeFAQ() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            q: "What is the College Complaint Management System?",
            a: "The College Complaint Management System is a digital platform that allows students and staff to report issues related to college facilities including network problems, cleaning, carpentry, PC maintenance, plumbing, and electricity. It streamlines the complaint resolution process by automatically routing issues to the appropriate department at IIIT Allahabad."
        },
        {
            q: "How do I submit a complaint?",
            a: "Simply create an account or log in, then click on 'Submit Complaint'. Fill in the details including title, description, category, and priority. You can also upload images or videos as evidence. Your complaint will be assigned to the relevant department worker for quick resolution."
        },
        {
            q: "Can I track the status of my complaint?",
            a: "Yes! Once logged in, you can view all your complaints on your dashboard. Each complaint shows its current status (Submitted, Assigned, In Progress, Resolved, Closed, Escalated, or Withdrawn) and you can see the complete history of status changes with timestamps."
        },
        {
            q: "What types of complaints can I file?",
            a: "You can file complaints in six categories: Network (WiFi, internet issues), Cleaning (garbage, hygiene), Carpentry (furniture repair), PC Maintenance (computer/lab issues), Plumbing (water leakage, taps), and Electricity (lights, fans, power issues)."
        },
        {
            q: "How are complaints assigned to workers?",
            a: "An admin reviews submitted complaints and assigns them to workers based on their department. For example, network issues go to Network department workers, plumbing issues to Plumbing workers, ensuring quick and efficient resolution by the right specialist."
        },
        {
            q: "Can I cancel a complaint after submitting?",
            a: "Yes, you can withdraw a complaint if its status is 'Submitted' or 'Assigned' (before work begins). Simply click the 'Withdraw' button and provide a reason. Once withdrawn, you can also reopen it later if needed."
        },
        {
            q: "How will I know when my complaint is resolved?",
            a: "You will receive real-time updates through the platform. The status will change to 'Resolved' when the worker has fixed the issue. You can also view worker remarks, add comments, and see the complete timeline of your complaint from submission to resolution."
        },
        {
            q: "What happens if my complaint is not resolved satisfactorily?",
            a: "If you're not satisfied with the resolution, you can reopen a resolved complaint. It will be sent back to 'In Progress' status for further attention. For critical issues, admins can also escalate complaints to higher authorities for priority handling."
        },
        {
            q: "Is my personal information secure?",
            a: "Absolutely. Your personal details are protected and only visible to authorized admins and workers assigned to your complaint. We follow strict data protection protocols and industry-standard encryption to ensure your privacy and security."
        },
        {
            q: "Can I upload evidence with my complaint?",
            a: "Yes, you can upload images, videos, or PDF documents as evidence when submitting a complaint. This helps workers better understand the issue and resolve it faster. You can upload up to 3 files per complaint, each up to 10MB."
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
                        <HelpCircle className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">FAQ</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
                        Everything you need to know about submitting and tracking complaints at IIIT Allahabad
                    </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
                    {faqData.map((item, index) => (
                        <FaqItem 
                            key={index} 
                            question={item.q} 
                            answer={item.a} 
                            isOpen={openIndex === index}
                            onToggle={() => toggleFaq(index)}
                        />
                    ))}
                </div>
                
                {/* Still Have Questions Section */}
                <div className="mt-10 text-center bg-purple-50 rounded-xl p-6">
                    <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">
                        Still have questions?
                    </p>
                    <p className="text-gray-600 text-sm mt-1 mb-4">
                        Our support team is here to help you
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                            onClick={() => navigate('/contact')}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Contact Support
                        </button>
                        <button 
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                            Submit a Complaint
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}