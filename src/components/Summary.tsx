import React from 'react';
import type { SummaryProps } from '../types.ts';
import { useTranslation } from '../hooks/useTranslation';

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <h2 className="section-title">{t('sections.summary')}</h2>
      <div className="section-card">
        <p className="text-gray-700 leading-relaxed text-justify">{t(summary)}</p>
      </div>
    </>
  );
};

export default Summary;