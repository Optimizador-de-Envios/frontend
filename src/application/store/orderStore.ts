import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Order } from '../../domain/order'

type OrderState = {
    order: Order | null
    setOrder: (order: Order) => void
    clearOrder: () => void
}

export const useOrderStore = create<OrderState>()(
    devtools((set) => ({
        order: null,
        setOrder: (order: Order) => set(() => ({ order }), false, 'setOrder'),
        clearOrder: () => set(() => ({ order: null }), false, 'clearOrder'),
    }), { name: 'OrderStore' }),
)
