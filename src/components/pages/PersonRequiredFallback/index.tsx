import React from 'react';
import type { Language } from '../../../types';
import { t as translateFn } from '../../../resume-helpers';
import styles from './styles.module.css';

interface PersonRequiredFallbackProps {
  language: Language;
}

const PersonRequiredFallback: React.FC<PersonRequiredFallbackProps> = ({ language }) => {
  // Use language from props (receives it from parent component)
  const t = (textOrKey: any) => translateFn(textOrKey, language);
  
  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            {t('fallback.title')}
          </h1>

          <div className={styles.content}>
            <p>
              {t('fallback.description')}
            </p>

            <div className={styles.instructions}>
              <h3 className={styles.instructionsTitle}>
                {t('fallback.howToSet')}
              </h3>

              <div className={styles.methods}>
                <div>
                  <h4 className={styles.methodTitle}>
                    {t('fallback.forDevelopment')}
                  </h4>
                  <code className={styles.methodCode}>
                    VITE_PERSON=your_person_id npm run dev
                  </code>
                </div>

                <div>
                  <h4 className={styles.methodTitle}>
                    {t('fallback.forBuilding')}
                  </h4>
                  <code className={styles.methodCode}>
                    VITE_PERSON=your_person_id npm run build
                  </code>
                </div>
              </div>
            </div>

            <div className={styles.info}>
              <div className={styles.infoText}>
                <p className={styles.personsDesc}>
                  {t('fallback.availablePersons')}
                </p>
                <p className={styles.personsDetail}>
                  Any person ID configured in your Firebase database under <code className={styles.personsCode}>public/people/</code>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              {t('fallback.securityNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonRequiredFallback;