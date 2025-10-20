import React from 'react'
import ReactDOM from 'react-dom/client'
import MyResume from './MyResume.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider initialLanguage="en">
      <MyResume initialPersona="yohany" />
    </LanguageProvider>
  </React.StrictMode>,
)