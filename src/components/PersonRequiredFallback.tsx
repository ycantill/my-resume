import React from 'react';
import type { Language } from '../types';
import { t as translateFn } from '../resume-helpers';

interface PersonRequiredFallbackProps {
  language: Language;
}

const PersonRequiredFallback: React.FC<PersonRequiredFallbackProps> = ({ language }) => {
  // Use language from props (when rendered outside LanguageProvider)
  const t = (textOrKey: any) => translateFn(textOrKey, language);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t('fallback.title')}
          </h1>
          
          <div className="text-left space-y-4 text-gray-700">
            <p>
              {t('fallback.description')}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                {t('fallback.howToSet')}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    {t('fallback.forDevelopment')}
                  </h4>
                                    <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                    VITE_PERSON=your_person_id npm run dev
                  </code>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    {t('fallback.forBuilding')}
                  </h4>
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                    VITE_PERSON=your_person_id npm run build
                  </code>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
              <p className="text-blue-800">
                                <p className="text-gray-700 mb-2">
                  {t('fallback.availablePersons')}
                </p>
                <p className="text-sm text-gray-600">
                  Any person ID configured in your Firebase database under <code className="bg-gray-200 px-1 rounded">public/people/</code>
                </p>
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t('fallback.securityNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonRequiredFallback;