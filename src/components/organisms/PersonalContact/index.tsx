import React, { useEffect } from 'react';
import type { PersonalContactProps } from '../../../types.ts';
import { findLocationBySlug, formatLocationLabel, normalizePhone } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectAuthToken, selectContactData, selectLocationSlug } from '../../../store/useAppStore';
import { getPersonContactData } from '../../../api-service';
import { signOutUser } from '../../../firebase-auth';
import PhoneAuth from '../PhoneAuth';
import styles from './styles.module.css';

const PersonalContact: React.FC<PersonalContactProps> = () => {
  const { t, language } = useTranslation();
  const authToken = useAppStore(selectAuthToken);
  const contactData = useAppStore(selectContactData);
  const locationSlug = useAppStore(selectLocationSlug);
  const setContactData = useAppStore(state => state.setContactData);
  const setAuthToken = useAppStore(state => state.setAuthToken);

  // Fetch private data whenever auth token becomes available
  useEffect(() => {
    if (!authToken) return;
    getPersonContactData(authToken).then(data => setContactData(data));
  }, [authToken, setContactData]);

  const handleSignOut = async () => {
    await signOutUser();
    setContactData(null);
    setAuthToken(null);
  };

  const location = findLocationBySlug(contactData?.locations, locationSlug);

  return (
    <div className={styles['personal-contact']}>
      <div className={styles['personal-contact__wrapper']}>

        {authToken ? (
          /* ── Authenticated: show contact info ── */
          <>
            {location?.phone && (
              <div className={styles['personal-contact__item']}>
                <span className={styles['personal-contact__icon']} aria-hidden="true">📞</span>
                <a href={`tel:${normalizePhone(location.phone)}`} className={styles['personal-contact__link']}>
                  {location.phone}
                </a>
              </div>
            )}

            {location && (
              <>
                {location?.phone && <span className={styles['personal-contact__divider']}>•</span>}
                <div className={styles['personal-contact__item']}>
                  <span className={styles['personal-contact__icon']} aria-hidden="true">📍</span>
                  <span className={styles['personal-contact__location']}>{formatLocationLabel(location, language)}</span>
                  {location.timezone && (
                    <span className={styles['personal-contact__timezone']}>({location.timezone})</span>
                  )}
                </div>
              </>
            )}

            <span className={styles['personal-contact__divider']}>•</span>
            <button onClick={handleSignOut} className={styles['personal-contact__sign-out']}>
              {t('contact.signOut')}
            </button>
          </>

        ) : (
          <PhoneAuth />
        )}

      </div>
    </div>
  );
};

export default PersonalContact;
