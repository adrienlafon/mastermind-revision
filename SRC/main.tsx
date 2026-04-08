/**
 * main.tsx — Point d'entrée React.
 * Monte l'application dans le DOM (élément #root défini dans index.html).
 * Utilise React 18 StrictMode pour détecter les problèmes potentiels.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
