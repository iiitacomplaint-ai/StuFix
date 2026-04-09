/**
 * AlertBox Component
 * UPDATED: Added close button and improved animation
 * UPDATED: Enhanced icon styling and responsiveness
 * UPDATED: Added manual close functionality
 * 
 * @description A reusable alert/notification component that automatically dismisses after 3 seconds
 * @version 2.0.0 (Updated)
 */

import { useEffect } from "react";

const ICONS = {
  success: <span>✅</span>,
  error: <span>❌</span>,
  warning: <span>⚠️</span>,
};

/**
 * AlertBox Component
 * UPDATED: Added onClose button and manual dismiss option
 * @param {Object} props - Component props
 * @param {string} props.type - Alert type: 'success', 'error', or 'warning'
 * @param {string} props.title - Alert title text
 * @param {string} props.description - Optional alert description text
 * @param {Function} props.onClose - Callback function to close the alert
 */
const AlertBox = ({ type = "success", title, description, onClose }) => {
  useEffect(() => {
    if (!onClose) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`bg-white p-4 rounded shadow border-l-4 ${
      type === 'success' ? 'border-green-500' : 
      type === 'error' ? 'border-red-500' : 'border-yellow-500'
    } fixed top-5 right-5 z-50 min-w-[300px] animate-fade-in`}>
      <div className="flex items-start space-x-3">
        <div className="text-xl">{ICONS[type]}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        {/* UPDATED: Added close button for manual dismissal */}
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBox;