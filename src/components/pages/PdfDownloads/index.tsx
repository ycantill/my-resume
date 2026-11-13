import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../../../types.ts';
import { SUPPORTED_LANGUAGES } from '../../../types.ts';
import { resolveRouteLocation } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore } from '../../../store/useAppStore';
import Icon from '../../atoms/Icon';
import styles from './styles.module.css';

// Written by scripts/generate-pdfs.mjs at deploy time
interface PdfManifest {
  name: string;
  generatedAt: string;
  files: { language: Language; location: string; file: string }[];
}

const PDF_DIR = `${import.meta.env.BASE_URL}pdfs/`;

interface PdfDownloadsProps {
  initialLanguage: Language;
}

// Lists the PDFs printed for every language and location, to download them or
// hand them to another app through the share sheet on a phone
const PdfDownloads: React.FC<PdfDownloadsProps> = ({ initialLanguage }) => {
  const { t, language } = useTranslation();
  const setLanguage = useAppStore((state) => state.setLanguage);
  const [manifest, setManifest] = useState<PdfManifest | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading');
  // Fetched up front: a share sheet only opens straight from the tap, with no
  // download in between
  const [blobs, setBlobs] = useState<Record<string, Blob>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage, setLanguage]);

  useEffect(() => {
    document.title = t('downloads.title');
  }, [t]);

  useEffect(() => {
    let cancelled = false;

    fetch(`${PDF_DIR}manifest.json`, { cache: 'no-cache' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: PdfManifest | null) => {
        if (cancelled) return;
        if (!data?.files?.length) {
          setStatus('empty');
          return;
        }
        setManifest(data);
        setStatus('ready');

        data.files.forEach(({ file }) => {
          fetch(`${PDF_DIR}${file}`, { cache: 'no-cache' })
            .then((response) => (response.ok ? response.blob() : null))
            .then((blob) => {
              if (!cancelled && blob) setBlobs((prev) => ({ ...prev, [file]: blob }));
            })
            .catch(() => {});
        });
      })
      .catch(() => !cancelled && setStatus('empty'));

    return () => {
      cancelled = true;
    };
  }, []);

  const share = async (file: string, title: string) => {
    const url = new URL(`${PDF_DIR}${file}`, window.location.href).href;
    const blob = blobs[file];
    const pdf = blob && new File([blob], file, { type: 'application/pdf' });

    try {
      if (pdf && navigator.canShare?.({ files: [pdf] })) {
        await navigator.share({ files: [pdf], title });
      } else if (navigator.share) {
        await navigator.share({ url, title });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(file);
        setTimeout(() => setCopied((current) => (current === file ? null : current)), 2000);
      }
    } catch {
      // Closing the share sheet rejects; nothing to do
    }
  };

  // One group per language, the one being viewed first
  const groups = [language, ...SUPPORTED_LANGUAGES.filter((lang) => lang !== language)]
    .map((lang) => ({
      lang,
      files: (manifest?.files ?? []).filter((entry) => entry.language === lang),
    }))
    .filter((group) => group.files.length > 0);

  const updated =
    manifest &&
    new Date(manifest.generatedAt).toLocaleString(language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('downloads.title')}</h1>
        {manifest && <p className={styles.name}>{manifest.name}</p>}
        <p className={styles.subtitle}>{t('downloads.subtitle')}</p>
        {updated && (
          <p className={styles.updated}>{t('downloads.updated').replace('{date}', updated)}</p>
        )}
      </header>

      {status === 'loading' && (
        <div className={styles.skeletons} aria-label={t('downloads.loading')} role="status">
          {[0, 1].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}
      {status === 'empty' && <p className={styles.message}>{t('downloads.empty')}</p>}

      {groups.map((group) => (
        <section key={group.lang} className={styles.group}>
          <h2 className={styles.groupTitle}>{t(`downloads.languages.${group.lang}`)}</h2>
          <ul className={styles.list}>
            {group.files.map(({ language: fileLanguage, location, file }) => {
              const place = resolveRouteLocation(null, location);
              const country = place ? t(place) : location;
              const title = `${t(`downloads.languages.${fileLanguage}`)} · ${country}`;
              const size = blobs[file] && `${Math.round(blobs[file].size / 1024)} KB`;

              return (
                <li key={file} className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.badge} aria-hidden="true">
                      PDF
                    </span>
                    <div className={styles.cardText}>
                      <p className={styles.cardTitle}>{country}</p>
                      <p className={styles.cardMeta}>
                        {size && <span>{size} · </span>}
                        <Link to={`/${fileLanguage}/${location}`} className={styles.online}>
                          {t('downloads.viewOnline')}
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => share(file, title)}
                      className={`${styles.button} ${styles.buttonPrimary}`}
                    >
                      <Icon name="share" />
                      {copied === file ? t('downloads.copied') : t('downloads.share')}
                    </button>
                    <a
                      href={`${PDF_DIR}${file}`}
                      download={file}
                      className={styles.button}
                      aria-label={`${t('downloads.download')} ${title}`}
                    >
                      <Icon name="download" />
                      {t('downloads.download')}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
};

export default PdfDownloads;
