import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Reports from './pages/Reports';
import Reminders from './pages/Reminders';
import AiAssistant from './pages/AiAssistant';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';

// Layout & Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedLayout = ({ children }) => {
  const { token, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Helper to format page title for Navbar header
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/home': return 'Academic Overview';
      case '/dashboard': return 'Dashboard';
      case '/assignments': return 'Assignments & Tasks';
      case '/reports': return 'Reports & Analytics';
      case '/reminders': return 'Reminders & Alerts';
      case '/ai-assistant': return 'TaskFlow AI Assistant';
      case '/profile': return 'Student Profile';
      case '/settings': return 'System Settings';
      case '/about': return 'About TaskFlow AI';
      default: return 'TaskFlow AI';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Authenticating user session..." />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="tf-app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="tf-main-wrapper">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle(location.pathname)}
        />
        <main className="tf-content-body p-3 p-md-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Loading TaskFlow AI..." />;
  }

  return (
    <Routes>
      {/* Root redirect: Go to /home if authenticated, else /login */}
      <Route
        path="/"
        element={<Navigate to={token ? "/home" : "/login"} replace />}
      />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={token ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/home" replace /> : <Register />}
      />

      {/* Protected Main Application Routes */}
      <Route
        path="/home"
        element={
          <ProtectedLayout>
            <Home />
          </ProtectedLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/assignments"
        element={
          <ProtectedLayout>
            <Assignments />
          </ProtectedLayout>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedLayout>
            <Reports />
          </ProtectedLayout>
        }
      />
      <Route
        path="/reminders"
        element={
          <ProtectedLayout>
            <Reminders />
          </ProtectedLayout>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <ProtectedLayout>
            <AiAssistant />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <Settings />
          </ProtectedLayout>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedLayout>
            <About />
          </ProtectedLayout>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
