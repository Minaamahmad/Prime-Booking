const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="rounded-[2rem] border border-primary-coral/20 bg-primary-coral/10 p-4 text-sm text-primary-coral shadow-[0_10px_30px_-25px_rgba(248,113,113,0.7)] mb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">Oops</p>
          <p className="mt-1 text-slate-100">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl text-primary-coral/90 hover:text-primary-coral"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
