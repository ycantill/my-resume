import React from 'react';
import styles from '../MyResume.module.css';
import type { ResumeDataError } from '../types.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { formatErrorMessage } from '../types.ts';

interface ErrorStateProps {
  error: ResumeDataError | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  const { language } = useLanguage();
  return (
    <div className={styles.host}>
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <h2>❌ Error al cargar currículum</h2>
          <p>No se pudieron cargar los datos desde Firebase.</p>
          <p>Verifica tu configuración de Firebase y conexión a internet.</p>
          {error && (
            <div>
              <p><strong>Error:</strong> {formatErrorMessage(error, language)}</p>
              <details>
                <summary>Detalles técnicos</summary>
                <p><strong>Código:</strong> {error.code}</p>
                <p><strong>Mensaje original:</strong> {error.message}</p>
                {error.personaId && <p><strong>Persona ID:</strong> {error.personaId}</p>}
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;