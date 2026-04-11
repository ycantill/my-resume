import React from 'react';
import type { BasicInfoProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import ProfileLink from '../../molecules/ProfileLink';
import styles from './styles.module.css';

const BasicInfo: React.FC<BasicInfoProps> = ({ basics }) => {
  const { t } = useTranslation();

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.name}>{basics.name}</h1>
        <p className={styles.label}>{t(basics.label)}</p>
      </div>

      <div className={styles.contact}>
        <div className={styles.contactList}>
          {basics.email && (
            <div className={styles.contactItem}>
              <span className={styles.contactIcon} aria-hidden="true">✉️</span>
              <a href={`mailto:${basics.email}`} className={styles.contactLink}>
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
