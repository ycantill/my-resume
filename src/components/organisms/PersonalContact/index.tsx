import React, { useEffect } from 'react';
import type { PersonalContactProps } from '../../../types.ts';
import { findLocationBySlug, normalizePhone } from '../../../resume-helpers.ts';
import { useAppStore, selectAuthToken, selectContactData, selectLocationSlug } from '../../../store/useAppStore';
import { getPersonContactData } from '../../../api-service';
import styles from './styles.module.css';

const PersonalContact: React.FC<PersonalContactProps> = () => {
  const authToken = useAppStore(selectAuthToken);
  const contactData = useAppStore(selectContactData);
  const locationSlug = useAppStore(selectLocationSlug);
  const setContactData = useAppStore(state => state.setContactData);

  // Fetch private data whenever auth token becomes available
  useEffect(() => {
    if (!authToken) return;
    getPersonContactData(authToken).then(data => setContactData(data));
  }, [authToken, setContactData]);

  // The location slug in the URL decides which phone number to show
  const phone = findLocationBySlug(contactData?.locations, locationSlug)?.phone;

  if (!phone) return null;

  return (
    <div className={styles['personal-contact']}>
      <span className={styles['personal-contact__icon']} aria-hidden="true">📞</span>
      <a href={`tel:${normalizePhone(phone)}`} className={styles['personal-contact__link']}>
        {phone}
      </a>
    </div>
  );
};

export default PersonalContact;
