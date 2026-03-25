import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Order, ShippingPriority } from '../../domain/order'

type OrderState = {
    order: Order | null
    priority: ShippingPriority | null
    setOrder: (order: Order) => void
    setPriority: (priority: ShippingPriority) => void
    clearOrder: () => void
}

export const useOrderStore = create<OrderState>()(
    devtools((set) => ({
        order: null,
        priority: null,
        setOrder: (order: Order) => set(() => ({ order }), false, 'setOrder'),
        setPriority: (priority: ShippingPriority) => set(() => ({ priority }), false, 'setPriority'),
        clearOrder: () => set(() => ({ order: null, priority: null }), false, 'clearOrder'),
    }), { name: 'OrderStore' }),
)
