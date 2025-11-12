import React from 'react';
import type { LoadingStateProps } from '../../types.ts';
import { t as translateFn } from '../../resume-helpers.ts';
import './styles.css';

const LoadingState: React.FC<LoadingStateProps> = ({ language }) => {
  // Use language from props (when rendered outside LanguageProvider)
  const t = (textOrKey: any) => translateFn(textOrKey, language);
  
  return (
    <div className="loading-container">
      <div className="loading-card">
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner-outer"></div>
          <div className="loading-spinner-inner">
            <div className="loading-spinner-dot"></div>
          </div>
        </div>
        <h2 className="loading-title">
          {t('loading.title')}
        </h2>
        <p className="loading-subtitle">
          {t('loading.subtitle')}
        </p>
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot" style={{animationDelay: '0.1s'}}></div>
          <div className="loading-dot" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;