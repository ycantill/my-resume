import React from 'react';
import type { Skill } from '../../../types.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { usePreviewBaseline } from '../../../hooks/usePreviewBaseline';
import EditableText from '../../atoms/EditableText';
import EditableChips from '../EditableChips';
import EntryActions from '../EntryActions';
import { clsx } from 'clsx';
import styles from './styles.module.css';

interface SkillCategoryProps {
  skill: Skill;
  index: number;
  total: number;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ skill, index, total }) => {
  const { t } = useTranslation();
  const { updateItem, removeItem, moveItem } = useResumeEdit();
  const baseline = usePreviewBaseline();
  const prev = baseline ? baseline.skills[index] : undefined;

  return (
    <div className={clsx('section-card', styles.root, baseline && !prev && 'diff-added-block')}>
      <div className={styles.header}>
        <EditableText
          as="h3"
          className={styles.name}
          value={skill.name}
          previous={prev?.name}
          label={t('editor.skillName')}
          placeholder={t('editor.skillName')}
          onCommit={next => updateItem('skills', index, { name: next })}
        />
        <EntryActions
          entryLabel={skill.name}
          onMoveUp={index > 0 ? () => moveItem('skills', index, -1) : undefined}
          onMoveDown={index < total - 1 ? () => moveItem('skills', index, 1) : undefined}
          onRemove={() => removeItem('skills', index)}
        />
      </div>
      <div className={styles.chips}>
        <EditableChips
          items={skill.keywords ?? []}
          previous={prev ? prev.keywords ?? [] : undefined}
          variant="purple"
          label={t('editor.keyword')}
          onChange={next => updateItem('skills', index, { keywords: next })}
        />
      </div>
    </div>
  );
};

export default SkillCategory;
