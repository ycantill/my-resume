import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import styles from './styles.module.css';

interface EditableTextProps {
  value: string;
  onCommit: (next: string) => void;
  /** Element to render as, so the field keeps the typography around it */
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  label?: string;
}

/**
 * A piece of resume text that becomes an input when tapped in edit mode.
 *
 * Outside edit mode it renders exactly what it wrapped before, so the read-only
 * resume is untouched. The input inherits its font from the element around it —
 * the text does not jump when it turns into a field.
 */
const EditableText: React.FC<EditableTextProps> = ({
  value,
  onCommit,
  as: Tag = 'span',
  className,
  multiline = false,
  placeholder,
  label,
}) => {
  const editMode = useAppStore(selectEditMode);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  // Track outside changes (a save landing, or switching language) while idle
  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  // Grow the textarea with its content instead of scrolling inside a fixed box
  useEffect(() => {
    const field = fieldRef.current;
    if (!editing || !multiline || !field) return;
    field.style.height = 'auto';
    field.style.height = `${field.scrollHeight}px`;
  }, [editing, draft, multiline]);

  if (!editMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (!editing) {
    const startEditing = () => setEditing(true);
    return (
      <Tag
        className={clsx(
          className,
          styles.target,
          multiline ? styles.targetBlock : styles.targetInline,
          !value && styles.empty
        )}
        onClick={startEditing}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startEditing();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={label}
      >
        {value || placeholder || ''}
      </Tag>
    );
  }

  const commit = () => {
    setEditing(false);
    if (draft !== value) onCommit(draft);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
    // In a paragraph Enter should commit; in a multiline field it is a newline
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      commit();
    }
  };

  const fieldProps = {
    ref: fieldRef,
    value: draft,
    autoFocus: true,
    placeholder,
    'aria-label': label,
    className: styles.field,
    onBlur: commit,
    onKeyDown: handleKeyDown,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(e.target.value),
  };

  return (
    <Tag className={className}>
      {multiline ? <textarea rows={1} {...fieldProps} /> : <input type="text" {...fieldProps} />}
    </Tag>
  );
};

export default EditableText;
