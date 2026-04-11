import React from 'react';
import type { PersonalContactProps } from '../../../types.ts';
import { formatLocationLabel, normalizePhone } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './styles.module.css';

/**
 * PersonalContact Component
 * Displays private contact information (phone, location)
 * Only renders if VITE_SHOW_PRIVATE_INFO environment variable is set to 'true'
 */
const PersonalContact: React.FC<PersonalContactProps> = ({ personal }) => {
  const { language } = useTranslation();
  const { location } = personal;

  // Only render if environment variable is set
  const showPrivateInfo = import.meta.env.VITE_SHOW_PRIVATE_INFO === 'true';
  
  if (!showPrivateInfo) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>

        {/* Phone */}
        {personal.phone && (
          <div className={styles.item}>
            <span className={styles.icon} aria-hidden="true">📞</span>
            <a
              href={`tel:${normalizePhone(personal.phone)}`}
              className={styles.link}
            >
              {personal.phone}
            </a>
          </div>
        )}

        {/* Location */}
        {location && (
          <>
            {personal.phone && <span className={styles.divider}>•</span>}
            <div className={styles.item}>
              <span className={styles.icon} aria-hidden="true">📍</span>
              <span className={styles.location}>{formatLocationLabel(location, language)}</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PersonalContact;
