import React from 'react';
import styles from '../MyResume.module.css';
import type { Education } from '../types.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface EducationSectionProps {
  education: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const { language } = useLanguage();
  const t = language;

  return (
    <>
      <h2>{t === 'en' ? 'Education' : 'Educación'}</h2>
      {education.map((edu, eduIndex) => (
        <div key={eduIndex} className={styles.sectionCard}>
          <strong>{edu.institution}</strong><br />
          {edu.studyType[t]} {t === 'en' ? 'in' : 'en'} {edu.area[t]}<br />
          <small>{edu.location}</small>
        </div>
      ))}
    </>
  );
};

export default EducationSection;