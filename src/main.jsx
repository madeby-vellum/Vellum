import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

// Create React root and mount the application into the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    {/* Router wrapper to enable client-side routing */}
    <BrowserRouter>

      {/* Auth context provider (makes user/session available globally) */}
      <AuthProvider>

        {/* Main application entry point */}        
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
