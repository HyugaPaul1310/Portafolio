import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../LanguageToggle/LanguageToggle';
import './Navbar.css';

export default function Navbar() {
  const { t } = useTranslation();
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
        <nav className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li className="nav-item">
              <span onClick={() => scrollToSection('projects')}>{t('nav.projects')}</span>
            </li>
            <li className="nav-item">
              <span onClick={() => scrollToSection('about')}>{t('nav.about')}</span>
            </li>
            <li className="nav-item">
              <span onClick={() => scrollToSection('contact')}>{t('nav.contact')}</span>
            </li>
          </ul>

          <div className="navbar-action">
            <button className="neon-btn" onClick={() => scrollToSection('contact')}>
              <span>{t('nav.lets_talk')}</span>
            </button>
            <LanguageToggle />
          </div>
        </nav>

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
