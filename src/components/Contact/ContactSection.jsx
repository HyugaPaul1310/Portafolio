import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

export default function ContactSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    customService: '',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // idle, confirming, sending, sent
  const [progress, setProgress] = useState(0);

  const services = [
    { id: 'web_page', label: t('contact.form.services.web_page') },
    { id: 'system_web', label: t('contact.form.services.system_web') },
    { id: 'app', label: t('contact.form.services.app') },
    { id: 'other', label: t('contact.form.services.other') }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      service: serviceId,
      customService: serviceId === 'other' ? prev.customService : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('confirming');
  };

  const handleConfirm = () => {
    setStatus('sending');
    setProgress(0);

    const duration = 2000;
    const intervalTime = 20;
    const increment = 100 / (duration / intervalTime);

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          console.log("Form submitted:", formData);
          setStatus('sent');
          setFormData({ name: '', email: '', service: '', customService: '', message: '' });
          setProgress(0);
        }, 300);
      } else {
        setProgress(Math.round(currentProgress));
      }
    }, intervalTime);
  };

  const handleCancel = () => {
    setStatus('idle');
  };

  const handleReset = () => {
    setStatus('idle');
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">

        <div className="contact-header">
          {/* New Animation Header */}
          <div className="icon-transition-container">
            <div className={`icon-circle quill-circle ${status === 'sent' ? 'hide' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                <path d="M5 3v4"></path>
                <path d="M19 17v4"></path>
                <path d="M3 5h4"></path>
                <path d="M17 19h4"></path>
              </svg>
            </div>

            <div className={`icon-circle paper-circle ${status === 'sent' ? 'show' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <path d="M22 2 11 13"></path>
              </svg>
            </div>

            <svg className={`loader-ring ${status === 'sending' ? 'active' : ''}`} viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <svg className={`loader-ring-outer ${status === 'sending' ? 'active' : ''}`} viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

          <p className="section-label">{t('contact.label')}</p>
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="contact-subtitle">
            {t('contact.subtitle')}
            <br />
            {t('contact.cta')}
          </p>
        </div>

        <div className={`contact-content ${status === 'sent' ? 'success-mode' : ''}`}>
          {status === 'sent' ? (
            <div className="success-state">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="success-title">{t('contact.form.success_title')}</h3>
              <p className="success-msg">{t('contact.form.success_msg')}</p>
              <button className="reset-btn" onClick={handleReset}>
                {t('contact.form.reset_btn')}
              </button>
            </div>
          ) : (
            <>
              {status === 'confirming' && (
                <div className="confirmation-overlay">
                  <div className="confirmation-card">
                    <h3>{t('contact.form.confirm_title')}</h3>
                    <p>{t('contact.form.confirm_msg')}</p>
                    <div className="confirmation-actions">
                      <button className="confirm-btn" onClick={handleConfirm}>{t('contact.form.confirm_btn')}</button>
                      <button className="cancel-btn" onClick={handleCancel}>{t('contact.form.cancel_btn')}</button>
                    </div>
                  </div>
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">{t('contact.form.name')}</label>
                  <div className="input-glow-wrapper">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input"
                      placeholder={t('contact.form.placeholder_name')}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={status === 'sending'}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">{t('contact.form.email')}</label>
                  <div className="input-glow-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder={t('contact.form.placeholder_email')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={status === 'sending'}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">{t('contact.form.project_type')}</label>
                  <div className="service-tags">
                    {services.map(srv => (
                      <button
                        type="button"
                        key={srv.id}
                        className={`service-tag ${formData.service === srv.id ? 'active' : ''}`}
                        onClick={() => handleServiceSelect(srv.id)}
                        disabled={status === 'sending'}
                      >
                        {srv.label}
                      </button>
                    ))}
                  </div>

                  {formData.service === 'other' && (
                    <div className="input-glow-wrapper mt-3">
                      <input
                        type="text"
                        name="customService"
                        className="form-input"
                        placeholder={t('contact.form.placeholder_other')}
                        value={formData.customService}
                        onChange={handleChange}
                        required
                        disabled={status === 'sending'}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message" className="form-label">{t('contact.form.message')}</label>
                  <div className="input-glow-wrapper">
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      placeholder={t('contact.form.placeholder_message')}
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={status === 'sending'}
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`submit-btn full-width ${status === 'sending' ? 'sending' : ''}`}
                  disabled={status === 'sending' || status === 'confirming'}
                >
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  <span className="btn-text">
                    {status === 'sending' ? (
                      <span className="progress-text">{progress}%</span>
                    ) : (
                      t('contact.form.send')
                    )}
                  </span>
                  <div className="icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="send-icon">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    <div className="loading-spinner"></div>
                  </div>
                </button>
              </form>
            </>
          )}

          <div className="contact-info">
            <a href="mailto:pgonzalez13estrella@gmail.com" className="info-card" style={{ textDecoration: 'none' }}>
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="info-details">
                <h3>{t('contact.form.email')}</h3>
                <p style={{ margin: 0 }}>pgonzalez13estrella@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
