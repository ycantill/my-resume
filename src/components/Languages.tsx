import React from 'react';
import type { LanguageEntry } from '../types.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface LanguagesProps {
  languages: LanguageEntry[];
}

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  const { language } = useLanguage();
  const t = language;

  return (
    <>
      <h2 className="section-title">{t === 'en' ? 'Languages' : 'Idiomas'}</h2>
      <div className="section-card border-l-4 border-indigo-500">
        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((lang, langIndex) => (
            <div key={langIndex} className="flex items-center justify-between bg-indigo-50 rounded-lg p-4">
              <span className="font-medium text-gray-800 flex items-center">
                <span className="mr-3 text-lg">🌐</span>
                {lang.language[t]}
              </span>
              <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full font-medium">
                {lang.fluency[t]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Languages;