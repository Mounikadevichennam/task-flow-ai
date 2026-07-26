import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClass = size === 'lg' ? 'modal-lg' : size === 'xl' ? 'modal-xl' : '';

  return (
    <div
      className="modal fade show d-block animate-fade-in"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className={`modal-dialog modal-dialog-centered ${sizeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', borderRadius: '16px' }}>
          <div className="modal-header border-bottom-0 pb-0 pt-4 px-4 d-flex align-items-center justify-content-between">
            <h5 className="modal-title fw-bold brand-font" style={{ fontSize: '1.25rem' }}>{title}</h5>
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle p-1"
              onClick={onClose}
              style={{ width: '32px', height: '32px' }}
            >
              <X size={18} />
            </button>
          </div>
          <div className="modal-body p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
