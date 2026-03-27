import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { useOrderStore } from './application/store/orderStore'
import { OrderPage } from './ui/pages/OrderPage'
import { ResultsPage } from './ui/pages/ResultsPage'

// Expose the store to the window in dev so you can manipulate it from the console
if (import.meta.env.DEV) {
  ;(window as any).useOrderStore = useOrderStore
}

// Expose Vite env key in dev for quick debugging (do NOT commit real keys)
if (import.meta.env.DEV) {
  ;(window as any).__VITE_OPENROUTESERVICE_API_KEY = (import.meta as any)?.env?.VITE_OPENROUTESERVICE_API_KEY
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
