import React from 'react'
import ReactDOM from 'react-dom/client'
import MyResume from './MyResume.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MyResume initialLang="en" initialPersona="yohany" />
  </React.StrictMode>,
)