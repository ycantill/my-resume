import React from 'react';
import type { Skill } from '../../../types.ts';
import Chip from '../../atoms/Chip';

interface SkillCategoryProps {
  skill: Skill;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ skill }) => (
  <div className="section-card skill-category">
    <h3 className="skill-name">{skill.name}</h3>
    <div className="skills">
      {skill.keywords.filter(k => k != null && k !== '').map((k, index) => (
        <Chip key={index} variant="purple">{k}</Chip>
      ))}
    </div>
  </div>
);

export default SkillCategory;
