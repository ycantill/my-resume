import React from 'react';
import Chip from '../../atoms/Chip';
import EditableText from '../../atoms/EditableText';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import styles from './styles.module.css';

interface EditableChipsProps {
  items: string[];
  onChange: (next: string[]) => void;
  variant?: 'default' | 'purple';
  label: string;
}

/**
 * The chip rows — a work entry's tech stack, a skill category's keywords.
 * Each chip is tappable in edit mode, with an × on it and a trailing + chip.
 */
const EditableChips: React.FC<EditableChipsProps> = ({
  items,
  onChange,
  variant = 'default',
  label,
}) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);

  const visible = editMode ? items : items.filter(item => item != null && item !== '');

  // An emptied chip is a deleted chip: there is no other way to remove one by typing
  const replaceAt = (index: number, value: string) =>
    onChange(
      value.trim() === ''
        ? items.filter((_, i) => i !== index)
        : items.map((item, i) => (i === index ? value : item))
    );

  return (
    <>
      {visible.map((item, index) => (
        <span key={index} className={styles.slot}>
          <Chip variant={variant}>
            <EditableText
              value={item}
              placeholder={t('editor.chipPlaceholder')}
              label={label}
              onCommit={next => replaceAt(index, next)}
            />
          </Chip>
          {editMode && (
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className={styles.remove}
              aria-label={t('editor.remove')}
            >
              ✕
            </button>
          )}
        </span>
      ))}
      {editMode && (
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className={styles.add}
          aria-label={label}
        >
          + {t('editor.add')}
        </button>
      )}
    </>
  );
};

export default EditableChips;
