import React from 'react';
import type { LanguageEntry } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { withLocalized } from '../../../resume-helpers.ts';
import EditableText from '../../atoms/EditableText';
import EntryActions from '../EntryActions';
import styles from './styles.module.css';

interface LanguageItemProps {
  entry: LanguageEntry;
  index: number;
  total: number;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ entry, index, total }) => {
  const { t, language } = useTranslation();
  const { updateItem, removeItem, moveItem } = useResumeEdit();

  return (
    <div className={styles.root}>
      <span className={styles.name}>
        <span className={styles.icon}>🌐</span>
        <EditableText
          value={t(entry.language)}
          label={t('editor.language')}
          placeholder={t('editor.language')}
          onCommit={next =>
            updateItem('languages', index, { language: withLocalized(entry.language, language, next) })
          }
        />
      </span>
      <span className={styles.fluency}>
        <EditableText
          value={t(entry.fluency)}
          label={t('editor.fluency')}
          placeholder={t('editor.fluency')}
          onCommit={next =>
            updateItem('languages', index, { fluency: withLocalized(entry.fluency, language, next) })
          }
        />
      </span>
      <EntryActions
        entryLabel={t(entry.language)}
        onMoveUp={index > 0 ? () => moveItem('languages', index, -1) : undefined}
        onMoveDown={index < total - 1 ? () => moveItem('languages', index, 1) : undefined}
        onRemove={() => removeItem('languages', index)}
      />
    </div>
  );
};

export default LanguageItem;
