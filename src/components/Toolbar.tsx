import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface ToolbarProps {
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onLanguageChange
}) => {
  const { language } = useLanguage();
  const t = language;

  return (
    <div className="toolbar sticky top-0 z-10 shadow-sm">
      <div className="toolbar-content">
        <div className="flex items-center">
          <div className="toolbar-group">
            <label htmlFor="lang-select" className="form-label">
              {t === 'en' ? 'Language:' : 'Idioma:'}
            </label>
            <select id="lang-select" value={language} onChange={onLanguageChange} className="toolbar-select">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;