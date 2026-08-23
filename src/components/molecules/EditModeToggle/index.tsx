import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectAuthToken, selectEditMode } from '../../../store/useAppStore';
import styles from './styles.module.css';

// Only the signed-in owner sees this; the database rules are what actually
// authorize the write, this just keeps the control out of a visitor's way.
const EditModeToggle: React.FC = () => {
  const { t } = useTranslation();
  const authToken = useAppStore(selectAuthToken);
  const editMode = useAppStore(selectEditMode);
  const setEditMode = useAppStore(state => state.setEditMode);

  if (!authToken) return null;

  return (
    <button
      onClick={() => setEditMode(!editMode)}
      className={editMode ? styles['edit-toggle--active'] : styles['edit-toggle']}
    >
      {editMode ? t('editor.done') : `✏️ ${t('editor.edit')}`}
    </button>
  );
};

export default EditModeToggle;
