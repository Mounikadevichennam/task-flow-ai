import React from 'react';
import PageDocumentation from '../components/PageDocumentation';
import {
  Layers,
  Code2,
  Server,
  Database,
  Lock
} from 'lucide-react';

const About = () => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill mb-2 d-inline-flex align-items-center gap-1.5">
            <Layers size={15} /> Academic Mini Project &bull; Version 1.0.0
          </div>
          <h2 className="brand-font fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            About TaskFlow AI
          </h2>
          <p className="text-muted small m-0 mt-1">
            Intelligent assignment deadline tracker and rule-based priority engine.
          </p>
        </div>
      </div>

      {/* Main Overview */}
      <div className="tf-card p-4 p-md-5 mb-4">
        <h4 className="brand-font fw-bold mb-3 text-primary">Project Overview</h4>
        <p className="text-muted leading-relaxed mb-4" style={{ lineHeight: 1.7 }}>
          <strong>TaskFlow AI</strong> is a production-grade fullstack web application designed to solve academic workload stress for university students. By combining strict deadline tracking, priority scoring algorithms, 7-day study block generation, and visual velocity analytics, TaskFlow AI enables students to manage coursework efficiently and avoid last-minute submission panics.
        </p>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="p-3.5 border rounded-3 bg-light-subtle h-100">
              <h6 className="fw-bold text-main mb-2">🎯 Primary Objectives</h6>
              <ul className="small text-muted m-0 ps-3" style={{ lineHeight: 1.6 }}>
                <li>Eliminate overdue assignment submissions with automated alerts.</li>
                <li>Provide data-driven priority scoring based on course weight and effort.</li>
                <li>Automate study schedule creation into Pomodoro blocks.</li>
                <li>Deliver executive analytics on student academic velocity.</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-3.5 border rounded-3 bg-light-subtle h-100">
              <h6 className="fw-bold text-main mb-2">🚀 Future Scope & Roadmap</h6>
              <ul className="small text-muted m-0 ps-3" style={{ lineHeight: 1.6 }}>
                <li>Google Calendar & Outlook two-way deadline synchronization.</li>
                <li>Browser push notifications & mobile SMS alert integration.</li>
                <li>Collaborative study group task sharing & peer leaderboard.</li>
                <li>Progressive Web App (PWA) offline syncing capabilities.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="tf-card p-4 mb-4">
        <h5 className="brand-font fw-bold mb-3">Fullstack Technology Stack</h5>
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-md-3">
            <div className="p-3 border rounded-3 text-center bg-light-subtle">
              <Code2 size={24} className="text-primary mb-2" />
              <div className="fw-bold small">Frontend</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>React.js &bull; Bootstrap 5</div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="p-3 border rounded-3 text-center bg-light-subtle">
              <Server size={24} className="text-success mb-2" />
              <div className="fw-bold small">Backend API</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Node.js &bull; Express.js</div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="p-3 border rounded-3 text-center bg-light-subtle">
              <Database size={24} className="text-warning mb-2" />
              <div className="fw-bold small">Database</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>MongoDB Atlas & Memory Server</div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="p-3 border rounded-3 text-center bg-light-subtle">
              <Lock size={24} className="text-info mb-2" />
              <div className="fw-bold small">Security</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>JWT Bearer & bcryptjs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Details Card */}
      <div className="tf-card p-4">
        <h5 className="brand-font fw-bold mb-3">Project Metadata</h5>
        <div className="row g-3 text-muted small">
          <div className="col-6 col-md-3">
            <span className="fw-semibold text-main d-block">Department</span>
            Computer Science & Engineering
          </div>
          <div className="col-6 col-md-3">
            <span className="fw-semibold text-main d-block">Project Type</span>
            Fullstack Academic Mini Project
          </div>
          <div className="col-6 col-md-3">
            <span className="fw-semibold text-main d-block">Team Name</span>
            Team TaskFlow
          </div>
          <div className="col-6 col-md-3">
            <span className="fw-semibold text-main d-block">Version</span>
            v1.0.0 (Production Build)
          </div>
        </div>
      </div>

      {/* Standardized 4-Card Documentation */}
      <PageDocumentation
        purpose="Presents project background objectives, technology architecture overview, and future roadmap scope."
        technologies={['React.js', 'Bootstrap 5', 'Node.js', 'Express.js', 'MongoDB']}
        concepts={['Fullstack Architecture', 'Decoupled API Design', 'Static Presentation']}
        logic="Outlines multi-tier technical architecture flow, student workload reduction goals, and project metadata."
      />
    </div>
  );
};

export default About;
