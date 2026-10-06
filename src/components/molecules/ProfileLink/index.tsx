import React from 'react';
import { clsx } from 'clsx';
import type { ContactProfile } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import EditableText from '../../atoms/EditableText';
import DiffText from '../../atoms/DiffText';
import styles from './styles.module.css';

interface ProfileLinkProps {
  profile: ContactProfile;
  onCommit?: (url: string) => void;
  onRemove?: () => void;
  /** While previewing: the URL Firebase holds here, or null when the file adds this link */
  previousUrl?: string | null;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ profile, onCommit, onRemove, previousUrl }) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const isLinkedIn = /linkedin/i.test(profile.url);
  const isGitHub = /github/i.test(profile.url);
  const trim = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

  return (
    <div className={styles.root}>
      {isLinkedIn
        ? <span className={styles.iconLinkedin} aria-hidden="true">in</span>
        : isGitHub
        ? <span className={styles.icon} aria-hidden="true">{'💻'}</span>
        : <span className={styles.icon} aria-hidden="true">🔗</span>}
      {editMode && onCommit ? (
        <>
          {/* The full URL is what gets edited; the link text is only a display trim */}
          <EditableText
            className={styles.url}
            value={profile.url}
            label={t('editor.profileUrl')}
            placeholder={t('editor.profileUrl')}
            onCommit={onCommit}
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className={styles.remove}
              aria-label={t('editor.remove')}
            >
              ✕
            </button>
          )}
        </>
      ) : (
        <a
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(styles.url, previousUrl === null && 'diff-added-inline')}
        >
          {previousUrl && previousUrl !== profile.url ? (
            <DiffText before={trim(previousUrl)} after={trim(profile.url)} />
          ) : (
            trim(profile.url)
          )}
        </a>
      )}
    </div>
  );
};

export default ProfileLink;
