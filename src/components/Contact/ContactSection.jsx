import React, { useState } from 'react';
import './Contact.css';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    customService: '',
    message: ''
  });

  const services = ['Web Page', 'System Web', 'App', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (service) => {
    // If 'Other' is selected, clear customService so they start fresh, otherwise clear it to empty
    setFormData(prev => ({
      ...prev,
      service,
      customService: service === 'Other' ? prev.customService : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData };

    // Use the custom input if 'Other' was selected
    if (finalData.service === 'Other') {
      finalData.service = finalData.customService;
    }
    delete finalData.customService;

    console.log("Form submitted:", finalData);
    alert('Thank you for reaching out! (Backend connection pending)');
    setFormData({ name: '', email: '', service: '', customService: '', message: '' });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">

        <div className="contact-header">
          <p className="section-label">Get in touch</p>
          <h2 className="section-title">Let's Build Something Great</h2>
          <p className="contact-subtitle">
            Currently available for freelance projects and open to new opportunities.
            Drop a message and let's talk about your next big idea.
          </p>
        </div>

        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <div className="input-glow-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-glow-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* SELECCIÓN DE SERVICIOS PRECARGADOS */}
            <div className="form-group full-width">
              <label className="form-label">Project Type</label>
              <div className="service-tags">
                {services.map(srv => (
                  <button
                    type="button"
                    key={srv}
                    className={`service-tag ${formData.service === srv ? 'active' : ''}`}
                    onClick={() => handleServiceSelect(srv)}
                  >
                    {srv}
                  </button>
                ))}
              </div>

              {/* CAMPO CONDICIONAL PARA ESCRITURA MANUAL */}
              {formData.service === 'Other' && (
                <div className="input-glow-wrapper mt-3">
                  <input
                    type="text"
                    name="customService"
                    className="form-input"
                    placeholder="E.g., API Integration, Consultation..."
                    value={formData.customService}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="message" className="form-label">Message</label>
              <div className="input-glow-wrapper">
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  placeholder="Hello, I have a project in mind..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <button type="submit" className="submit-btn full-width">
              <span>Send Message</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="send-icon">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>

          {/* SÓLO EL CORREO ELECTRÓNICO */}
          <div className="contact-info">
            <a href="mailto:pgonzalez13estrella@gmail.com" className="info-card" style={{ textDecoration: 'none' }}>
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="info-details">
                <h3>Email</h3>
                <p style={{ margin: 0 }}>pgonzalez13estrella@gmail.com</p>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
