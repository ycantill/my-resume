import React from 'react';
import Icon from '../../atoms/Icon';
import { useTranslation } from '../../../hooks/useTranslation';
import { DEFAULT_LOCATION_SLUG } from '../../../resume-helpers';
import { useAppStore, selectLocationSlug, selectPreview, selectResumeData } from '../../../store/useAppStore';
import styles from './styles.module.css';

// Same names as scripts/generate-pdfs.mjs, e.g. "jane-doe-cv-en-colombia"
const slug = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Prints the version on screen (language, route, unsaved preview and, when
// signed in, the private phone) with the same print stylesheet the deploy
// uses for the public PDFs. The browser's "Save as PDF" names the file after
// the document title, so the title is swapped for the file name meanwhile.
const DownloadPdfButton: React.FC = () => {
  const { t, language } = useTranslation();
  const resumeData = useAppStore(selectResumeData);
  const preview = useAppStore(selectPreview);
  const locationSlug = useAppStore(selectLocationSlug);

  const name = (preview?.data ?? resumeData)?.basics?.name;
  if (!name) return null;

  const handleClick = () => {
    const previousTitle = document.title;
    document.title = `${slug(name)}-cv-${language}-${slug(locationSlug || DEFAULT_LOCATION_SLUG)}`;
    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    window.print();
  };

  return (
    <button type="button" onClick={handleClick} className={styles['download-pdf']}>
      <Icon name="download" className={styles['download-pdf__icon']} />
      {t('downloads.downloadPdf')}
    </button>
  );
};

export default DownloadPdfButton;
