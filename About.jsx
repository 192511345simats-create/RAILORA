import React from 'react';
import {
  Info,
  GitBranch,
  Cpu,
  Calculator,
  Database,
  Layers,
  ShieldCheck,
  Code2
} from 'lucide-react';

export default function About() {
  return (
    <section id="about-section" className="section-padding about-section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Academic Engineering Project</span>
          <h2 className="section-title">About RAILORA</h2>
          <p className="section-subtitle">
            RAILORA &mdash; Smart Railway Route Optimization and Budget Planning System.
          </p>
        </div>

        <div className="about-grid">
          {/* Main Story & Purpose */}
          <div className="about-main-card">
            <h3 className="about-block-title">Project Purpose &amp; Motivation</h3>
            <p className="about-text">
              Direct train reservations on popular Indian trunk corridors frequently face severe waitlists
              and seasonal exhaustion. <strong>RAILORA</strong> was engineered to solve this dilemma by discovering
              smart alternative journeys—identifying viable 1-transfer and 2-transfer connecting routes with realistic
              interchange layovers when a direct train is sold out or unavailable.
            </p>
            <p className="about-text">
              At the same time, passenger travel requires financial predictability. RAILORA integrates a comprehensive
              multi-tier travel budget planner to ensure passengers can compare ticket classes, calculate local transit
              and meal allowances, and maintain adequate contingency margins.
            </p>

            <div className="about-pillars">
              <div className="pillar-item">
                <div className="pillar-icon"><GitBranch size={20} /></div>
                <div>
                  <h4>Graph Route Optimization</h4>
                  <p>Dijkstra's shortest path algorithm operating on a weighted multi-graph with multi-criteria objective functions (cheapest, fastest, best value).</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon"><Calculator size={20} /></div>
                <div>
                  <h4>Predictive Budget Modeling</h4>
                  <p>Real-time calculation of remaining travel allowances, multi-passenger scaling, and safety reserve alerts.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon"><Cpu size={20} /></div>
                <div>
                  <h4>Operating System Principles</h4>
                  <p>Practical integration of core OS mechanisms: thread pools, Round Robin CPU time slicing, mutex synchronization, and deadlock prevention.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="about-side-card">
            <h3 className="about-block-title">Technical Architecture</h3>

            <div className="tech-stack-list">
              <div className="tech-item">
                <span className="tech-role">Frontend</span>
                <span className="tech-name">React 19 &bull; Vite 8 &bull; CSS3 System</span>
              </div>
              <div className="tech-item">
                <span className="tech-role">Visuals</span>
                <span className="tech-name">Dynamic SVG Route Topology Diagrams</span>
              </div>
              <div className="tech-item">
                <span className="tech-role">Backend</span>
                <span className="tech-name">Python 3.14 &bull; Flask &bull; REST API</span>
              </div>
              <div className="tech-item">
                <span className="tech-role">Database</span>
                <span className="tech-name">SQLite 3 (Hubs, Routes, Fares)</span>
              </div>
              <div className="tech-item">
                <span className="tech-role">Concurrency</span>
                <span className="tech-name">Python <code>threading</code> &bull; Mutex Locks</span>
              </div>
            </div>

            {/* Academic Notice Banner */}
            <div className="academic-notice-card">
              <div className="notice-header">
                <ShieldCheck size={18} />
                <strong>Demonstration Dataset Notice</strong>
              </div>
              <p className="notice-text">
                This project represents a college-level computer science &amp; engineering demonstration.
                Schedules, train numbers, and fare estimates are computed from a simulated Indian Railway
                dataset. Live IRCTC ticket reservation or payment gateway processing is not included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
