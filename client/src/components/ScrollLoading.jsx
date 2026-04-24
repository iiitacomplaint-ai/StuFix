// components/ScrollLoading.jsx
import React, { useState, useEffect } from 'react';

const ScrollLoading = ({ message = "Loading..." }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile version - Single spinner
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3 min-w-[160px]">
          {/* Single spinner for mobile */}
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          {/* Loading text */}
          <div className="text-center">
            <p className="text-gray-700 font-medium text-sm">{message}</p>
            <div className="flex justify-center gap-1 mt-2">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version - Multiple intersecting circles
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative">
        {/* Outer ring animation */}
        <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping opacity-75"></div>
        
        {/* Main spinner container */}
        <div className="relative bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[220px]">
          {/* Three intersecting circles for desktop */}
          <div className="relative w-20 h-20">
            {/* Circle 1 - Top right */}
            <div className="absolute top-0 right-0 w-12 h-12 border-4 border-purple-500 rounded-full animate-spin-slow" style={{ animationDirection: 'normal' }}></div>
            
            {/* Circle 2 - Bottom left */}
            <div className="absolute bottom-0 left-0 w-12 h-12 border-4 border-indigo-500 rounded-full animate-spin-reverse" style={{ animationDirection: 'reverse' }}></div>
            
            {/* Circle 3 - Center */}
            <div className="absolute top-4 left-4 w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          {/* Loading text with dots animation */}
          <div className="text-center">
            <p className="text-gray-700 font-medium">{message}</p>
            <div className="flex justify-center gap-1 mt-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollLoading;