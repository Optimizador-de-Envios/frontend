import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { useAuthStore } from './application/store/authStore'
import { useOrderStore } from './application/store/orderStore'
import { OrderPage } from './ui/pages/OrderPage'
import { ResultsPage } from './ui/pages/ResultsPage'
import { ConfirmationPage } from './ui/pages/ConfirmationPage'
import { useRecommendationStore } from './application/store/recommendationStore'
import { ProtectedRoute } from './ui/components/ProtectedRoute'
import { LoginPage } from './ui/pages/LoginPage'
import { RegisterPage } from './ui/pages/RegisterPage'
import { UserOrdersPage } from './ui/pages/UserOrdersPage'

// Expose the store to the window in dev so you can manipulate it from the console
if (import.meta.env.DEV) {
  ;(window as any).useOrderStore = useOrderStore
}

if (import.meta.env.DEV) {
  ;(window as any).useRecommendationStore = useRecommendationStore
}

if (import.meta.env.DEV) {
  ;(window as any).useAuthStore = useAuthStore
}

// Expose Vite env key in dev for quick debugging (do NOT commit real keys)
if (import.meta.env.DEV) {
  ;(window as any).__VITE_OPENROUTESERVICE_API_KEY = (import.meta as any)?.env?.VITE_OPENROUTESERVICE_API_KEY
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmation"
          element={
            <ProtectedRoute>
              <ConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <UserOrdersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
