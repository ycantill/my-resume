import React from 'react';
import type { LoadingStateProps } from '../../../types.ts';
import { t as translateFn } from '../../../resume-helpers.ts';
import styles from './styles.module.css';

const LoadingState: React.FC<LoadingStateProps> = ({ language }) => {
  // Use language from props (receives it from parent component)
  const t = (textOrKey: any) => translateFn(textOrKey, language);
  
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerInner}>
            <div className={styles.spinnerDot}></div>
          </div>
        </div>
        <h2 className={styles.title}>
          {t('loading.title')}
        </h2>
        <p className={styles.subtitle}>
          {t('loading.subtitle')}
        </p>
        <div className={styles.dots}>
          <div className={styles.dot}></div>
          <div className={styles.dot} style={{animationDelay: '0.1s'}}></div>
          <div className={styles.dot} style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;