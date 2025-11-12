import React from 'react';
import type { ErrorStateProps } from '../../types.ts';
import { formatErrorMessage } from '../../types.ts';
import { t as translateFn } from '../../resume-helpers.ts';
import './styles.css';

const ErrorState: React.FC<ErrorStateProps> = ({ error, language }) => {
  // Use language from props (when rendered outside LanguageProvider)
  const t = (textOrKey: any) => translateFn(textOrKey, language);
  
  // Detectar si el error es por falta de configuración de Firebase
  const isFirebaseConfigError = error?.message?.includes('VITE_FIREBASE_CONFIG') || 
                                 error?.message?.includes('environment variable');
  
  if (isFirebaseConfigError) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-header">
            <div className="error-icon-wrapper">
              <span className="error-icon">⚙️</span>
            </div>
            <h2 className="error-title">
              {t('firebaseConfig.title')}
            </h2>
            <p className="error-subtitle">
              {t('firebaseConfig.subtitle')}
            </p>
          </div>
          
          <div className="error-config-box">
            <div className="error-config-header">
              <span className="error-config-icon">📝</span>
              <div className="error-config-content">
                <p className="error-config-title">
                  {t('firebaseConfig.howToFix')}
                </p>
                <ol className="error-config-steps">
                  <li>{t('firebaseConfig.step1')}</li>
                  <li>{t('firebaseConfig.step2')}</li>
                  <li>{t('firebaseConfig.step3')}</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="error-example-box">
            <div className="error-example-header">
              <span className="error-example-icon">💡</span>
              <p className="error-example-title">
                {t('firebaseConfig.exampleFile')}
              </p>
            </div>
            <pre className="error-example-code">
{`VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","databaseURL":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
VITE_PERSON=your_person_id`}
            </pre>
            <div className="error-example-footer">
              <p className="error-example-description">
                {t('firebaseConfig.getConfig')}
              </p>
              <ol className="error-example-steps">
                <li>{t('firebaseConfig.getConfigStep1')}</li>
                <li>{t('firebaseConfig.getConfigStep2')}</li>
                <li>{t('firebaseConfig.getConfigStep3')}</li>
                <li>{t('firebaseConfig.getConfigStep4')}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error genérico de Firebase
  return (
    <div className="error-generic-container">
      <div className="error-generic-card">
        <div className="error-generic-header">
          <div className="error-generic-icon-wrapper">
            <span className="error-generic-icon">⚠️</span>
          </div>
          <h2 className="error-generic-title">
            {t('error.title')}
          </h2>
          <p className="error-generic-subtitle">
            {t('error.subtitle')}
          </p>
          <p className="error-generic-check">
            {t('error.checkConfig')}
          </p>
        </div>
        
        {error && (
          <div className="error-details-box">
            <div className="error-details-header">
              <span className="error-details-icon">🔍</span>
              <div>
                <p className="error-details-label">
                  {t('error.errorDetected')}
                </p>
                <p className="error-details-message">{formatErrorMessage(error, language)}</p>
              </div>
            </div>
            <details className="error-details-toggle">
              <summary className="error-details-summary">
                <span className="error-details-summary-icon">📋</span>
                {t('error.technicalDetails')}
              </summary>
              <div className="error-details-content">
                <p><strong>{t('error.code')}</strong> <code className="error-details-code">{error.code}</code></p>
                <p><strong>{t('error.message')}</strong> {error.message}</p>
                {error.personId && <p><strong>Person ID:</strong> <code className="error-details-code">{error.personId}</code></p>}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;