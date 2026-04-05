import type { ReadyOrder } from '../../domain/order'
import type { Recommendation, ShippingOption, OrderConfirmation } from '../../domain/recommendation'
import { useAuthStore } from '../../application/store/authStore'
import { readApiErrorMessage } from './apiError'

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

function createConfirmationToken() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const randomValue = Math.random() * 16 | 0
    const nextValue = character === 'x' ? randomValue : (randomValue & 0x3) | 0x8
    return nextValue.toString(16)
  })
}

function getAuthorizationHeader(): Record<string, string> {
  const session = useAuthStore.getState().session
  const headers: Record<string, string> = {}

  if (session) {
    headers.Authorization = `${session.tokenType} ${session.accessToken}`
  }

  return headers
}

export function buildOrderPayload(order: ReadyOrder, confirmationToken: string) {
  return { order: extractOrderFields(order), confirmationToken }
}

export function buildConfirmPayload(order: ReadyOrder, selectedOption: ShippingOption, confirmationToken: string) {
  return { order: extractOrderFields(order), selectedOption, confirmationToken }
}

export async function postOrder(order: ReadyOrder): Promise<Recommendation> {
  const confirmationToken = createConfirmationToken()
  const response = await fetch(`${ORDER_API_BASE}/api/v1/pedido`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthorizationHeader(),
    },
    body: JSON.stringify(buildOrderPayload(order, confirmationToken)),
  })

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response))
  }

  const result = await response.json() as Recommendation
  return { ...result, confirmationToken }
}

export async function confirmOrder(
  order: ReadyOrder,
  selectedOption: ShippingOption,
  confirmationToken: string
): Promise<OrderConfirmation> {
  const response = await fetch(`${ORDER_API_BASE}/api/v1/pedido/confirmar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthorizationHeader(),
    },
    body: JSON.stringify(buildConfirmPayload(order, selectedOption, confirmationToken)),
  })

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response))
  }

  return response.json() as Promise<OrderConfirmation>
}
