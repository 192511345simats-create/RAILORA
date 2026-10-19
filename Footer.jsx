import React from 'react';
import { Train, Heart, Shield, Terminal, ArrowUp } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="railora-footer">
      <div className="container footer-content">
        <div className="footer-top-row">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand-title">
              <span className="brand-logo-text">RAILORA</span>
            </div>
            <p className="footer-tagline">
              &ldquo;Every journey has another way.&rdquo;
            </p>
            <p className="footer-desc">
              College-level engineering project integrating graph-based railway route optimization,
              travel budget forecasting, and operating system concurrency simulations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('home')}>Home</button></li>
              <li><button onClick={() => onNavigate('search')}>Find Routes</button></li>
              <li><button onClick={() => onNavigate('budget')}>Budget Planner</button></li>
              <li><button onClick={() => onNavigate('os-lab')}>OS Concepts Lab</button></li>
              <li><button onClick={() => onNavigate('about')}>About RAILORA</button></li>
            </ul>
          </div>

          {/* Engineering Concepts */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Core Disciplines</h4>
            <ul className="footer-links">
              <li><span>Dijkstra Shortest Path</span></li>
              <li><span>Multi-Transfer Connections</span></li>
              <li><span>Round Robin CPU Scheduling</span></li>
              <li><span>Mutex Lock Synchronization</span></li>
              <li><span>Banker's Deadlock Avoidance</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} RAILORA. Demonstration Indian Railway Network. Non-commercial engineering prototype.
          </div>
          <button className="btn-scroll-top" onClick={scrollToTop} title="Back to top">
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
