import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Sparkles, CheckCircle2, ShieldCheck, Clock, ArrowRight, Zap, Target, BarChart2 } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'var(--bg-main)' }}>
      {/* Header / Navbar */}
      <nav className="navbar navbar-expand-lg px-4 py-3 border-bottom tf-glass sticky-top">
        <div className="container-fluid max-width-1400">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 brand-font fw-bold fs-4">
            <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
              <Layers size={22} />
            </div>
            <span>TaskFlow <span className="text-primary">AI</span></span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link to="/login" className="btn btn-secondary-custom">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary-custom">
              Create Account <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 my-auto text-center px-3">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill mb-4 d-inline-flex align-items-center gap-2 animate-fade-in">
            <Sparkles size={16} />
            <span className="fw-semibold">Intelligent Deadline & Priority Engine</span>
          </div>

          <h1 className="display-4 fw-extrabold brand-font mb-3 animate-fade-in" style={{ letterSpacing: '-1.5px', lineHeight: 1.15 }}>
            Plan Better. <span className="text-primary">Study Smarter.</span>
          </h1>

          <p className="lead text-muted mb-4 px-md-5 animate-fade-in" style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>
            The complete AI-powered academic task tracker engineered for college students. Track assignment deadlines, analyze study priorities, generate smart schedules, and master your GPA.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-5 animate-fade-in">
            <Link to="/register" className="btn btn-primary-custom btn-lg px-4 py-3 rounded-3 shadow">
              Get Started for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary-custom btn-lg px-4 py-3 rounded-3">
              Existing Student Login
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 text-muted small">
            <span className="d-flex align-items-center gap-1.5">
              <CheckCircle2 size={16} className="text-success" /> Zero AI Token Cost
            </span>
            <span className="d-flex align-items-center gap-1.5">
              <ShieldCheck size={16} className="text-primary" /> End-to-End JWT Auth
            </span>
            <span className="d-flex align-items-center gap-1.5">
              <Clock size={16} className="text-warning" /> Smart Overdue Protection
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div className="text-center mb-5">
            <h2 className="brand-font fw-bold">Engineered for Academic Excellence</h2>
            <p className="text-muted">Inspired by Notion, Linear, TickTick & Microsoft To Do</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="tf-card h-100 p-4">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 d-inline-block mb-3">
                  <Target size={24} />
                </div>
                <h5 className="brand-font fw-bold mb-2">Priority Analyzer</h5>
                <p className="text-muted small">
                  Calculates urgency scores dynamically based on assignment weight, estimated hours, and deadline proximity.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tf-card h-100 p-4">
                <div className="bg-success bg-opacity-10 text-success p-3 rounded-3 d-inline-block mb-3">
                  <Zap size={24} />
                </div>
                <h5 className="brand-font fw-bold mb-2">Automated Study Planner</h5>
                <p className="text-muted small">
                  Generates an optimal 7-day study breakdown structured into 2-hour Pomodoro blocks around your classes.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tf-card h-100 p-4">
                <div className="bg-purple bg-opacity-10 text-purple p-3 rounded-3 d-inline-block mb-3" style={{ color: '#8b5cf6' }}>
                  <BarChart2 size={24} />
                </div>
                <h5 className="brand-font fw-bold mb-2">Analytics & Productivity Score</h5>
                <p className="text-muted small">
                  Real-time interactive charts tracking completion ratios, weekly velocity, and subject distribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-muted small mt-auto">
        <p className="m-0">TaskFlow AI &copy; {new Date().getFullYear()} — Built for College Students Worldwide.</p>
      </footer>
    </div>
  );
};

export default Welcome;
