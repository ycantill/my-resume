import React from 'react';
import styles from './styles.module.css';

interface EditableDateProps {
  /** A "YYYY-MM" value, or empty when unset */
  value: string;
  onCommit: (next: string) => void;
  label?: string;
}

/**
 * Month picker for the resume's "YYYY-MM" dates. Uses input[type=month] so
 * phones open their native month wheel rather than asking for typed text.
 */
const EditableDate: React.FC<EditableDateProps> = ({ value, onCommit, label }) => (
  <input
    type="month"
    value={value}
    aria-label={label}
    className={styles.field}
    onChange={e => onCommit(e.target.value)}
  />
);

export default EditableDate;
