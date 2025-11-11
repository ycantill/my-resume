import React from 'react';
import type { ErrorStateProps } from '../types.ts';
import { formatErrorMessage } from '../types.ts';

const ErrorState: React.FC<ErrorStateProps> = ({ error, language }) => {
  const t = language;
  
  // Detectar si el error es por falta de configuración de Firebase
  const isFirebaseConfigError = error?.message?.includes('VITE_FIREBASE_CONFIG') || 
                                 error?.message?.includes('environment variable');
  
  if (isFirebaseConfigError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-500 text-4xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {t === 'en' ? 'Firebase Configuration Missing' : 'Configuración de Firebase Faltante'}
            </h2>
            <p className="text-gray-600 mb-6">
              {t === 'en' 
                ? 'The VITE_FIREBASE_CONFIG environment variable is not defined.' 
                : 'La variable de entorno VITE_FIREBASE_CONFIG no está definida.'
              }
            </p>
          </div>
          
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <span className="text-orange-500 text-xl">📝</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-800 mb-3">
                  {t === 'en' ? 'How to fix:' : 'Cómo solucionarlo:'}
                </p>
                <ol className="text-sm text-orange-900 space-y-2 list-decimal list-inside">
                  <li>{t === 'en' ? 'Create a .env.local file in the project root' : 'Crea un archivo .env.local en la raíz del proyecto'}</li>
                  <li>{t === 'en' ? 'Add your Firebase configuration as a JSON string' : 'Agrega tu configuración de Firebase como un string JSON'}</li>
                  <li>{t === 'en' ? 'Restart the development server' : 'Reinicia el servidor de desarrollo'}</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start space-x-3 mb-3">
              <span className="text-gray-600 text-xl">💡</span>
              <p className="text-sm font-semibold text-gray-800">
                {t === 'en' ? 'Example .env.local file:' : 'Ejemplo de archivo .env.local:'}
              </p>
            </div>
            <pre className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto text-xs font-mono">
{`# Firebase Configuration (Single JSON string)
VITE_FIREBASE_CONFIG={"apiKey":"YOUR_API_KEY","authDomain":"your-project.firebaseapp.com","databaseURL":"https://your-project-default-rtdb.firebaseio.com","projectId":"your-project-id","storageBucket":"your-project.firebasestorage.app","messagingSenderId":"123456789012","appId":"1:123456789012:web:abcdef1234567890abcdef","measurementId":"G-XXXXXXXXXX"}

# Application Configuration
VITE_PERSON=yohany

# Privacy Configuration (Development Only)
VITE_SHOW_PRIVATE_INFO=false`}
            </pre>
            <div className="mt-4 text-sm text-gray-600">
              <p className="mb-2">
                {t === 'en' ? '📌 Get your Firebase config from:' : '📌 Obtén tu configuración de Firebase desde:'}
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4 text-xs">
                <li>{t === 'en' ? 'Firebase Console → Your Project' : 'Consola de Firebase → Tu Proyecto'}</li>
                <li>{t === 'en' ? 'Project Settings ⚙️ → General' : 'Configuración del Proyecto ⚙️ → General'}</li>
                <li>{t === 'en' ? 'Scroll to "Your apps" section' : 'Desplázate a la sección "Tus apps"'}</li>
                <li>{t === 'en' ? 'Copy the firebaseConfig object and stringify it' : 'Copia el objeto firebaseConfig y conviértelo a string'}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error genérico de Firebase
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