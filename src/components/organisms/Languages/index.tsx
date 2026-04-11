import React from 'react';
import type { LanguagesProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import LanguageItem from '../../molecules/LanguageItem';
import './styles.css';

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="section-title">{t('sections.languages')}</h2>
      <div className="section-card languages-card">
        <div className="languages-grid">
          {languages.map((entry, index) => (
            <LanguageItem key={index} entry={entry} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Languages;