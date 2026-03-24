import { create } from 'zustand'
import type { Order } from '../../domain/order'

type OrderState = {
  order: Order | null
  setOrder: (order: Order) => void
  clearOrder: () => void
}

// Stub: setOrder and clearOrder do nothing — tests will fail (RED)
export const useOrderStore = create<OrderState>(() => ({
  order:      null,
  setOrder:   () => {},
  clearOrder: () => {},
}))
