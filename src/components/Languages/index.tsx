import React from 'react';
import type { LanguagesProps } from '../../types.ts';
import { useTranslation } from '../../hooks/useTranslation';
import './styles.css';

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <h2 className="section-title">{t('sections.languages')}</h2>
      <div className="section-card languages-card">
        <div className="languages-grid">
          {languages.map((lang, langIndex) => (
            <div key={langIndex} className="language-item">
              <span className="language-name">
                <span className="language-icon">🌐</span>
                {t(lang.language)}
              </span>
              <span className="language-fluency">
                {t(lang.fluency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Languages;