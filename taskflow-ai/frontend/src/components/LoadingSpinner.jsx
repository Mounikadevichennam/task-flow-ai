import React from 'react';

const LoadingSpinner = ({ fullScreen = false, text = 'Loading TaskFlow AI...' }) => {
  if (fullScreen) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '100vh', background: 'var(--bg-main)' }}
      >
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold" style={{ fontSize: '0.95rem' }}>{text}</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-2 text-muted small">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
