import React from 'react';
import type { LanguageEntry } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './styles.module.css';

interface LanguageItemProps {
  entry: LanguageEntry;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ entry }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <span className={styles.name}>
        <span className={styles.icon}>🌐</span>
        {t(entry.language)}
      </span>
      <span className={styles.fluency}>
        {t(entry.fluency)}
      </span>
    </div>
  );
};

export default LanguageItem;
