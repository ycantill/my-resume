import React from 'react';
import styles from '../MyResume.module.css';

interface LoadingStateProps {}

const LoadingState: React.FC<LoadingStateProps> = () => {
  return (
    <div className={styles.host}>
      <div className={styles.container}>
        <div className={styles.loadingMessage}>
          <h2>Cargando currículum...</h2>
          <p>Obteniendo datos desde Firebase Realtime Database...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;