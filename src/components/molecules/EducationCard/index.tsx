import React from 'react';
import type { Education } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { clsx } from 'clsx';
import styles from './styles.module.css';

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  const { t } = useTranslation();

  return (
    <div className={clsx('section-card', styles.root)}>
      <div className={styles.header}>
        <h3 className={styles.institution}>{education.institution}</h3>
        <span className={styles.badge}>
          {t('education.label')}
        </span>
      </div>
      <p className={styles.degree}>
        {t(education.studyType)} {t('work.in')} {t(education.area)}
      </p>
      <p className={styles.location}>
        <span className={styles.locationIcon}>📍</span>
        {education.location}
      </p>
    </div>
  );
};

export default EducationCard;
