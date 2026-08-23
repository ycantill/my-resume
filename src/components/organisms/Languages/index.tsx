import React from 'react';
import type { LanguagesProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { createLanguageEntry } from '../../../resume-helpers.ts';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import LanguageItem from '../../molecules/LanguageItem';
import { clsx } from 'clsx';
import styles from './styles.module.css';

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const { addItem } = useResumeEdit();

  return (
    <>
      <h2 className="section-title">{t('sections.languages')}</h2>
      <div className={clsx('section-card', styles.card)}>
        <div className={styles.gridLayout}>
          {languages.map((entry, index) => (
            <LanguageItem key={index} entry={entry} index={index} total={languages.length} />
          ))}
        </div>
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
