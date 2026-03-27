import type { Order } from '../../domain/order'
import type { Recommendation } from '../../domain/recommendation'

const ORDER_API_BASE = import.meta.env.VITE_ORDER_API_BASE ?? 'http://localhost:8080'

export function buildOrderPayload(order: Order & { priority: NonNullable<Order['priority']> }) {
  return {
    order: {
      origin: order.origin,
      destination: order.destination,
      weight: order.weight,
      weightUnit: order.weightUnit,
      priority: order.priority,
    },
  }
}

export async function postOrder(order: Order & { priority: NonNullable<Order['priority']> }): Promise<Recommendation> {
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
