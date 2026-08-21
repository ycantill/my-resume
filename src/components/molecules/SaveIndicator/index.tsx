import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import {
  useAppStore,
  selectEditMode,
  selectSaveState,
  selectSaveError,
} from '../../../store/useAppStore';
import styles from './styles.module.css';

// Save status for the inline editor. A failed write has already been rolled
// back in the store, so the message says the edit did not stick.
const SaveIndicator: React.FC = () => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const saveState = useAppStore(selectSaveState);
  const saveError = useAppStore(selectSaveError);

  if (!editMode || saveState === 'idle') return null;

  if (saveState === 'error') {
    return (
      <span className={styles.error} role="alert" title={saveError ?? undefined}>
        ⚠️ {t('editor.saveError')}
      </span>
    );
  }

  return (
    <span className={styles.status} aria-live="polite">
      {saveState === 'saving' ? t('editor.saving') : `✓ ${t('editor.saved')}`}
    </span>
  );
};

export default SaveIndicator;
