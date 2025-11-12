import React from 'react';
import type { LanguagesProps } from '../types.ts';
import { useTranslation } from '../hooks/useTranslation';

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <h2 className="section-title">{t('sections.languages')}</h2>
      <div className="section-card border-l-4 border-indigo-500">
        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((lang, langIndex) => (
            <div key={langIndex} className="flex items-center justify-between bg-indigo-50 rounded-lg p-4">
              <span className="font-medium text-gray-800 flex items-center">
                <span className="mr-3 text-lg">🌐</span>
                {t(lang.language)}
              </span>
              <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full font-medium">
                {t(lang.fluency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Languages;