import React from 'react';
import type { EducationSectionProps } from '../types.ts';
import { useTranslation } from '../hooks/useTranslation';

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <h2 className="section-title">{t('sections.education')}</h2>
      <div className="space-y-6">
        {education.map((edu, eduIndex) => (
          <div key={eduIndex} className="section-card border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">{edu.institution}</h3>
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-medium">
                {t('education.label')}
              </span>
            </div>
            <p className="text-gray-700 mb-3 font-medium">
              {t(edu.studyType)} {t('work.in')} {t(edu.area)}
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