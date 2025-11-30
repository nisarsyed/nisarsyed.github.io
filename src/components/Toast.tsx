import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const borderColor = 
    toast.type === 'success' ? 'border-success' :
    toast.type === 'error' ? 'border-red-500' :
    toast.type === 'warning' ? 'border-primary' : 'border-secondary';

  const icon = 
    toast.type === 'success' ? '✓' :
    toast.type === 'error' ? '✕' :
    toast.type === 'warning' ? '⚠' : 'ℹ';

  return (
    <div className={`pointer-events-auto min-w-[300px] bg-panel/90 backdrop-blur-md border-l-4 ${borderColor} border-y border-r border-border p-4 shadow-xl animate-fade-in relative overflow-hidden group`}>
      <div className="flex items-start gap-3">
        <span className={`font-mono font-bold ${toast.type === 'success' ? 'text-success' : toast.type === 'error' ? 'text-red-500' : 'text-primary'}`}>
            [{icon}]
        </span>
        <div>
            <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider">{toast.title}</h4>
            <p className="font-sans text-sm text-zinc-400 mt-1">{toast.message}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onRemove} className="text-zinc-600 hover:text-white">✕</button>
      </div>
    </div>
  );
};