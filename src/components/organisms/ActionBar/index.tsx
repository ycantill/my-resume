import React from 'react';
import PhoneAuth from '../PhoneAuth';
import EditModeToggle from '../../molecules/EditModeToggle';
import SaveIndicator from '../../molecules/SaveIndicator';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import styles from './styles.module.css';

// Screen-only top bar holding page actions; never part of the printed resume
const ActionBar: React.FC = () => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);

  return (
    <header className={styles['action-bar']}>
      <div className={styles['action-bar__inner']}>
        <SaveIndicator />
        <EditModeToggle />
        <PhoneAuth />
      </div>
      {editMode && (
        <div className={styles['action-bar__hint']}>
          {/* Edits land in the language being viewed; the other one is untouched */}
          <span>{t('editor.editing')}</span>
          <span className={styles['action-bar__hint-detail']}>{t('editor.hint')}</span>
        </div>
      )}
    </header>
  );
};

export default ActionBar;
