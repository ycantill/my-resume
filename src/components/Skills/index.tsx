import React from 'react';
import type { SkillsProps } from '../../types.ts';
import { useTranslation } from '../../hooks/useTranslation';
import './styles.css';

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <h2 className="section-title">{t('sections.skills')}</h2>
      <div className="skills-grid">
        {skills.map((skill, skillIndex) => (
          <div key={skillIndex} className="section-card skill-category">
            <div className="skill-header">
              <h3 className="skill-name">{skill.name}</h3>
              <span className="skill-level">{t(skill.level)}</span>
            </div>
            <div className="skills">
              {skill.keywords.map((k, kIndex) => (
                <span key={kIndex} className="chip chip-purple">{k}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Skills;