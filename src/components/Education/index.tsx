import React from 'react';
import type { EducationSectionProps } from '../../types.ts';
import { useTranslation } from '../../hooks/useTranslation';
import './styles.css';

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <h2 className="section-title">{t('sections.education')}</h2>
      <div className="education-list">
        {education.map((edu, eduIndex) => (
          <div key={eduIndex} className="section-card education-card">
            <div className="education-header">
              <h3 className="education-institution">{edu.institution}</h3>
              <span className="education-badge">
                {t('education.label')}
              </span>
            </div>
            <p className="education-degree">
              {t(edu.studyType)} {t('work.in')} {t(edu.area)}
            </p>
            <p className="education-location">
              <span className="education-icon">📍</span>
              {edu.location}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default EducationSection;