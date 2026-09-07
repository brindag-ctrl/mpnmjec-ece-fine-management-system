import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import App from './App.jsx'

// Clear any previous mock/sample storage so everything is 100% real-time from Firestore
try {
  localStorage.removeItem('mpnmjec_ece_students_db');
  localStorage.removeItem('mpnmjec_ece_fines_db');
} catch (e) {
  // ignore
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
