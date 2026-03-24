import type { Order, ValidationResult } from '../../domain/order'

// Stub: not yet implemented — all tests depending on submitOrder/clearOrder will fail (RED)
export function useOrder(): {
  order: Order | null
  submitOrder: (order: Order) => ValidationResult
  clearOrder: () => void
} {
  return {
    order:       null,
    submitOrder: () => ({ valid: false, errors: ['not implemented'] }),
    clearOrder:  () => {},
  }
}
