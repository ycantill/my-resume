import React from 'react';
import type { SummaryProps } from '../../types.ts';
import { useTranslation } from '../../hooks/useTranslation';
import './styles.css';

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <h2 className="section-title">{t('sections.summary')}</h2>
      <div className="section-card">
        <p className="summary-text">{t(summary)}</p>
      </div>
    </>
  );
};

export default Summary;