// frontend/src/components/common/Modal.jsx

import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-lg p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl transition-all transform scale-100 dark:text-white">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-gray-700 pb-3">
          <h3 className="text-2xl font-bold text-purple-500 dark:text-purple-400">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-3xl font-light leading-none"
          >
            &times;
          </button>
        </div>
        
        {/* Modal Body */}
        {children}
      </div>
    </div>
  );
};

export default Modal;