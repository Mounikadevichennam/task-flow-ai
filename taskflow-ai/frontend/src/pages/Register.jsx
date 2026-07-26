import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Layers,
  User,
  Mail,
  Building2,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    branch: '',
    semester: '1',
    institution: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  // Live password validation checklist criteria
  const passwordCriteria = {
    minChars: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
  };

  // Calculate password strength score (0 to 5)
  const calculateStrengthScore = () => {
    if (!formData.password) return 0;
    let score = 0;
    if (passwordCriteria.minChars) score += 1;
    if (passwordCriteria.hasUpper) score += 1;
    if (passwordCriteria.hasLower) score += 1;
    if (passwordCriteria.hasNumber) score += 1;
    if (passwordCriteria.hasSpecial) score += 1;
    return score;
  };

  const strengthScore = calculateStrengthScore();

  // Determine strength label, color, and percentage
  const getStrengthMeta = () => {
    if (strengthScore === 0) return { label: '', color: 'bg-secondary', width: '0%', textClass: 'text-muted' };
    if (strengthScore <= 2) return { label: 'Weak', color: 'bg-danger', width: `${strengthScore * 20}%`, textClass: 'text-danger' };
    if (strengthScore <= 4) return { label: 'Medium', color: 'bg-warning', width: `${strengthScore * 20}%`, textClass: 'text-warning' };
    return { label: 'Strong', color: 'bg-success', width: '100%', textClass: 'text-success' };
  };

  const strengthMeta = getStrengthMeta();

  // Confirm password live matching state
  const isConfirmTyped = formData.confirmPassword.length > 0;
  const isPasswordMatch = isConfirmTyped && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.branch || !formData.password) {
      setErrorMessage('Please fill in all required fields marked with *.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both password fields are identical.');
      return;
    }

    if (strengthScore < 5) {
      setErrorMessage('Password must satisfy all 5 security checklist requirements.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await register(formData);
      if (res.success) {
        showToast('Account created successfully! Welcome to TaskFlow AI.', 'success');
        navigate('/home');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Email may already be registered or inputs invalid.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style={{ background: 'var(--bg-main)' }}>
      <div className="tf-card p-4 p-md-5 animate-fade-in shadow-lg rounded-4" style={{ maxWidth: '520px', width: '100%' }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 brand-font fw-bold fs-4 text-decoration-none mb-2">
            <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
              <Layers size={22} />
            </div>
            <span className="text-main">TaskFlow <span className="text-primary">AI</span></span>
          </Link>
          <h4 className="fw-bold brand-font m-0">Create Student Account</h4>
          <p className="text-muted small m-0 mt-1">Join TaskFlow AI to master your assignment deadlines</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2.5 px-3 small rounded-3 mb-4 d-flex align-items-center gap-2" role="alert">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Full Name *</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3"><User size={18} /></span>
              <input
                type="text"
                name="fullName"
                className="form-control border-start-0 rounded-end-3 py-2"
                placeholder="Alex Morgan"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address *</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3"><Mail size={18} /></span>
              <input
                type="email"
                name="email"
                className="form-control border-start-0 rounded-end-3 py-2"
                placeholder="alex@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Branch & Semester */}
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Branch / Dept *</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3"><BookOpen size={18} /></span>
                <input
                  type="text"
                  name="branch"
                  className="form-control border-start-0 rounded-end-3 py-2"
                  placeholder="CS / ECE"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Semester *</label>
              <select
                name="semester"
                className="form-select py-2 rounded-3"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Institution */}
          <div className="mb-3.5">
            <label className="form-label small fw-semibold">Institution / University (Optional)</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3"><Building2 size={18} /></span>
              <input
                type="text"
                name="institution"
                className="form-control border-start-0 rounded-end-3 py-2"
                placeholder="Stanford University"
                value={formData.institution}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="mb-3.5">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="form-label small fw-semibold mb-0">Password *</label>
              {formData.password && (
                <span className={`small fw-bold ${strengthMeta.textClass}`} style={{ fontSize: '0.78rem' }}>
                  Strength: {strengthMeta.label}
                </span>
              )}
            </div>

            {/* Modern Rounded Password Input Group */}
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3"><Lock size={18} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control border-start-0 border-end-0 py-2"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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

            {/* Animated Strength Progress Bar */}
            {formData.password && (
              <div className="progress mt-2 rounded-pill" style={{ height: '5px' }}>
                <div
                  className={`progress-bar ${strengthMeta.color}`}
                  role="progressbar"
                  style={{
                    width: strengthMeta.width,
                    transition: 'width 0.3s ease, background-color 0.3s ease'
                  }}
                ></div>
              </div>
            )}

            {/* Live Password Validation Checklist */}
            <div className="bg-light-subtle rounded-3 p-3 mt-2.5 border small">
              <div className="fw-semibold text-muted mb-2 d-flex align-items-center gap-1.5" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={14} className="text-primary" /> Password Security Checklist:
              </div>
              <div className="row g-2" style={{ fontSize: '0.74rem' }}>
                <div className={`col-6 d-flex align-items-center gap-1.5 ${passwordCriteria.minChars ? 'text-success fw-medium' : 'text-muted'}`}>
                  {passwordCriteria.minChars ? <CheckCircle2 size={13} /> : <XCircle size={13} className="opacity-50" />}
                  Minimum 8 characters
                </div>
                <div className={`col-6 d-flex align-items-center gap-1.5 ${passwordCriteria.hasUpper ? 'text-success fw-medium' : 'text-muted'}`}>
                  {passwordCriteria.hasUpper ? <CheckCircle2 size={13} /> : <XCircle size={13} className="opacity-50" />}
                  One uppercase letter
                </div>
                <div className={`col-6 d-flex align-items-center gap-1.5 ${passwordCriteria.hasLower ? 'text-success fw-medium' : 'text-muted'}`}>
                  {passwordCriteria.hasLower ? <CheckCircle2 size={13} /> : <XCircle size={13} className="opacity-50" />}
                  One lowercase letter
                </div>
                <div className={`col-6 d-flex align-items-center gap-1.5 ${passwordCriteria.hasNumber ? 'text-success fw-medium' : 'text-muted'}`}>
                  {passwordCriteria.hasNumber ? <CheckCircle2 size={13} /> : <XCircle size={13} className="opacity-50" />}
                  One number
                </div>
                <div className={`col-12 d-flex align-items-center gap-1.5 ${passwordCriteria.hasSpecial ? 'text-success fw-medium' : 'text-muted'}`}>
                  {passwordCriteria.hasSpecial ? <CheckCircle2 size={13} /> : <XCircle size={13} className="opacity-50" />}
                  One special character (@$!%*?&#...)
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="form-label small fw-semibold mb-0">Confirm Password *</label>
              {isConfirmTyped && (
                <span
                  className={`small fw-bold d-flex align-items-center gap-1 ${
                    isPasswordMatch ? 'text-success' : 'text-danger'
                  }`}
                  style={{ fontSize: '0.78rem' }}
                >
                  {isPasswordMatch ? (
                    <><CheckCircle2 size={14} /> Passwords Match</>
                  ) : (
                    <><XCircle size={14} /> Passwords Do Not Match</>
                  )}
                </span>
              )}
            </div>

            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted rounded-start-3"><Lock size={18} /></span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={`form-control border-start-0 border-end-0 py-2 ${
                  isConfirmTyped ? (isPasswordMatch ? 'is-valid' : 'is-invalid') : ''
                }`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="input-group-text bg-light border-start-0 text-muted rounded-end-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary-custom w-100 justify-content-center py-2.5 rounded-3 mb-3 shadow-sm"
          >
            {submitting ? 'Creating Account...' : <>Complete Registration <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="text-center small text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary text-decoration-none fw-semibold">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
