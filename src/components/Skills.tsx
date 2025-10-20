import React from 'react';
import styles from '../MyResume.module.css';
import type { Skill } from '../types.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const { language } = useLanguage();
  const t = language;

  return (
    <>
      <h2>{t === 'en' ? 'Technical Skills' : 'Habilidades Técnicas'}</h2>
      {skills.map((skill, skillIndex) => (
        <div key={skillIndex} className={`${styles.sectionCard} ${styles.skillCategory}`}>
          <h3 className={styles.skillCategoryName}>{skill.name}</h3>
          <span className={styles.skillLevel}>{skill.level[t]}</span>
          <div className={styles.skills}>
            {skill.keywords.map((k, kIndex) => (
              <span key={kIndex} className={styles.chip}>{k}</span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Skills;