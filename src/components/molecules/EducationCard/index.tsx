import React from 'react';
import type { Education } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  const { t } = useTranslation();

  return (
    <div className="section-card education-card">
      <div className="education-header">
        <h3 className="education-institution">{education.institution}</h3>
        <span className="education-badge">
          {t('education.label')}
        </span>
      </div>
      <p className="education-degree">
        {t(education.studyType)} {t('work.in')} {t(education.area)}
      </p>
      <p className="education-location">
        <span className="education-icon">📍</span>
        {education.location}
      </p>
    </div>
  );
};

export default EducationCard;
