import React from 'react';
import EditableText from '../../atoms/EditableText';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import styles from './styles.module.css';

interface EditableListProps {
  items: string[];
  onChange: (next: string[]) => void;
  className?: string;
  itemClassName?: string;
  /** The bullets Firebase holds while a file is previewed */
  previous?: string[];
}

/**
 * A bulleted list of strings — the work highlights — where each bullet is
 * tappable and edit mode adds controls to append and delete bullets.
 */
const EditableList: React.FC<EditableListProps> = ({
  items,
  onChange,
  className,
  itemClassName,
  previous,
}) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);

  const replaceAt = (index: number, value: string) =>
    onChange(items.map((item, i) => (i === index ? value : item)));

  const removeAt = (index: number) => onChange(items.filter((_, i) => i !== index));

  // Bullets are matched by text: an edited bullet reads as one removed, one added
  const removed = previous ? previous.filter(item => !items.includes(item)) : [];
  const isAdded = (item: string) => previous !== undefined && !previous.includes(item);

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index} className={itemClassName}>
          <EditableText
            className={isAdded(item) ? 'diff-added-inline' : undefined}
            value={item}
            multiline
            placeholder={t('editor.highlightPlaceholder')}
            label={t('editor.highlight')}
            onCommit={next => replaceAt(index, next)}
          />
          {editMode && (
            <button
              type="button"
              onClick={() => removeAt(index)}
              className={styles.remove}
              aria-label={t('editor.removeHighlight')}
            >
              ✕
            </button>
          )}
        </li>
      ))}
      {removed.map((item, index) => (
        <li key={`removed-${index}`} className={`${itemClassName ?? ''} print:hidden`}>
          <span className="diff-removed-inline">{item}</span>
        </li>
      ))}
      {editMode && (
        <li className={styles.addRow}>
          <button type="button" onClick={() => onChange([...items, ''])} className={styles.add}>
            + {t('editor.addHighlight')}
          </button>
        </li>
      )}
    </ul>
  );
};

export default EditableList;
