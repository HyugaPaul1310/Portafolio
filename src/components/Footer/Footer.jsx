import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="aurora-wrap">
      <div className="aurora-content">
        <p>© 2026 Paul Eduardo Gonzalez Estrella. {t('footer.rights')}</p>
        <p>{t('footer.location')}</p>
      </div>

      <div className="aurora-lightings">
        <div className="aurora-layer aurora-one">
          <div className="aurora-layer aurora-two">
            <div className="aurora-layer aurora-three">
              <div className="aurora-layer aurora-four">
                <div className="aurora-layer aurora-five"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
