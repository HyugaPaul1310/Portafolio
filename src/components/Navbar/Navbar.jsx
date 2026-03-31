import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMenuOpen(false); // Close menu on mobile
    const element = document.getElementById(id);
    if (element) {
      // Calculate offset for fixed navbar if needed, or just standard scroll
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop > 0 ? offsetTop : 0, behavior: 'smooth' });
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => scrollToSection('home')}>
          <span className="logo-text">
            <span className="logo-accent">PAUL</span>

          </span>
        </div>

        {/* Desktop & Mobile Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li onClick={() => scrollToSection('home')} className="nav-item">Home</li>
            <li onClick={() => scrollToSection('projects')} className="nav-item">Projects</li>
            <li onClick={() => scrollToSection('about')} className="nav-item">About Me</li>
          </ul>

          {/* Action Button */}
          <div className="navbar-action">
            <button className="neon-btn" onClick={() => scrollToSection('contact')}>
              <span>Let's Talk</span>
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className={`mobile-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}
