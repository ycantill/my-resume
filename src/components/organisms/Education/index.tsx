import React from 'react';
import type { EducationSectionProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import EducationCard from '../../molecules/EducationCard';
import './styles.css';

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="section-title education-title">{t('sections.education')}</h2>
      <div className="education-list">
        {education.map((edu, index) => (
          <EducationCard key={index} education={edu} />
        ))}
      </div>
    </>
  );
};

export default EducationSection;