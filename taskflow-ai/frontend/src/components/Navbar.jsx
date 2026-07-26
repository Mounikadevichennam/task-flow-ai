import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Sparkles, Bell } from 'lucide-react';

const Navbar = ({ toggleSidebar, title = 'Dashboard' }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header
      className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between sticky-top"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        zIndex: 1020,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-outline-secondary d-md-none rounded-3"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h4 className="m-0 fw-bold brand-font" style={{ fontSize: '1.25rem', letterSpacing: '-0.3px' }}>
          {title}
        </h4>
      </div>

      <div className="d-flex align-items-center gap-2 gap-sm-3">
        {/* Quick AI Assistant Button */}
        <button
          onClick={() => navigate('/ai-assistant')}
          className="btn btn-sm btn-primary-custom rounded-pill px-3 py-1.5 shadow-sm"
          style={{ fontSize: '0.825rem' }}
        >
          <Sparkles size={15} />
          <span className="d-none d-sm-inline">AI Assistant</span>
        </button>

        {/* Reminders Shortcut */}
        <button
          onClick={() => navigate('/reminders')}
          className="btn btn-sm btn-light border rounded-circle p-2 text-muted"
          style={{ width: '38px', height: '38px' }}
          title="Reminders"
        >
          <Bell size={18} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-sm btn-light border rounded-circle p-2 text-muted"
          style={{ width: '38px', height: '38px' }}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-warning" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
