import { useCallback } from 'react'
import type { Order, ValidationResult, ShippingPriority } from '../../domain/order'
import { useOrderStore } from '../store/orderStore'
import { submitOrderService, clearOrderService } from '../services/orderService'

export function useOrder(): {
    order: Order | null
    priority: ShippingPriority | null
    submitOrder: (order: Order) => ValidationResult
    clearOrder: () => void
    setPriority: (p: ShippingPriority) => void
} {
    const order = useOrderStore((s) => s.order)
    const priority = useOrderStore((s) => s.priority)
    const setPriorityStore = useOrderStore((s) => s.setPriority)

    const submitOrder = useCallback((o: Order) => {
        const result = submitOrderService(o)
        return result
    }, [])

    const clearOrder = useCallback(() => {
        clearOrderService()
    }, [])

    const setPriority = useCallback((p: ShippingPriority) => {
        setPriorityStore(p)
    }, [setPriorityStore])

    return { order, priority, submitOrder, clearOrder, setPriority }
}
