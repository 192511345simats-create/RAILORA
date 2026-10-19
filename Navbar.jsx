import React, { useState } from 'react';
import { Train, GitBranch, Calculator, Cpu, Info, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar({ activeSection, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Train },
    { id: 'search', label: 'Find Routes', icon: GitBranch },
    { id: 'budget', label: 'Budget Planner', icon: Calculator },
    { id: 'os-lab', label: 'OS Concepts Lab', icon: Cpu },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="railora-navbar">
      <div className="container nav-content">
        {/* Brand Identity */}
        <div className="brand" onClick={() => handleNavClick('home')}>
          <div className="brand-logo-mark">
            <svg viewBox="0 0 36 36" className="brand-svg" aria-label="RAILORA Track Logo">
              {/* Distinctive railway track symbol combined with a route line */}
              <line x1="8" y1="4" x2="8" y2="32" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="28" y1="4" x2="28" y2="32" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              {/* Sleepers */}
              <line x1="6" y1="10" x2="30" y2="10" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="6" y1="18" x2="30" y2="18" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="6" y1="26" x2="30" y2="26" stroke="#cbd5e1" strokeWidth="2" />
              {/* Red Switch / Alternative Route line */}
              <path d="M8 26 C 14 26, 20 18, 28 10" fill="none" stroke="#cb3839" strokeWidth="3" strokeLinecap="round" />
              <circle cx="28" cy="10" r="3.2" fill="#cb3839" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">RAILORA</span>
            <span className="brand-tagline">Route &amp; Budget Optimization</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="nav-actions">
          <button
            className="btn btn-primary btn-plan"
            onClick={() => handleNavClick('search')}
          >
            <span>Plan Your Journey</span>
            <ArrowRight size={15} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="container mobile-drawer-content">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => handleNavClick('search')}
            >
              Plan Your Journey
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
