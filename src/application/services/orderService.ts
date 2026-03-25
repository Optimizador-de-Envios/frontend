import type { Order, ValidationResult } from '../../domain/order'
import { validateOrder } from '../../domain/order'

// Application service: pure orchestrator — depends on injected actions, not on the store directly.
// Analogía Spring: el @Service recibe el @Repository por constructor, no lo instancia él mismo.
export function submitOrderService(
  order: Order,
  setOrder: (o: Order) => void,
): ValidationResult {
  const validation = validateOrder(order)
  if (validation.valid) {
    setOrder(order)
  }
  return validation
}

export function clearOrderService(clearOrder: () => void): void {
  clearOrder()
}

export default { submitOrderService, clearOrderService }
