/**
 * GuestNavbar Component
 * UPDATED: Converted from College Complaint System to StuFix
 * UPDATED: Changed logo to StuFix logo
 * UPDATED: Updated brand name to "StuFix"
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Updated navigation paths for complaint system
 * UPDATED: Improved mobile menu animation
 * UPDATED: Added smooth transitions and hover effects
 * 
 * @description Navigation bar for unauthenticated users (guests) of StuFix complaint system
 * @version 3.0.0 (StuFix branding)
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ClipboardList, Info, Phone } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const GuestNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/landingpage' || location.pathname === '/' || location.pathname === '/home';
  const isLoginPage = location.pathname.includes("login");
  const isSignupPage = location.pathname.includes("signup");
  const isAboutPage = location.pathname.includes("about");
  const isContactPage = location.pathname.includes("contact");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  const navClasses = `
    fixed top-0 left-0 w-full flex items-center justify-between
    px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out z-50
    ${isScrolled ? "bg-white/90 shadow-md backdrop-blur-lg py-3" : "bg-gradient-to-r from-purple-50 to-indigo-50 py-5"}
  `;

  const renderButtons = () => {
    if (isHomePage) {
      return (
        <>
          <button 
            onClick={() => navigate('/login')} 
            className="text-gray-700 font-semibold hover:text-purple-600 transition-colors duration-300"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Sign Up
          </button>
        </>
      );
    }
    if (isLoginPage) {
      return (
        <button 
          onClick={() => navigate('/signup')} 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Create New Account
        </button>
      );
    }
    if (isSignupPage) {
      return (
        <button 
          onClick={() => navigate('/login')} 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Already have an account? Login
        </button>
      );
    }
    return null;
  };

  return (
    <nav className={navClasses}>
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link to='/' className="flex items-center gap-2 font-bold text-2xl group">
          <img 
  src="/src/assets/stufix-logo.svg" 
  alt="StuFix Logo" 
  className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-300"
/>
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            StuFix
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium">
            Contact
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-6">
          {renderButtons()}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-gray-800 p-2 hover:bg-purple-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`
        fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-purple-50 to-indigo-100
        flex flex-col items-center justify-center gap-8
        transition-transform duration-500 ease-in-out z-40
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <button 
          className="absolute top-6 right-6 p-2 hover:bg-purple-200 rounded-full transition-colors" 
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-7 w-7 text-gray-700" />
        </button>

        {/* Mobile Logo */}
        <div className="flex items-center gap-2 mb-4">
          <img 
            src="/stufix-logo.svg" 
            alt="StuFix Logo" 
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            StuFix
          </span>
        </div>

        <div className="flex flex-col gap-8 text-center">
          {/* Mobile Navigation Links */}
          <Link 
            to="/" 
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors"
          >
            Contact
          </Link>

          <div className="h-px bg-gray-300 w-48 mx-auto my-4"></div>

          {/* Mobile Action Buttons */}
          {isHomePage && (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Sign Up
              </button>
            </>
          )}
          {isLoginPage && (
            <button 
              onClick={() => navigate('/signup')} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Create New Account
            </button>
          )}
          {isSignupPage && (
            <button 
              onClick={() => navigate('/login')} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Already have an account? Login
            </button>
          )}
        </div>

        {/* Mobile Footer Info */}
        <div className="absolute bottom-8 text-center text-sm text-gray-500">
          <p className="text-purple-600 font-semibold">StuFix - Student Complaint System</p>
          <p className="text-xs mt-1">Available Departments:</p>
          <p className="text-xs">Network | Cleaning | Carpentry | PC Maintenance | Plumbing | Electricity</p>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavbar;