import { useCallback, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import type { UserOrderSummary } from '../../domain/userOrderSummary'
import { getUserOrders } from '../../infrastructure/api/userOrdersApiService'

type UserOrdersState = {
  orders: UserOrderSummary[]
  loading: boolean
  error: string | null
  refreshOrders: () => Promise<void>
}

export function useUserOrders(): UserOrdersState {
  const session = useAuthStore((state) => state.session)
  const [orders, setOrders] = useState<UserOrderSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshOrders = useCallback(async () => {
    if (!session) {
      setError('Missing session')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getUserOrders(session.accessToken)
      setOrders(result)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [session])

  return { orders, loading, error, refreshOrders }
}