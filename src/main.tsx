import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { useOrderStore } from './application/store/orderStore'

// Expose the store to the window in dev so you can manipulate it from the console
if (import.meta.env.DEV) {
  ;(window as any).useOrderStore = useOrderStore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div />
  </StrictMode>,
)
