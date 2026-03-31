import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section" id="hero">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="floating-logos">
        <div className="floating-logo logo-html">
          <div className="logo-inner">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-plain.svg"
              alt="HTML5"
              width="64"
              height="64"
            />
          </div>
        </div>

        <div className="floating-logo logo-css">
          <div className="logo-inner">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-plain.svg"
              alt="CSS3"
              width="58"
              height="58"
            />
          </div>
        </div>

        <div className="floating-logo logo-react">
          <div className="logo-inner">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
              alt="React"
              width="68"
              height="68"
            />
          </div>
        </div>

        <div className="floating-logo logo-tailwind">
          <div className="logo-inner">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
              alt="Tailwind CSS"
              width="62"
              height="62"
            />
          </div>
        </div>

        <div className="floating-logo logo-js">
          <div className="logo-inner">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg"
              alt="JavaScript"
              width="54"
              height="54"
            />
          </div>
        </div>

        <div className="floating-logo logo-php">
          <div className="logo-inner">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-plain.svg"
              alt="PHP"
              width="72"
              height="72"
            />
          </div>
        </div>
      </div>

      <div className="hero-content">
        <p className="hero-subtitle">Portfolio 2026</p>
        <h1 className="hero-name">
          <span className="line-1">PAUL EDUARDO</span>
          <span className="line-2">GONZALEZ ESTRELLA</span>
        </h1>
        <p className="hero-description">
          Frontend &amp; Mobile Developer crafting high-performance digital experiences with a focus on usability, scalability, and modern design.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>
            <span>VIEW PORTFOLIO</span>
          </button>
          <button className="btn-secondary">
            <span>DISCOVER MORE</span>
          </button>
        </div>
      </div>
    </section>
  );
}
