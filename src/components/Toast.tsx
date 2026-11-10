import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg transition-all duration-300 pointer-events-none animate-in fade-in slide-in-from-top-2">
      {message}
    </div>
  );
};
