import React from 'react';
import type { ContactProfile } from '../../../types.ts';

interface ProfileLinkProps {
  profile: ContactProfile;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ profile }) => {
  const isLinkedIn = /linkedin/i.test(profile.url);
  const isGitHub = /github/i.test(profile.url);

  return (
    <div className="contact-item">
      {isLinkedIn
        ? <span className="contact-icon-linkedin" aria-hidden="true">in</span>
        : isGitHub
        ? <span className="contact-icon" aria-hidden="true">{'\u{1F4BB}'}</span>
        : <span className="contact-icon" aria-hidden="true">🔗</span>}
      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-link"
      >
        {profile.url.replace(/^https?:\/\/(www\.)?/, '')}
      </a>
    </div>
  );
};

export default ProfileLink;
