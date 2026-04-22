const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
      <div className="flex items-center">
        <span className="text-xl mr-2">✓</span>
        <p className="flex-1">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mt-2 mr-2 text-green-700 hover:text-green-900 text-lg font-bold"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessAlert;
