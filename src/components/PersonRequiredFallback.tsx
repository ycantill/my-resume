import React from 'react';
import type { Language } from '../types';

interface PersonRequiredFallbackProps {
  language: Language;
}

const PersonRequiredFallback: React.FC<PersonRequiredFallbackProps> = ({ language }) => {
  const t = language;
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t === 'en' ? 'Person Required' : 'Persona Requerida'}
          </h1>
          
          <div className="text-left space-y-4 text-gray-700">
            <p>
              {t === 'en' 
                ? 'No person was specified for this resume application. To view a resume, you need to set the VITE_PERSON environment variable.'
                : 'No se especificó una persona para esta aplicación de currículum. Para ver un currículum, necesitas establecer la variable de entorno VITE_PERSON.'
              }
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                {t === 'en' ? 'How to set the person:' : 'Cómo establecer la persona:'}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    {t === 'en' ? 'For development:' : 'Para desarrollo:'}
                  </h4>
                  <code className="block bg-white border rounded px-3 py-2 text-sm font-mono text-gray-700">
                    VITE_PERSON=yohany npm run dev
                  </code>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    {t === 'en' ? 'For building:' : 'Para compilar:'}
                  </h4>
                  <code className="block bg-white border rounded px-3 py-2 text-sm font-mono text-gray-700">
                    VITE_PERSON=lenicet npm run build
                  </code>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
              <p className="text-blue-800">
                <strong>
                  {t === 'en' ? 'Available persons:' : 'Personas disponibles:'}
                </strong>
                {' '}yohany, lenicet
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t === 'en' 
                ? 'This application requires a person to be specified at build/start time for security and configuration purposes.'
                : 'Esta aplicación requiere que se especifique una persona al momento de compilar/iniciar por motivos de seguridad y configuración.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonRequiredFallback;