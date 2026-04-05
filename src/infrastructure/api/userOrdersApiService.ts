import type { UserOrderSummary } from '../../domain/userOrderSummary'
import { normalizeUserOrderSummaries } from '../../domain/userOrderSummary'

const ORDER_API_BASE = import.meta.env.VITE_ORDER_API_BASE ?? 'http://localhost:8080'

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`getUserOrders failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getUserOrders(accessToken: string): Promise<UserOrderSummary[]> {
  const response = await fetch(`${ORDER_API_BASE}/api/v1/pedido/mis-pedidos`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  const orders = await parseJsonResponse<unknown[]>(response)
  return normalizeUserOrderSummaries(orders as never)
}