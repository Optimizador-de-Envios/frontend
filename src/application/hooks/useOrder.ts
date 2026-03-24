import { useCallback } from 'react'
import type { Order, ValidationResult } from '../../domain/order'
import { validateOrder } from '../../domain/order'
import { useOrderStore } from '../store/orderStore'

export function useOrder(): {
    order: Order | null
    submitOrder: (order: Order) => ValidationResult
    clearOrder: () => void
} {
    const order = useOrderStore((s) => s.order)
    const setOrder = useOrderStore((s) => s.setOrder)
    const clearOrder = useOrderStore((s) => s.clearOrder)

    const submitOrder = useCallback((o: Order) => {
        const validation = validateOrder(o)
        if (validation.valid) {
            setOrder(o)
        }
        return validation
    }, [setOrder])

    return { order, submitOrder, clearOrder }
}
