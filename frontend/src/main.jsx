import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './app.jsx'
import ConfigBuilder from './ConfigBuilder.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/config" element={<ConfigBuilder />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
