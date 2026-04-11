import React from 'react';
import type { Skill } from '../../../types.ts';
import Chip from '../../atoms/Chip';
import { clsx } from 'clsx';
import styles from './styles.module.css';

interface SkillCategoryProps {
  skill: Skill;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ skill }) => (
  <div className={clsx('section-card', styles.root)}>
    <h3 className={styles.name}>{skill.name}</h3>
    <div className={styles.chips}>
      {skill.keywords.filter(k => k != null && k !== '').map((k, index) => (
        <Chip key={index} variant="purple">{k}</Chip>
      ))}
    </div>
  </div>
);

export default SkillCategory;
