import React from 'react';
import type { EducationSectionProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { createEducationEntry } from '../../../resume-helpers.ts';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import EducationCard from '../../molecules/EducationCard';
import styles from './styles.module.css';

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const { addItem } = useResumeEdit();

  return (
    <>
      <h2 className="section-title section-title--education">{t('sections.education')}</h2>
      <div className={styles.list}>
        {education.map((edu, index) => (
          <EducationCard key={index} education={edu} index={index} total={education.length} />
        ))}
      </div>
      {editMode && (
        <button
          type="button"
          onClick={() => addItem('education', createEducationEntry())}
          className={styles.add}
        >
          + {t('editor.addEducation')}
        </button>
      )}
    </>
  );
};

export default EducationSection;
