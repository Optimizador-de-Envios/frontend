import { create } from 'zustand'
import type { Order } from '../../domain/order'

type OrderState = {
  order: Order | null
  setOrder: (order: Order) => void
  clearOrder: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
  order: null,
  setOrder: (order: Order) => set(() => ({ order })),
  clearOrder: () => set(() => ({ order: null })),
}))
