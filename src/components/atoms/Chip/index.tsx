import React from 'react';
import styles from './styles.module.css';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'purple';
}

const Chip: React.FC<ChipProps> = ({ children, variant = 'default' }) => (
  <span className={variant === 'purple' ? `${styles.chip} ${styles.chipPurple}` : styles.chip}>
    {children}
  </span>
);

export default Chip;
