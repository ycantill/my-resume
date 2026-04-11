import React from 'react';
import type { LanguageEntry } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';

interface LanguageItemProps {
  entry: LanguageEntry;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ entry }) => {
  const { t } = useTranslation();

  return (
    <div className="language-item">
      <span className="language-name">
        <span className="language-icon">🌐</span>
        {t(entry.language)}
      </span>
      <span className="language-fluency">
        {t(entry.fluency)}
      </span>
    </div>
  );
};

export default LanguageItem;
