import { useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 4000, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-indigo-600';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-bounce`}>
      <span className="text-xl font-bold">{icon}</span>
      <p className="font-semibold">{message}</p>
    </div>
  );
};

export default Toast;
