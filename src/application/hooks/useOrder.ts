import { useCallback } from 'react'
import type { Order, ValidationResult } from '../../domain/order'
import { useOrderStore } from '../store/orderStore'
import { submitOrderService, clearOrderService } from '../services/orderService'

export function useOrder(): {
    order: Order | null
    submitOrder: (order: Order) => ValidationResult
    clearOrder: () => void
} {
    const order = useOrderStore((s) => s.order)

    const submitOrder = useCallback((o: Order) => {
        const result = submitOrderService(o)
        return result
    }, [])

    const clearOrder = useCallback(() => {
        clearOrderService()
    }, [])

    return { order, submitOrder, clearOrder }
}
