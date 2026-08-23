import React from 'react';
import type { ContactProfile } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import EditableText from '../../atoms/EditableText';
import styles from './styles.module.css';

interface ProfileLinkProps {
  profile: ContactProfile;
  onCommit?: (url: string) => void;
  onRemove?: () => void;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ profile, onCommit, onRemove }) => {
  const { t } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const isLinkedIn = /linkedin/i.test(profile.url);
  const isGitHub = /github/i.test(profile.url);

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
          className={styles.url}
        >
          {profile.url.replace(/^https?:\/\/(www\.)?/, '')}
        </a>
      )}
    </div>
  );
};

export default ProfileLink;
