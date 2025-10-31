import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { printResume } from '../resume-helpers.ts';

interface ToolbarProps {
  person: string;
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPersonChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  person, 
  onLanguageChange, 
  onPersonChange 
}) => {
  const { language } = useLanguage();
  const t = language;

  return (
    <div className="toolbar sticky top-0 z-10 shadow-sm">
      <div className="toolbar-content justify-between">
        <div className="flex items-center space-x-6">
          <div className="toolbar-group">
            <label htmlFor="lang-select" className="form-label">
              {t === 'en' ? 'Language:' : 'Idioma:'}
            </label>
            <select id="lang-select" value={language} onChange={onLanguageChange} className="toolbar-select">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className="toolbar-group">
            <label htmlFor="person-select" className="form-label">
              {t === 'en' ? 'Person:' : 'Persona:'}
            </label>
            <select id="person-select" value={person} onChange={onPersonChange} className="toolbar-select">
              <option value="yohany">Yohany</option>
              <option value="lenicet">Lenicet</option>
            </select>
          </div>
        </div>
        
        <button onClick={printResume} className="toolbar-button">
          {t === 'en' ? 'Print' : 'Imprimir'}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;