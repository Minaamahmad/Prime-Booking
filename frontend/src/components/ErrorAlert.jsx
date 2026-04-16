import '../styles/ErrorAlert.css';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="error-close">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
