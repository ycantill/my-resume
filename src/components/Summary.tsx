import React from 'react';
import type { LocalizedText } from '../types.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface SummaryProps {
  summary: LocalizedText;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const { language } = useLanguage();
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