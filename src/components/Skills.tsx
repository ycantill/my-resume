import React from 'react';
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
      <h2 className="section-title">{t === 'en' ? 'Technical Skills' : 'Habilidades Técnicas'}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((skill, skillIndex) => (
          <div key={skillIndex} className="section-card skill-category border-l-4 border-purple-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">{skill.name}</h3>
              <span className="skill-level bg-purple-100 text-purple-800">{skill.level[t]}</span>
            </div>
            <div className="skills">
              {skill.keywords.map((k, kIndex) => (
                <span key={kIndex} className="chip bg-purple-50 text-purple-700 border-purple-200">{k}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Skills;