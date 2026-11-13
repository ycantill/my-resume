import React from 'react';
import type { LanguagesProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { usePreviewBaseline, removedTail } from '../../../hooks/usePreviewBaseline';
import RemovedEntries from '../../molecules/RemovedEntries';
import { createLanguageEntry } from '../../../resume-helpers.ts';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import LanguageItem from '../../molecules/LanguageItem';
import { clsx } from 'clsx';
import styles from './styles.module.css';

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const { addItem } = useResumeEdit();
  const baseline = usePreviewBaseline();

  return (
    <>
      <h2 className="section-title">{t('sections.languages')}</h2>
      <div className={clsx('section-card', styles.card)}>
        <div className={styles.gridLayout}>
          {languages.map((entry, index) => (
            <LanguageItem key={index} entry={entry} index={index} total={languages.length} />
          ))}
        </div>
        <RemovedEntries entries={removedTail(baseline?.languages, languages)} />
        {editMode && (
          <button
            type="button"
            onClick={() => addItem('languages', createLanguageEntry())}
            className={styles.add}
          >
            + {t('editor.addLanguage')}
          </button>
        )}
      </div>
    </>
  );
};

export default Languages;
