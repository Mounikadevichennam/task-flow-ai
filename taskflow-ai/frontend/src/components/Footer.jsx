import React from 'react';
import { Layers } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      className="py-3.5 px-4 border-top text-center text-muted small mt-auto"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 max-width-1400 mx-auto">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white p-1 rounded-2 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
            <Layers size={14} />
          </div>
          <span className="fw-bold brand-font text-main">TaskFlow AI</span>
          <span>&copy; {new Date().getFullYear()} TaskFlow AI &bull; <span className="fst-italic text-primary">Plan Better. Study Smarter.</span></span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1">
            System Operational
          </span>
          <span className="fw-semibold">Version 1.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
