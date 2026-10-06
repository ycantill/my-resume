import React, { useRef, useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectEditModeOn, selectPreview } from '../../../store/useAppStore';
import { parseResumeJson, ResumeImportError } from '../../../resume-import';
import styles from './styles.module.css';

// Loads a resume JSON file in edit mode to see it on the page before anything
// reaches the database. The preview lives in the store only and is never saved.
const JsonPreviewLoader: React.FC = () => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditModeOn);
  const preview = useAppStore(selectPreview);
  const setPreview = useAppStore(state => state.setPreview);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<{ message: string; details: string[] } | null>(null);

  if (!editMode) return null;

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Clearing the input lets the same file be picked again after fixing it
    event.target.value = '';
    if (!file) return;

    try {
      const { data, contact } = parseResumeJson(await file.text());
      setPreview({ fileName: file.name, data, contact });
      setError(null);
      window.scrollTo({ top: 0 });
    } catch (err) {
      const key = err instanceof ResumeImportError ? err.message : 'invalidJson';
      setError({
        message: t(`editor.preview.${key}`),
        details: err instanceof ResumeImportError ? err.details : [],
      });
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={styles['preview-loader']}
      >
        {preview ? t('editor.preview.loadAnother') : `📄 ${t('editor.preview.load')}`}
      </button>
      {preview && (
        <button
          type="button"
          onClick={() => setPreview(null)}
          className={styles['preview-loader--discard']}
        >
          {t('editor.preview.discard')}
        </button>
      )}
      {error && (
        <div className={styles['preview-loader__error']} role="alert">
          <div className={styles['preview-loader__error-head']}>
            <strong>{error.message}</strong>
            <button
              type="button"
              onClick={() => setError(null)}
              className={styles['preview-loader__close']}
              aria-label={t('editor.preview.dismiss')}
            >
              ✕
            </button>
          </div>
          {error.details.length > 0 && (
            <ul className={styles['preview-loader__details']}>
              {error.details.slice(0, 8).map(detail => (
                <li key={detail}>{detail}</li>
              ))}
              {error.details.length > 8 && (
                <li>{t('editor.preview.moreErrors').replace('{count}', String(error.details.length - 8))}</li>
              )}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default JsonPreviewLoader;
