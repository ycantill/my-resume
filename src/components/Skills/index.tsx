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
            <h3 className="skill-name">{skill.name}</h3>
            <div className="skills">
              {skill.keywords.filter(k => k != null && k !== '').map((k, kIndex) => (
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