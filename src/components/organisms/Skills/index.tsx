import React from 'react';
import type { SkillsProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { createSkillEntry } from '../../../resume-helpers.ts';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import SkillCategory from '../../molecules/SkillCategory';
import styles from './styles.module.css';

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const { addItem } = useResumeEdit();

  return (
    <>
      <h2 className="section-title">{t('sections.skills')}</h2>
      <div className={styles.gridLayout}>
        {skills.map((skill, index) => (
          <SkillCategory key={index} skill={skill} index={index} total={skills.length} />
        ))}
      </div>
      {editMode && (
        <button
          type="button"
          onClick={() => addItem('skills', createSkillEntry())}
          className={styles.add}
        >
          + {t('editor.addSkill')}
        </button>
      )}
    </>
  );
};

export default Skills;
