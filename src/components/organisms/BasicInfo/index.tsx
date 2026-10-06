import React from 'react';
import type { BasicInfoProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { usePreviewBaseline, removedTail } from '../../../hooks/usePreviewBaseline';
import { withLocalized, profileFromUrl, resolveRouteLocation } from '../../../resume-helpers.ts';
import {
  useAppStore,
  selectEditMode,
  selectContactData,
  selectLocationSlug,
  selectPreview,
} from '../../../store/useAppStore';
import Icon from '../../atoms/Icon';
import ProfileLink from '../../molecules/ProfileLink';
import EditableText from '../../atoms/EditableText';
import DiffText from '../../atoms/DiffText';
import RemovedEntries from '../../molecules/RemovedEntries';
import styles from './styles.module.css';

const BasicInfo: React.FC<BasicInfoProps> = ({ basics }) => {
  const { t, language } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const { updateBasics } = useResumeEdit();
  const baseline = usePreviewBaseline()?.basics;
  const locationSlug = useAppStore(selectLocationSlug);
  const storedContact = useAppStore(selectContactData);
  const previewContact = useAppStore(selectPreview)?.contact;

  // The country comes from the URL (/:language/colombia, /:language/spain), so
  // it shows without a session too
  const location = resolveRouteLocation(
    (previewContact ?? storedContact)?.locations,
    locationSlug
  );

  const profiles = basics.profiles ?? [];

  const updateProfile = (index: number, url: string) =>
    updateBasics({
      profiles: profiles.map((profile, i) => (i === index ? profileFromUrl(url) : profile)),
    });

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <EditableText
          as="h1"
          className={styles.name}
          value={basics.name}
          previous={baseline?.name}
          label={t('editor.name')}
          placeholder={t('editor.name')}
          onCommit={next => updateBasics({ name: next })}
        />
        <EditableText
          as="p"
          className={styles.label}
          value={t(basics.label)}
          previous={baseline ? t(baseline.label) : undefined}
          label={t('editor.jobTitle')}
          placeholder={t('editor.jobTitle')}
          onCommit={next => updateBasics({ label: withLocalized(basics.label, language, next) })}
        />
        {location && (
          <p className={styles.location}>
            <Icon name="pin" className={styles.locationIcon} />
            {t('location.remote')} · {t(location)}
          </p>
        )}
      </div>

      <div className={styles.contact}>
        <div className={styles.contactList}>
          {(basics.email || editMode) && (
            <div className={styles.contactItem}>
              <Icon name="mail" className={styles.contactIcon} />
              {editMode ? (
                <EditableText
                  className={styles.contactLink}
                  value={basics.email ?? ''}
                  label={t('editor.email')}
                  placeholder={t('editor.email')}
                  onCommit={next => updateBasics({ email: next })}
                />
              ) : (
                <a href={`mailto:${basics.email}`} className={styles.contactLink}>
                  {baseline && (baseline.email ?? '') !== (basics.email ?? '') ? (
                    <DiffText before={baseline.email ?? ''} after={basics.email ?? ''} />
                  ) : (
                    basics.email
                  )}
                </a>
              )}
            </div>
          )}
          {profiles.map((profile, index) => (
            <ProfileLink
              key={index}
              profile={profile}
              previousUrl={baseline ? baseline.profiles?.[index]?.url ?? null : undefined}
              onCommit={url => updateProfile(index, url)}
              onRemove={() =>
                updateBasics({ profiles: profiles.filter((_, i) => i !== index) })
              }
            />
          ))}
          {editMode && (
            <button
              type="button"
              onClick={() => updateBasics({ profiles: [...profiles, profileFromUrl('')] })}
              className={styles.addProfile}
            >
              + {t('editor.addProfile')}
            </button>
          )}
        </div>
        <RemovedEntries entries={removedTail(baseline?.profiles, profiles)} />
      </div>
    </section>
  );
};

export default BasicInfo;
