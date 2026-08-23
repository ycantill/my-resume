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
}) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);

  const replaceAt = (index: number, value: string) =>
    onChange(items.map((item, i) => (i === index ? value : item)));

  const removeAt = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index} className={itemClassName}>
          <EditableText
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
