import React from 'react';
import type { SummaryProps } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { withLocalized } from '../../../resume-helpers.ts';
import EditableText from '../../atoms/EditableText';
import styles from './styles.module.css';

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const { t, language } = useTranslation();
  const { updateBasics } = useResumeEdit();

  return (
    <>
      <h2 className="section-title">{t('sections.summary')}</h2>
      <div className="section-card">
        <EditableText
          as="p"
          className={styles.text}
          value={t(summary)}
          multiline
          label={t('editor.summary')}
          onCommit={next => updateBasics({ summary: withLocalized(summary, language, next) })}
        />
      </div>
    </>
  );
};

export default Summary;
