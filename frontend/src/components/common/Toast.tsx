import { FC, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

export const Toast: FC<ToastProps> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />,
    error: <AlertCircle className="text-red-400 shrink-0" size={18} />,
    info: <Info className="text-amber-400 shrink-0" size={18} />,
  };

  const borders = {
    success: 'border-emerald-600/50 bg-stone-900/95 text-emerald-200',
    error: 'border-red-600/50 bg-stone-900/95 text-red-200',
    info: 'border-amber-600/50 bg-stone-900/95 text-amber-200',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md text-sm font-medium animate-bounce-short max-w-sm ${borders[type]}`}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-200"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};
