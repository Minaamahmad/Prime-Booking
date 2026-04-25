const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">Something went wrong</p>
          <p className="mt-1 text-red-700/90">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl font-bold text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
