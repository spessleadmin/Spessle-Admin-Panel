import React from 'react';

const SuccessMessage = ({ message, show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
      <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className="me-auto">Success</strong>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;