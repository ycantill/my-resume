import React from 'react';
import './styles.css';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'purple';
}

const Chip: React.FC<ChipProps> = ({ children, variant = 'default' }) => (
  <span className={`chip${variant === 'purple' ? ' chip-purple' : ''}`}>
    {children}
  </span>
);

export default Chip;
