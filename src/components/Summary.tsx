import React from 'react';
import styles from '../MyResume.module.css';
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
      <h2>{t === 'en' ? 'Summary' : 'Resumen'}</h2>
      <div className={styles.sectionCard}>
        <p>{summary[t]}</p>
      </div>
    </>
  );
};

export default Summary;