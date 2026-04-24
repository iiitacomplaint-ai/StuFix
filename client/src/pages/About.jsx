import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Target, 
  Users, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle,
  Award,
  Heart,
  Globe,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: "5000+", label: "Complaints Resolved", icon: <CheckCircle className="h-6 w-6" /> },
    { value: "98%", label: "Resolution Rate", icon: <Award className="h-6 w-6" /> },
    { value: "24/7", label: "Support Available", icon: <Clock className="h-6 w-6" /> },
    { value: "100%", label: "Student Satisfaction", icon: <Heart className="h-6 w-6" /> }
  ];

  const teamValues = [
    {
      title: "Transparency",
      description: "Complete visibility into complaint status and resolution process",
      icon: <Globe className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Efficiency",
      description: "Quick response and resolution within 48 hours",
      icon: <Clock className="h-8 w-8" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Accountability",
      description: "Dedicated teams ensuring every complaint is addressed",
      icon: <Shield className="h-8 w-8" />,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Student First",
      description: "Prioritizing student welfare and campus improvement",
      icon: <Users className="h-8 w-8" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  const milestones = [
    { year: "2024", title: "Platform Launch", description: "Launched the digital complaint system for IIIT Allahabad" },
    { year: "2024", title: "5000+ Complaints", description: "Successfully resolved over 5000 student complaints" },
    { year: "2024", title: "24/7 Support", description: "Introduced round-the-clock support system" },
    { year: "2025", title: "AI Integration", description: "Smart complaint categorization and routing" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-blue-50/30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: 'blob 7s infinite' }}></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: 'blob 7s infinite', animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: 'blob 7s infinite', animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-semibold">IIIT Allahabad</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              About Our Platform
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Empowering students to voice their concerns and improve campus life through 
              transparent and efficient complaint management.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full text-purple-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl text-white mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To provide a seamless, transparent, and efficient complaint management system 
                that empowers students to report issues and ensures timely resolution by 
                dedicated campus departments.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white mb-6">
                <Eye className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To create a campus where every student's voice is heard, every complaint is 
                addressed, and continuous improvement becomes part of our institutional culture.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="relative z-10 py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide our commitment to student welfare
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamValues.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${value.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key milestones in our mission to improve campus life
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{milestone.year}</div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">{milestone.title}</div>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
                {index < milestones.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative z-10 py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <a href="mailto:support@iiita.ac.in" className="text-gray-300 hover:text-white transition">
                support@iiita.ac.in
              </a>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <a href="tel:+915322921400" className="text-gray-300 hover:text-white transition">
                +91-532-292-1400
              </a>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-300">
                IIIT Allahabad,<br />
                Devghat, Jhalwa,<br />
                Prayagraj, UP - 211015
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <MessageCircle className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <ExternalLink className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <Globe className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              © 2024 IIIT Allahabad. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default About;