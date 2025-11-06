import React from 'react';
import type { SummaryProps } from '../types.ts';

const Summary: React.FC<SummaryProps> = ({ summary, language }) => {
  const t = language;

  return (
    <>
      <h2 className="section-title">{t === 'en' ? 'Summary' : 'Resumen'}</h2>
      <div className="section-card">
        <p className="text-gray-700 leading-relaxed text-justify">{summary[t]}</p>
      </div>
    </>
  );
};

export default Summary;