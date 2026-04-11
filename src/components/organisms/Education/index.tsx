import React from 'react';
import type { EducationSectionProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import EducationCard from '../../molecules/EducationCard';
import styles from './styles.module.css';

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="section-title section-title--education">{t('sections.education')}</h2>
      <div className={styles.list}>
        {education.map((edu, index) => (
          <EducationCard key={index} education={edu} />
        ))}
      </div>
    </>
  );
};

export default EducationSection;