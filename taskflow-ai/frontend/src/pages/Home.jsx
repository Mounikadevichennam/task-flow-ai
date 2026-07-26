import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageDocumentation from '../components/PageDocumentation';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Target,
  BarChart2,
  Bell,
  Award,
  BookOpen,
  LayoutDashboard,
  Plus
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div className="tf-card p-4 p-md-5 mb-5 border-start border-4 border-primary shadow-lg position-relative overflow-hidden">
        <div className="row align-items-center g-4">
          <div className="col-lg-7 text-start">
            <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1.5 rounded-pill mb-3 d-inline-flex align-items-center gap-2">
              <Sparkles size={16} />
              <span className="fw-semibold">AI Powered Assignment Deadline Tracker</span>
            </div>

            <h1 className="display-5 fw-extrabold brand-font mb-2" style={{ letterSpacing: '-1.5px', lineHeight: 1.15 }}>
              TaskFlow <span className="text-primary">AI</span>
            </h1>
            <h4 className="fw-semibold text-muted mb-3 brand-font">
              Plan Better. Study Smarter.
            </h4>

            <p className="lead text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
              An intelligent, production-ready academic deadline tracker engineered for college students. Track assignments, analyze study priorities with rule-based AI algorithms, generate 7-day schedules, and maximize GPA performance.
            </p>

            {/* Quick Action Buttons */}
            <div className="d-flex flex-wrap align-items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary-custom btn-lg px-4 py-2.5 rounded-3 shadow"
              >
                <LayoutDashboard size={20} /> Go to Dashboard <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/assignments?action=new')}
                className="btn btn-secondary-custom btn-lg px-4 py-2.5 rounded-3"
              >
                <Plus size={18} /> Add Assignment
              </button>
              <button
                onClick={() => navigate('/ai-assistant')}
                className="btn btn-outline-primary btn-lg px-3 py-2.5 rounded-3 d-inline-flex align-items-center gap-2"
              >
                <Sparkles size={18} /> Open AI Assistant
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="btn btn-outline-secondary btn-lg px-3 py-2.5 rounded-3 d-inline-flex align-items-center gap-2"
              >
                <BarChart2 size={18} /> View Reports
              </button>
            </div>
          </div>

          {/* Hero Illustration Card */}
          <div className="col-lg-5">
            <div className="p-3 bg-light-subtle rounded-4 border shadow-sm text-center">
              <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3 shadow">
                <Layers size={48} />
              </div>
              <h5 className="fw-bold brand-font mb-1">Academic Priority Hub</h5>
              <p className="small text-muted mb-3">Intelligent Deadline Management & GPA Optimization</p>

              <div className="d-flex flex-column gap-2 text-start small">
                <div className="p-2.5 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center gap-2 fw-medium">
                    <CheckCircle2 size={16} className="text-success" /> Active Session
                  </span>
                  <span className="badge bg-success">{user?.fullName || 'Logged Student'}</span>
                </div>
                <div className="p-2.5 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center gap-2 fw-medium">
                    <Clock size={16} className="text-primary" /> System Readiness
                  </span>
                  <span className="badge bg-primary">MongoDB Atlas Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Feature Cards Grid */}
      <div className="mb-5">
        <div className="text-center mb-4">
          <h3 className="brand-font fw-bold">Key Academic Features</h3>
          <p className="text-muted small">Designed specifically for higher education coursework</p>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="tf-card h-100 p-4">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 d-inline-block mb-3">
                <BookOpen size={24} />
              </div>
              <h5 className="brand-font fw-bold mb-2">Smart Assignment Tracking</h5>
              <p className="text-muted small m-0">
                Full CRUD management with subject tagging, course notes, estimated hours, and category filtering.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="tf-card h-100 p-4">
              <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-3 d-inline-block mb-3">
                <Target size={24} />
              </div>
              <h5 className="brand-font fw-bold mb-2">AI Priority Analyzer</h5>
              <p className="text-muted small m-0">
                Calculates dynamic 0-100 urgency scores evaluating assignment weight, deadline proximity, and estimated hours.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="tf-card h-100 p-4">
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-3 d-inline-block mb-3">
                <Zap size={24} />
              </div>
              <h5 className="brand-font fw-bold mb-2">Intelligent Study Planner</h5>
              <p className="text-muted small m-0">
                Generates automated 7-day study schedules divided into 2-hour Pomodoro blocks prioritized by deadline.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="tf-card h-100 p-4">
              <div className="bg-purple bg-opacity-10 text-purple p-3 rounded-3 d-inline-block mb-3" style={{ color: '#8b5cf6' }}>
                <BarChart2 size={24} />
              </div>
              <h5 className="brand-font fw-bold mb-2">Reports & Analytics</h5>
              <p className="text-muted small m-0">
                Visual Chart.js analytics tracking weekly submission velocity, subject load distribution, and CSV report export.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="tf-card h-100 p-4">
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3 d-inline-block mb-3">
                <Bell size={24} />
              </div>
              <h5 className="brand-font fw-bold mb-2">Reminder System</h5>
              <p className="text-muted small m-0">
                Automated alert categorization into Due Today, Due Tomorrow, Upcoming, and Overdue alert cards.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="tf-card h-100 p-4">
              <div className="bg-info bg-opacity-10 text-info p-3 rounded-3 d-inline-block mb-3">
                <Award size={24} />
              </div>
              <h5 className="brand-font fw-bold mb-2">Productivity Insights</h5>
              <p className="text-muted small m-0">
                Calculates real-time productivity grade (A+ to D), penalty deductions, and step-by-step task roadmaps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="py-4 border-top text-center text-muted small bg-card rounded-3 mb-4">
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 px-4">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-2 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
              <Layers size={16} />
            </div>
            <span className="fw-bold brand-font text-main">TaskFlow AI</span>
            <span className="text-muted">&copy; 2026 TaskFlow AI &bull; Department of Computer Science & Engineering</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span>Academic Mini Project</span>
            <span>&bull;</span>
            <span>Team TaskFlow</span>
            <span>&bull;</span>
            <span className="badge bg-primary rounded-pill px-2.5 py-1">Version 1.0</span>
          </div>
        </div>
      </footer>

      {/* Standardized 4-Card Documentation */}
      <PageDocumentation
        purpose="Serves as the main executive home portal displaying system architecture, quick action shortcuts, and feature highlights."
        technologies={['React.js', 'Bootstrap 5', 'Lucide Icons', 'React Router']}
        concepts={['Declarative Routing', 'Conditional Rendering', 'Component Reusability']}
        logic="Manages post-login portal navigation, quick feature access triggers, and system architecture visualization."
      />
    </div>
  );
};

export default Home;
