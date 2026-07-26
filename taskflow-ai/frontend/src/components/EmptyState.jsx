import React from 'react';

const EmptyState = ({
  icon: Icon,
  title = 'No Data Available',
  message = 'Get started by creating your first entry.',
  actionText,
  onAction,
  badgeText
}) => {
  return (
    <div className="tf-card text-center py-5 px-4 animate-fade-in my-3">
      <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary p-4 rounded-circle mb-3 shadow-sm">
        {Icon ? <Icon size={42} /> : null}
      </div>

      {badgeText && (
        <div>
          <span className="badge bg-secondary bg-opacity-25 text-body px-3 py-1 rounded-pill mb-2 small">
            {badgeText}
          </span>
        </div>
      )}

      <h5 className="brand-font fw-bold mb-2">{title}</h5>
      <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '420px', lineHeight: 1.6 }}>
        {message}
      </p>

      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary-custom px-4 py-2.5 rounded-3 shadow-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
