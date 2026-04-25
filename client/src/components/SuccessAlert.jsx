const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="relative mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 shadow-md">
      <div className="flex items-center">
        <span className="mr-2 text-xl font-bold">✓</span>
        <p className="flex-1 font-semibold">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mr-2 mt-2 text-lg font-bold text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessAlert;
