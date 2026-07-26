import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Target, Code2, Cpu, Wrench } from 'lucide-react';

const PageDocumentation = ({
  purpose,
  technologies = [],
  concepts = [],
  logic
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize array or string input to array of strings
  const techList = Array.isArray(technologies) ? technologies : [technologies];
  const conceptList = Array.isArray(concepts) ? concepts : [concepts];

  return (
    <div className="mt-5 border-top pt-4">
      <div className="tf-card p-0 overflow-hidden shadow-sm" style={{ border: '1px dashed var(--primary-border)' }}>
        {/* Accordion Toggle Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-100 p-3.5 bg-light-subtle border-0 d-flex align-items-center justify-content-between text-decoration-none cursor-pointer"
          style={{ background: 'var(--primary-light)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-2 d-flex align-items-center justify-content-center">
              <BookOpen size={16} />
            </div>
            <span className="fw-bold brand-font text-main" style={{ fontSize: '0.95rem' }}>
              Technologies & Concepts Used on This Page
            </span>
          </div>
          <div className="d-flex align-items-center gap-1 text-muted small">
            <span>{isOpen ? 'Hide Documentation' : 'View Documentation'}</span>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* Collapsible 4-Card Documentation Grid */}
        {isOpen && (
          <div className="p-4 bg-card border-top animate-fade-in">
            <div className="row g-3">
              {/* Card 1: Purpose of Page */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-light-subtle h-100">
                  <div className="fw-bold text-primary mb-1.5 d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                    <Target size={16} /> Purpose of Page
                  </div>
                  <p className="text-muted small m-0" style={{ lineHeight: 1.5 }}>
                    {purpose}
                  </p>
                </div>
              </div>

              {/* Card 2: Technologies Used */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-light-subtle h-100">
                  <div className="fw-bold text-primary mb-1.5 d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                    <Code2 size={16} /> Technologies Used
                  </div>
                  <div className="d-flex flex-wrap gap-1.5 mt-1">
                    {techList.map((tech, idx) => (
                      <span key={idx} className="badge bg-secondary bg-opacity-15 text-body border px-2.5 py-1" style={{ fontSize: '0.73rem' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Programming Concepts */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-light-subtle h-100">
                  <div className="fw-bold text-primary mb-1.5 d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                    <Wrench size={16} /> Programming Concepts
                  </div>
                  <div className="d-flex flex-wrap gap-1.5 mt-1">
                    {conceptList.map((concept, idx) => (
                      <span key={idx} className="badge bg-info bg-opacity-15 text-info-emphasis border border-info border-opacity-25 px-2.5 py-1" style={{ fontSize: '0.73rem' }}>
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: Logic Used */}
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-light-subtle h-100">
                  <div className="fw-bold text-primary mb-1.5 d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                    <Cpu size={16} /> Logic Used
                  </div>
                  <p className="text-muted small m-0" style={{ lineHeight: 1.5 }}>
                    {logic}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageDocumentation;
