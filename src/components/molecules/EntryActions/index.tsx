import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import styles from './styles.module.css';

interface EntryActionsProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
  /** Shown in the delete confirmation so it is clear what is going away */
  entryLabel: string;
}

/**
 * Reorder and delete controls for one resume entry. Tap targets are sized for
 * a thumb, and deleting asks first — it is the one action that loses work.
 */
const EntryActions: React.FC<EntryActionsProps> = ({
  onMoveUp,
  onMoveDown,
  onRemove,
  entryLabel,
}) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);

  if (!editMode) return null;

  const handleRemove = () => {
    if (window.confirm(`${t('editor.confirmRemove')} ${entryLabel || t('editor.thisEntry')}`)) {
      onRemove();
    }
  };

  return (
    <div className={styles.root}>
      {onMoveUp && (
        <button
          type="button"
          onClick={onMoveUp}
          className={styles.button}
          aria-label={t('editor.moveUp')}
        >
          ↑
        </button>
      )}
      {onMoveDown && (
        <button
          type="button"
          onClick={onMoveDown}
          className={styles.button}
          aria-label={t('editor.moveDown')}
        >
          ↓
        </button>
      )}
      <button
        type="button"
        onClick={handleRemove}
        className={styles.remove}
        aria-label={t('editor.remove')}
      >
        🗑
      </button>
    </div>
  );
};

export default EntryActions;
