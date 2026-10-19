import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Cpu, Clock, IndianRupee } from 'lucide-react';

export default function Hero({ onSearchClick, onExploreClick }) {
  return (
    <section className="railora-hero">
      {/* Background with Authentic Passenger Train Photograph */}
      <div className="hero-bg-media">
        <img
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=80"
          alt="Indian Passenger Train travelling on railway line through countryside"
          className="hero-image"
          onError={(e) => {
            // Fallback to high quality railway photography if needed
            e.target.src = "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=2000&q=80";
          }}
        />
        <div className="hero-overlay" />
      </div>

      <div className="container hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          <span>Next-Generation Route &amp; Budget Optimization</span>
        </div>

        <h1 className="hero-title">
          Every journey has <br className="hero-br" />
          <span className="hero-highlight">another way.</span>
        </h1>

        <p className="hero-description">
          Discover alternative train routes, compare fares, and plan smarter journeys
          that fit your time and budget. Combining graph-based routing algorithms with
          operating system concurrency principles.
        </p>

        <div className="hero-cta-group">
          <button className="btn btn-primary btn-hero-main" onClick={onSearchClick}>
            <span>Find My Route</span>
            <ArrowRight size={17} />
          </button>
          <button className="btn btn-secondary btn-hero-outline" onClick={onExploreClick}>
            <Compass size={17} />
            <span>Explore Features</span>
          </button>
        </div>

        {/* Transport Metrics Strip */}
        <div className="hero-metrics-grid">
          <div className="metric-item">
            <div className="metric-icon"><Compass size={18} /></div>
            <div className="metric-text">
              <span className="metric-value">Smart Connecting Hubs</span>
              <span className="metric-label">Find 1-transfer &amp; 2-transfer itineraries</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon"><IndianRupee size={18} /></div>
            <div className="metric-text">
              <span className="metric-value">Budget Calculator</span>
              <span className="metric-label">Real-time remaining margin &amp; limits</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon"><Cpu size={18} /></div>
            <div className="metric-text">
              <span className="metric-value">OS Concepts Lab</span>
              <span className="metric-label">Mutex, Scheduling &amp; Deadlock Sim</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
