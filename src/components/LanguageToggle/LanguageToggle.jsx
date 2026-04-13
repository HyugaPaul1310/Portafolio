import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
      <span className={i18n.language === 'es' ? 'active' : ''}>ES</span>
      <span className="divider">|</span>
      <span className={i18n.language === 'en' ? 'active' : ''}>EN</span>
      <div className="toggle-glow"></div>
    </button>
  );
};

export default LanguageToggle;
