import React from 'react';
import type { Language } from '../../types';
import { t as translateFn } from '../../resume-helpers';
import './styles.css';

interface PersonRequiredFallbackProps {
  language: Language;
}

const PersonRequiredFallback: React.FC<PersonRequiredFallbackProps> = ({ language }) => {
  // Use language from props (when rendered outside LanguageProvider)
  const t = (textOrKey: any) => translateFn(textOrKey, language);
  
  return (
    <div className="fallback-container">
      <div className="fallback-wrapper">
        <div className="fallback-card">
          <h1 className="fallback-title">
            {t('fallback.title')}
          </h1>
          
          <div className="fallback-content">
            <p>
              {t('fallback.description')}
            </p>
            
            <div className="fallback-instructions">
              <h3 className="fallback-section-title">
                {t('fallback.howToSet')}
              </h3>
              
              <div className="fallback-methods">
                <div>
                  <h4 className="fallback-method-title">
                    {t('fallback.forDevelopment')}
                  </h4>
                  <code className="fallback-method-code">
                    VITE_PERSON=your_person_id npm run dev
                  </code>
                </div>
                
                <div>
                  <h4 className="fallback-method-title">
                    {t('fallback.forBuilding')}
                  </h4>
                  <code className="fallback-method-code">
                    VITE_PERSON=your_person_id npm run build
                  </code>
                </div>
              </div>
            </div>
            
            <div className="fallback-info">
              <div className="fallback-info-text">
                <p className="fallback-persons-desc">
                  {t('fallback.availablePersons')}
                </p>
                <p className="fallback-persons-detail">
                  Any person ID configured in your Firebase database under <code className="fallback-persons-code">public/people/</code>
                </p>
              </div>
            </div>
          </div>
          
          <div className="fallback-footer">
            <p className="fallback-footer-text">
              {t('fallback.securityNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonRequiredFallback;