import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container-fixed">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`d-flex align-items-center justify-content-between p-3 rounded-3 shadow-lg animate-fade-in border ${
              toast.type === 'success'
                ? 'bg-success text-white border-success'
                : toast.type === 'error'
                ? 'bg-danger text-white border-danger'
                : toast.type === 'warning'
                ? 'bg-warning text-dark border-warning'
                : 'bg-info text-white border-info'
            }`}
            style={{ fontSize: '0.9rem', fontWeight: 500 }}
          >
            <div className="d-flex align-items-center gap-2">
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'warning' && <AlertTriangle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn btn-link text-reset p-0 ms-3"
              style={{ opacity: 0.8 }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
