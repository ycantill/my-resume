import React from 'react';
import PhoneAuth from '../PhoneAuth';
import EditModeToggle from '../../molecules/EditModeToggle';
import SaveIndicator from '../../molecules/SaveIndicator';
import JsonPreviewLoader from '../../molecules/JsonPreviewLoader';
import DownloadPdfButton from '../../molecules/DownloadPdfButton';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectEditModeOn, selectPreview } from '../../../store/useAppStore';
import styles from './styles.module.css';

// Screen-only top bar holding page actions; never part of the printed resume
const ActionBar: React.FC = () => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditModeOn);
  const preview = useAppStore(selectPreview);

  return (
    <header className={styles['action-bar']}>
      <div className={styles['action-bar__inner']}>
        <SaveIndicator />
        <JsonPreviewLoader />
        <EditModeToggle />
        <PhoneAuth />
        <DownloadPdfButton />
      </div>
      {editMode && preview && (
        <div className={styles['action-bar__preview']} role="status">
          {/* The page below is the file, not the database; inline editing is off */}
          <span className={styles['action-bar__preview-file']}>
            {t('editor.preview.showing')} <strong>{preview.fileName}</strong>
          </span>
          <span className={styles['action-bar__preview-detail']}>{t('editor.preview.notSaved')}</span>
        </div>
      )}
      {editMode && !preview && (
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
