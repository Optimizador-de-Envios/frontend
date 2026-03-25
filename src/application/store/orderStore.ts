import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Order, ShippingPriority } from '../../domain/order'

type OrderState = {
    order: Order | null
    setOrder: (order: Order) => void
    setPriority: (priority: ShippingPriority) => void
    clearOrder: () => void
}

export const useOrderStore = create<OrderState>()(
    devtools((set) => ({
        order: null,
        setOrder: (order: Order) => set(() => ({ order }), false, 'setOrder'),
        setPriority: (priority: ShippingPriority) => set(
            (state) => ({ order: state.order ? { ...state.order, priority } : null }),
            false,
            'setPriority'
        ),
        clearOrder: () => set(() => ({ order: null }), false, 'clearOrder'),
    }), { name: 'OrderStore' }),
)
