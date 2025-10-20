import React from 'react';
import styles from '../MyResume.module.css';
import type { Education, Language } from '../types.ts';

interface EducationSectionProps {
  education: Education[];
  language: Language;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, language }) => {
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