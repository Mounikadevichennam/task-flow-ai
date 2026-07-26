import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Bell,
  Sparkles,
  User,
  Settings,
  Info,
  LogOut,
  Layers,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assignments', label: 'Assignments', icon: BookOpen },
    { path: '/reports', label: 'Reports', icon: BarChart2 },
    { path: '/reminders', label: 'Reminders', icon: Bell },
    { path: '/ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/about', label: 'About', icon: Info }
  ];

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      <aside className={`tf-sidebar ${isOpen ? 'show' : ''} p-3`}>
        <div>
          {/* Brand Header */}
          <div className="d-flex align-items-center justify-content-between px-2 py-3 mb-3 border-bottom">
            <div className="d-flex align-items-center gap-2.5">
              <div
                className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '38px', height: '38px' }}
              >
                <Layers size={22} />
              </div>
              <div>
                <h5 className="brand-font fw-extrabold m-0 text-primary" style={{ letterSpacing: '-0.5px' }}>
                  TaskFlow AI
                </h5>
                <span className="small text-muted" style={{ fontSize: '0.72rem' }}>
                  Academic Deadline Tracker
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="btn btn-sm btn-light border d-lg-none rounded-circle p-1.5 text-muted"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="d-flex flex-column gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <div className="d-flex align-items-center gap-2.5">
                    <Icon size={18} />
                    <span className="small">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="badge bg-warning text-dark font-monospace" style={{ fontSize: '0.65rem' }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Button */}
        <div className="pt-3 border-top mt-3">
          {user && (
            <div className="d-flex align-items-center gap-2 px-2 mb-3">
              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold small"
                style={{ width: '34px', height: '34px' }}
              >
                {user.fullName?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="overflow-hidden">
                <div className="fw-semibold text-truncate small" style={{ maxWidth: '140px' }}>
                  {user.fullName}
                </div>
                <div className="text-muted text-truncate" style={{ fontSize: '0.7rem', maxWidth: '140px' }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 small fw-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
