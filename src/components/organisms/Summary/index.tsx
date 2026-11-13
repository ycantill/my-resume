import React from 'react';
import type { SummaryProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { usePreviewBaseline } from '../../../hooks/usePreviewBaseline';
import { withLocalized } from '../../../resume-helpers.ts';
import EditableText from '../../atoms/EditableText';
import styles from './styles.module.css';

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const { t, language } = useTranslation();
  const { updateBasics } = useResumeEdit();
  const baseline = usePreviewBaseline();

  return (
    <>
      <h2 className="section-title">{t('sections.summary')}</h2>
      <div className="section-card">
        <EditableText
          as="p"
          className={styles.text}
          value={t(summary)}
          previous={baseline ? t(baseline.basics.summary) : undefined}
          multiline
          label={t('editor.summary')}
          onCommit={next => updateBasics({ summary: withLocalized(summary, language, next) })}
        />
      </div>
    </>
  );
};

export default Summary;
