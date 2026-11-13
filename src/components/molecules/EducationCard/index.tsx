import React from 'react';
import type { Education } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { usePreviewBaseline } from '../../../hooks/usePreviewBaseline';
import { withLocalized } from '../../../resume-helpers.ts';
import EditableText from '../../atoms/EditableText';
import EntryActions from '../EntryActions';
import { clsx } from 'clsx';
import Icon from '../../atoms/Icon';
import styles from './styles.module.css';

interface EducationCardProps {
  education: Education;
  index: number;
  total: number;
}

const EducationCard: React.FC<EducationCardProps> = ({ education, index, total }) => {
  const { t, language } = useTranslation();
  const { updateItem, removeItem, moveItem } = useResumeEdit();
  const baseline = usePreviewBaseline();
  // While previewing: the school Firebase holds at this position, if any
  const prev = baseline ? baseline.education[index] : undefined;

  return (
    <div className={clsx('section-card', styles.root, baseline && !prev && 'diff-added-block')}>
      <div className={styles.header}>
        <EditableText
          as="h3"
          className={styles.institution}
          value={education.institution}
          previous={prev?.institution}
          label={t('editor.institution')}
          placeholder={t('editor.institution')}
          onCommit={next => updateItem('education', index, { institution: next })}
        />
        <span className={styles.badge}>
          {t('education.label')}
        </span>
        <EntryActions
          entryLabel={education.institution}
          onMoveUp={index > 0 ? () => moveItem('education', index, -1) : undefined}
          onMoveDown={index < total - 1 ? () => moveItem('education', index, 1) : undefined}
          onRemove={() => removeItem('education', index)}
        />
      </div>
      <p className={styles.degree}>
        <EditableText
          value={t(education.studyType)}
          previous={prev ? t(prev.studyType) : undefined}
          label={t('editor.studyType')}
          placeholder={t('editor.studyType')}
          onCommit={next =>
            updateItem('education', index, {
              studyType: withLocalized(education.studyType, language, next),
            })
          }
        />
        {' '}{t('work.in')}{' '}
        <EditableText
          value={t(education.area)}
          previous={prev ? t(prev.area) : undefined}
          label={t('editor.area')}
          placeholder={t('editor.area')}
          onCommit={next =>
            updateItem('education', index, { area: withLocalized(education.area, language, next) })
          }
        />
      </p>
      <p className={styles.location}>
        <Icon name="pin" className={styles.locationIcon} />
        <EditableText
          value={education.location}
          previous={prev?.location}
          label={t('editor.location')}
          placeholder={t('editor.location')}
          onCommit={next => updateItem('education', index, { location: next })}
        />
      </p>
    </div>
  );
};

export default EducationCard;
