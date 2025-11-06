import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppRouter initialLanguage="en" />
  </React.StrictMode>,
)