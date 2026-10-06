import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { summarizeEntry } from '../../../resume-diff';
import styles from './styles.module.css';

interface RemovedEntriesProps {
  entries: unknown[];
}

// Entries Firebase has and the previewed file drops, struck through where the
// section ends so the preview still shows what saving would delete
const RemovedEntries: React.FC<RemovedEntriesProps> = ({ entries }) => {
  const { t, language } = useTranslation();
  if (entries.length === 0) return null;

  return (
    <div className={styles.root}>
      {entries.map((entry, index) => (
        <div key={index} className={styles.entry}>
          <span className={styles.label}>{t('editor.diff.removed')}:</span>{' '}
          <del className={styles.text}>{summarizeEntry(entry, language)}</del>
        </div>
      ))}
    </div>
  );
};

export default RemovedEntries;
