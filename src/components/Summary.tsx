import React from 'react';
import styles from '../MyResume.module.css';
import type { Language, LocalizedText } from '../types.ts';

interface SummaryProps {
  summary: LocalizedText;
  language: Language;
}

const Summary: React.FC<SummaryProps> = ({ summary, language }) => {
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