import React from 'react';
import { diffWords } from '../../../resume-diff';
import styles from './styles.module.css';

interface DiffTextProps {
  before: string;
  after: string;
}

// Text as the previewed file has it, with the words it removes struck through
// and the words it adds highlighted
const DiffText: React.FC<DiffTextProps> = ({ before, after }) => {
  const parts = diffWords(before, after);

  if (!parts) {
    return (
      <>
        <del className={styles.removed}>{before}</del> <ins className={styles.added}>{after}</ins>
      </>
    );
  }

  return (
    <>
      {parts.map((part, index) =>
        part.type === 'same' ? (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        ) : part.type === 'added' ? (
          <ins key={index} className={styles.added}>{part.text}</ins>
        ) : (
          <del key={index} className={styles.removed}>{part.text}</del>
        )
      )}
    </>
  );
};

export default DiffText;
