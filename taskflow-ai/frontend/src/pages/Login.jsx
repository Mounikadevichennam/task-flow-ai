import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Layers, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await login(email, password);
      if (res.success) {
        showToast('Login successful! Welcome back.', 'success');
        navigate('/home');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid email or password. Please verify your credentials.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style={{ background: 'var(--bg-main)' }}>
      <div className="tf-card p-4 p-md-5 animate-fade-in shadow-lg rounded-4" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 brand-font fw-bold fs-4 text-decoration-none mb-2">
            <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
              <Layers size={22} />
            </div>
            <span className="text-main">TaskFlow <span className="text-primary">AI</span></span>
          </Link>
          <h4 className="fw-bold brand-font m-0">Welcome Back</h4>
          <p className="text-muted small m-0 mt-1">Log in to manage your student workload</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2.5 px-3 small rounded-3 mb-4 d-flex align-items-center gap-2" role="alert">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3.5">
            <label className="form-label small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3"><Mail size={18} /></span>
              <input
                type="email"
                className="form-control border-start-0 rounded-end-3 py-2"
                placeholder="alex@university.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3.5">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="form-label small fw-semibold mb-0">Password</label>
              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Secured JWT Login</span>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3"><Lock size={18} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0 py-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                required
              />
              <button
                type="button"
                className="input-group-text bg-light border-start-0 text-muted rounded-end-3"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label small text-muted" htmlFor="rememberMe">
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary-custom w-100 justify-content-center py-2.5 rounded-3 mb-3 shadow-sm"
          >
            {submitting ? 'Authenticating...' : <>Login to Account <LogIn size={18} /></>}
          </button>
        </form>

        <div className="text-center small text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary text-decoration-none fw-semibold">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
