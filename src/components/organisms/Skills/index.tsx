import React from 'react';
import type { SkillsProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import SkillCategory from '../../molecules/SkillCategory';
import './styles.css';

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="section-title">{t('sections.skills')}</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <SkillCategory key={index} skill={skill} />
        ))}
      </div>
    </>
  );
};

export default Skills;