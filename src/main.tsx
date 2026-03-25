import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { OrderPage } from './ui/pages/OrderPage'

// Expose Vite env key in dev for quick debugging (do NOT commit real keys)
if (import.meta.env.DEV) {
  ;(window as any).__VITE_OPENROUTESERVICE_API_KEY = (import.meta as any)?.env?.VITE_OPENROUTESERVICE_API_KEY
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrderPage />
  </StrictMode>,
)
