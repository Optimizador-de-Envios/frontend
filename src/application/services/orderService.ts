import type { Order, ValidationResult } from '../../domain/order'
import { validateOrder } from '../../domain/order'
import { useOrderStore } from '../store/orderStore'

// Application service: orchestrates domain validation and store persistence
export function submitOrderService(order: Order): ValidationResult {
  const validation = validateOrder(order)
  if (validation.valid) {
    // Persist in the application state
    useOrderStore.getState().setOrder(order)
  }
  return validation
}

export function clearOrderService(): void {
  useOrderStore.getState().clearOrder()
}

export default { submitOrderService, clearOrderService }
