import React from 'react';
import styles from '../MyResume.module.css';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { printResume } from '../resume-helpers.ts';

interface ToolbarProps {
  persona: string;
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPersonaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  persona, 
  onLanguageChange, 
  onPersonaChange 
}) => {
  const { language } = useLanguage();
  const t = language;

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolGroup}>
        <label htmlFor="lang-select">{t === 'en' ? 'Language:' : 'Idioma:'}</label>
        <select id="lang-select" value={language} onChange={onLanguageChange}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>

        <label htmlFor="persona-select">{t === 'en' ? 'Person:' : 'Persona:'}</label>
        <select id="persona-select" value={persona} onChange={onPersonaChange}>
          <option value="yohany">Yohany</option>
          <option value="lenicet">Lenicet</option>
        </select>
      </div>
      <div className={styles.toolActions}>
        <button onClick={printResume}>{t === 'en' ? 'Print' : 'Imprimir'}</button>
      </div>
    </div>
  );
};

export default Toolbar;