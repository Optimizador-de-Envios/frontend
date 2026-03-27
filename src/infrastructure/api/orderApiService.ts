import type { Order } from '../../domain/order'
import type { Recommendation, ShippingOption, OrderConfirmation } from '../../domain/recommendation'

export type ReadyOrder = Order & { priority: NonNullable<Order['priority']> }

const ORDER_API_BASE = import.meta.env.VITE_ORDER_API_BASE ?? 'http://localhost:8080'

function extractOrderFields(order: ReadyOrder) {
  return {
    origin: order.origin,
    destination: order.destination,
    weight: order.weight,
    weightUnit: order.weightUnit,
    priority: order.priority,
  }
}

export function buildOrderPayload(order: ReadyOrder) {
  return { order: extractOrderFields(order) }
}

export function buildConfirmPayload(order: ReadyOrder, selectedOption: ShippingOption) {
  return { order: extractOrderFields(order), selectedOption }
}

export async function postOrder(order: ReadyOrder): Promise<Recommendation> {
  const response = await fetch(`${ORDER_API_BASE}/api/v1/pedido`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildOrderPayload(order)),
  })

  if (!response.ok) {
    throw new Error(`postOrder failed: ${response.status}`)
  }

  return response.json() as Promise<Recommendation>
}

export async function confirmOrder(order: ReadyOrder, selectedOption: ShippingOption): Promise<OrderConfirmation> {
  const response = await fetch(`${ORDER_API_BASE}/api/v1/pedido/confirmar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildConfirmPayload(order, selectedOption)),
  })

  if (!response.ok) {
    throw new Error(`confirmOrder failed: ${response.status}`)
  }

  return response.json() as Promise<OrderConfirmation>
}
