import React from 'react';
import type { EducationSectionProps } from '../types.ts';

const EducationSection: React.FC<EducationSectionProps> = ({ education, language }) => {
  const t = language;

  return (
    <>
      <h2 className="section-title">{t === 'en' ? 'Education' : 'Educación'}</h2>
      <div className="space-y-6">
        {education.map((edu, eduIndex) => (
          <div key={eduIndex} className="section-card border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">{edu.institution}</h3>
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-medium">
                {t === 'en' ? 'Education' : 'Educación'}
              </span>
            </div>
            <p className="text-gray-700 mb-3 font-medium">
              {edu.studyType[t]} {t === 'en' ? 'in' : 'en'} {edu.area[t]}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <span className="mr-2 text-base">📍</span>
              {edu.location}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default EducationSection;