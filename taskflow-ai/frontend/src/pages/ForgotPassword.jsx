import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Layers, Mail, Lock, Key, ArrowRight, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: request token, 2: reset password
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/forgot-password', { email });
      if (res.data.success) {
        showToast('Password reset token generated!', 'info');
        setResetToken(res.data.resetToken || '');
        setStep(2);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process request';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetToken || !newPassword) return;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/reset-password', {
        resetToken,
        password: newPassword,
        confirmPassword
      });

      if (res.data.success) {
        showToast('Password reset successfully! Please log in with your new password.', 'success');
        navigate('/login');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style={{ background: 'var(--bg-main)' }}>
      <div className="tf-card p-4 p-md-5 animate-fade-in" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 brand-font fw-bold fs-4 text-decoration-none mb-2">
            <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
              <Layers size={22} />
            </div>
            <span className="text-main">TaskFlow <span className="text-primary">AI</span></span>
          </Link>
          <h4 className="fw-bold brand-font">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h4>
          <p className="text-muted small">
            {step === 1 ? 'Enter your email to receive a password reset token' : 'Set a new password for your account'}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4" role="alert">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken}>
            <div className="mb-4">
              <label className="form-label small fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><Mail size={18} /></span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="alex@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary-custom w-100 justify-content-center py-2.5 rounded-3 mb-3"
            >
              {loading ? 'Generating Token...' : <>Request Reset Token <ArrowRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="alert alert-info py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
              <CheckCircle2 size={16} /> Token autofilled below from secure verification step.
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Reset Token</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><Key size={18} /></span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">New Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><Lock size={18} /></span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">Confirm New Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><Lock size={18} /></span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary-custom w-100 justify-content-center py-2.5 rounded-3 mb-3"
            >
              {loading ? 'Resetting Password...' : <>Confirm Reset Password <ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        <div className="text-center small text-muted">
          Remember your password?{' '}
          <Link to="/login" className="text-primary text-decoration-none fw-semibold">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
