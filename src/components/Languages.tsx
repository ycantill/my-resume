import React from 'react';
import styles from '../MyResume.module.css';
import type { LanguageEntry, Language } from '../types.ts';

interface LanguagesProps {
  languages: LanguageEntry[];
  language: Language;
}

const Languages: React.FC<LanguagesProps> = ({ languages, language }) => {
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