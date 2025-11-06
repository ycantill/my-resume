import React from 'react';
import type { ErrorStateProps } from '../types.ts';
import { formatErrorMessage } from '../types.ts';

const ErrorState: React.FC<ErrorStateProps> = ({ error, language }) => {
  const t = language;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t === 'en' ? 'Error loading resume' : 'Error al cargar currículum'}
          </h2>
          <p className="text-gray-600 mb-2">
            {t === 'en' 
              ? 'Could not load data from Firebase.' 
              : 'No se pudieron cargar los datos desde Firebase.'
            }
          </p>
          <p className="text-gray-600 mb-6">
            {t === 'en'
              ? 'Please check your Firebase configuration and internet connection.'
              : 'Verifica tu configuración de Firebase y conexión a internet.'
            }
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-3 mb-4">
              <span className="text-red-500 text-xl">🔍</span>
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">
                  {t === 'en' ? 'Error detected:' : 'Error detectado:'}
                </p>
                <p className="text-red-700">{formatErrorMessage(error, language)}</p>
              </div>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-red-800 font-medium hover:text-red-900 flex items-center">
                <span className="mr-2">📋</span>
                {t === 'en' ? 'Technical details' : 'Detalles técnicos'}
              </summary>
              <div className="mt-3 space-y-2 text-red-700 bg-red-100 rounded-lg p-3">
                <p><strong>{t === 'en' ? 'Code:' : 'Código:'}</strong> <code className="bg-red-200 px-1 rounded">{error.code}</code></p>
                <p><strong>{t === 'en' ? 'Message:' : 'Mensaje:'}</strong> {error.message}</p>
                {error.personId && <p><strong>Person ID:</strong> <code className="bg-red-200 px-1 rounded">{error.personId}</code></p>}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;