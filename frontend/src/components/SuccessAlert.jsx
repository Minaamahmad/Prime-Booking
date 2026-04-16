import '../styles/SuccessAlert.css';

const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="success-alert">
      <div className="success-content">
        <span className="success-icon">✓</span>
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="success-close">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessAlert;
