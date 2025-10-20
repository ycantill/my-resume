import React from 'react';
import styles from '../MyResume.module.css';
import type { ResumeBasics, Language } from '../types.ts';
import { formatLocationLabel, normalizePhone } from '../resume-helpers.ts';

interface BasicInfoProps {
  basics: ResumeBasics;
  language: Language;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ basics, language }) => {
  const t = language;
  const { location } = basics;

  return (
    <section className={styles.basics}>
      <div className={styles.basicsHeader}>
        <h1>{basics.name}</h1>
        <p className={styles.subtitle}>{basics.label[t]}</p>
      </div>

      <div className={styles.basicsMeta}>
        <ul className={styles.contactList}>
          <li>
            <span className={styles.icon} aria-hidden="true">✉️</span>
            <a href={`mailto:${basics.email}`}>{basics.email}</a>
          </li>
        </ul>

        <div className={styles.profileLinks}>
          <ul className={styles.contactList}>
            {basics.profiles.map((p, index) => (
              <li key={index}>
                {/linkedin/i.test(p.url)
                  ? <span className={`${styles.icon} ${styles.iconLinkedin}`} aria-hidden="true">in</span>
                  : <span className={styles.icon} aria-hidden="true">🔗</span>}
                <a href={p.url} target="_blank" rel="noopener noreferrer">{p.url}</a>
              </li>
            ))}
          </ul>
        </div>

        <ul className={styles.contactList}>
          {location && (
            <li>
              {location.phone
                ? <>
                    <span className={styles.icon} aria-hidden="true">📞</span>
                    <a href={`tel:${normalizePhone(location.phone)}`}>{location.phone}</a>
                  </>
                : <span className={styles.icon} aria-hidden="true">📍</span>}
              <span className={styles.muted}>{formatLocationLabel(location, t)}</span>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default BasicInfo;