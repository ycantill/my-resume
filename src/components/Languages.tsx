import React from 'react';
import styles from '../MyResume.module.css';
import type { LanguageEntry } from '../types.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface LanguagesProps {
  languages: LanguageEntry[];
}

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  const { language } = useLanguage();
  const t = language;

  return (
    <>
      <h2>{t === 'en' ? 'Languages' : 'Idiomas'}</h2>
      <div className={styles.sectionCard}>
        <ul>
          {languages.map((lang, langIndex) => (
            <li key={langIndex}>{lang.language[t]} – {lang.fluency[t]}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Languages;