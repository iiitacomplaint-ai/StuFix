/**
 * ConfirmationModal Component
 * UPDATED: Renamed from ConfirmationModel to ConfirmationModal (fixed typo)
 * UPDATED: Added more flexible button configurations
 * UPDATED: Added loading state support
 * UPDATED: Added different action types (delete, cancel, assign, status)
 * UPDATED: Improved styling with better responsiveness
 * UPDATED: Added icon support for different action types
 * UPDATED: Added dynamic button colors based on action type
 * 
 * @description Reusable confirmation modal for various actions (delete, cancel, assign, status updates)
 * @version 2.0.0 (Enhanced with more features)
 */

import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger', 'warning', 'info', 'success'
  isLoading = false,
  icon = null
}) => {
  if (!isOpen) return null;

  // Configuration based on action type
  const typeConfig = {
    danger: {
      buttonClass: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
      icon: "⚠️",
      defaultTitle: "Confirm Deletion"
    },
    warning: {
      buttonClass: "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500",
      icon: "⚠️",
      defaultTitle: "Confirm Action"
    },
    info: {
      buttonClass: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
      icon: "ℹ️",
      defaultTitle: "Confirm"
    },
    success: {
      buttonClass: "bg-green-500 hover:bg-green-600 focus:ring-green-500",
      icon: "✅",
      defaultTitle: "Confirm"
    }
  };

  const config = typeConfig[type] || typeConfig.danger;
  const displayTitle = title || config.defaultTitle;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all animate-scaleIn">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          {icon ? (
            <div className="text-2xl">{icon}</div>
          ) : (
            <div className="text-2xl">{config.icon}</div>
          )}
          <h3 className="text-lg font-bold text-gray-800">{displayTitle}</h3>
        </div>

        {/* Message Content */}
        <div className="mb-6">
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.buttonClass} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add CSS animations to your global CSS file
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ConfirmationModal;