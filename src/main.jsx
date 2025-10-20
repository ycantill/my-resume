import React from 'react'
import ReactDOM from 'react-dom/client'
import MyResume from './MyResume.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MyResume initialLang="en" initialPersona="yohany" />
  </React.StrictMode>,
)