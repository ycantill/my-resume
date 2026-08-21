import React from 'react';
import PhoneAuth from '../PhoneAuth';
import styles from './styles.module.css';

// Screen-only top bar holding page actions; never part of the printed resume
const ActionBar: React.FC = () => (
  <header className={styles['action-bar']}>
    <div className={styles['action-bar__inner']}>
      <PhoneAuth />
    </div>
  </header>
);

export default ActionBar;
