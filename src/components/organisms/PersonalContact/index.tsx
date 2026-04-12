import React, { useEffect } from 'react';
import type { PersonalContactProps } from '../../../types.ts';
import { formatLocationLabel, normalizePhone } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectAuthToken, selectContactData } from '../../../store/useAppStore';
import { getPersonContactData } from '../../../api-service';
import { signOutUser } from '../../../firebase-auth';
import PhoneAuth from '../PhoneAuth';
import styles from './styles.module.css';

const PersonalContact: React.FC<PersonalContactProps> = () => {
  const { t, language } = useTranslation();
  const authToken = useAppStore(selectAuthToken);
  const contactData = useAppStore(selectContactData);
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

  const location = contactData?.location;

  return (
    <div className={styles['personal-contact']}>
      <div className={styles['personal-contact__wrapper']}>

        {authToken ? (
          /* ── Authenticated: show contact info ── */
          <>
            {contactData?.phone && (
              <div className={styles['personal-contact__item']}>
                <span className={styles['personal-contact__icon']} aria-hidden="true">📞</span>
                <a href={`tel:${normalizePhone(contactData.phone)}`} className={styles['personal-contact__link']}>
                  {contactData.phone}
                </a>
              </div>
            )}

            {location && (
              <>
                {contactData?.phone && <span className={styles['personal-contact__divider']}>•</span>}
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
