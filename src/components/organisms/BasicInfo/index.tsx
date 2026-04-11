import React from 'react';
import type { BasicInfoProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import ProfileLink from '../../molecules/ProfileLink';
import './styles.css';

const BasicInfo: React.FC<BasicInfoProps> = ({ basics }) => {
  const { t } = useTranslation();

  return (
    <section className="basics">
      <div className="basics-header">
        <h1 className="basics-name">{basics.name}</h1>
        <p className="basics-label">{t(basics.label)}</p>
      </div>

      <div className="contact-info">
        <div className="contact-container">
          {basics.email && (
            <div className="contact-item">
              <span className="contact-icon" aria-hidden="true">✉️</span>
              <a href={`mailto:${basics.email}`} className="contact-link">
                {basics.email}
              </a>
            </div>
          )}
          {basics.profiles.map((profile, index) => (
            <ProfileLink key={index} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
