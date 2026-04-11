import React from 'react';
import type { ErrorStateProps } from '../../../types.ts';
import { formatErrorMessage } from '../../../types.ts';
import { t as translateFn } from '../../../resume-helpers.ts';
import styles from './styles.module.css';

const ErrorState: React.FC<ErrorStateProps> = ({ error, language }) => {
  // Use language from props (receives it from parent component)
  const t = (textOrKey: any) => translateFn(textOrKey, language);
  
  // Detectar si el error es por falta de configuración de base de datos
  const isDatabaseConfigError = error?.message?.includes('VITE_DATABASE_URL') || 
                                 error?.message?.includes('environment variable');
  
  if (isDatabaseConfigError) {
    return (
      <div className={styles.configRoot}>
        <div className={styles.configCard}>
          <div className={styles.configHeader}>
            <div className={styles.configIconWrapper}>
              <span className={styles.configIcon}>⚙️</span>
            </div>
            <h2 className={styles.configTitle}>
              {t('databaseConfig.title')}
            </h2>
            <p className={styles.configSubtitle}>
              {t('databaseConfig.subtitle')}
            </p>
          </div>

          <div className={styles.configSetup}>
            <div className={styles.configSetupHeader}>
              <span className={styles.configSetupIcon}>📝</span>
              <div className={styles.configSetupContent}>
                <p className={styles.configSetupTitle}>
                  {t('databaseConfig.howToFix')}
                </p>
                <ol className={styles.configSetupSteps}>
                  <li>{t('databaseConfig.step1')}</li>
                  <li>{t('databaseConfig.step2')}</li>
                  <li>{t('databaseConfig.step3')}</li>
                </ol>
              </div>
            </div>
          </div>

          <div className={styles.configExample}>
            <div className={styles.configExampleHeader}>
              <span className={styles.configExampleIcon}>💡</span>
              <p className={styles.configExampleTitle}>
                {t('databaseConfig.exampleFile')}
              </p>
            </div>
            <pre className={styles.configExampleCode}>
{`VITE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_PERSON=your_person_id`}
            </pre>
            <div className={styles.configExampleFooter}>
              <p className={styles.configExampleDesc}>
                {t('databaseConfig.getConfig')}
              </p>
              <ol className={styles.configExampleSteps}>
                <li>{t('databaseConfig.getConfigStep1')}</li>
                <li>{t('databaseConfig.getConfigStep2')}</li>
                <li>{t('databaseConfig.getConfigStep3')}</li>
                <li>{t('databaseConfig.getConfigStep4')}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error genérico
  return (
    <div className={styles.genericRoot}>
      <div className={styles.genericCard}>
        <div className={styles.genericHeader}>
          <div className={styles.genericIconWrapper}>
            <span className={styles.genericIcon}>⚠️</span>
          </div>
          <h2 className={styles.genericTitle}>
            {t('error.title')}
          </h2>
          <p className={styles.genericSubtitle}>
            {t('error.subtitle')}
          </p>
          <p className={styles.genericCheck}>
            {t('error.checkConfig')}
          </p>
        </div>

        {error && (
          <div className={styles.genericDetails}>
            <div className={styles.genericDetailsHeader}>
              <span className={styles.genericDetailsIcon}>🔍</span>
              <div>
                <p className={styles.genericDetailsLabel}>
                  {t('error.errorDetected')}
                </p>
                <p className={styles.genericDetailsMessage}>{formatErrorMessage(error, language)}</p>
              </div>
            </div>
            <details className={styles.genericDetailsToggle}>
              <summary className={styles.genericDetailsSummary}>
                <span className={styles.genericDetailsSummaryIcon}>📋</span>
                {t('error.technicalDetails')}
              </summary>
              <div className={styles.genericDetailsContent}>
                <p><strong>{t('error.code')}</strong> <code className={styles.genericDetailsCode}>{error.code}</code></p>
                <p><strong>{t('error.message')}</strong> {error.message}</p>
                {error.personId && <p><strong>Person ID:</strong> <code className={styles.genericDetailsCode}>{error.personId}</code></p>}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;