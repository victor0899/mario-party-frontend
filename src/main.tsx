console.log('🚀 MARIO PARTY APP STARTING - main.tsx loaded');

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('🚀 About to render App component');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log('🚀 App component render initiated');
