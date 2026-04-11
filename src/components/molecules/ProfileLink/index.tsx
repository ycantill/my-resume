import React from 'react';
import type { ContactProfile } from '../../../types.ts';
import styles from './styles.module.css';

interface ProfileLinkProps {
  profile: ContactProfile;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ profile }) => {
  const isLinkedIn = /linkedin/i.test(profile.url);
  const isGitHub = /github/i.test(profile.url);

  return (
    <div className={styles.root}>
      {isLinkedIn
        ? <span className={styles.iconLinkedin} aria-hidden="true">in</span>
        : isGitHub
        ? <span className={styles.icon} aria-hidden="true">{'💻'}</span>
        : <span className={styles.icon} aria-hidden="true">🔗</span>}
      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.url}
      >
        {profile.url.replace(/^https?:\/\/(www\.)?/, '')}
      </a>
    </div>
  );
};

export default ProfileLink;

