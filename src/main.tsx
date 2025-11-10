import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.tsx'

// Read initial person from Vite env variable VITE_PERSON (set at build/dev time)
const initialPerson = (import.meta.env.VITE_PERSON as string) || undefined;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppRouter initialPerson={initialPerson} />
  </React.StrictMode>,
)