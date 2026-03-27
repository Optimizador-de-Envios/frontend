import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Order } from '../../domain/order'
import type { Recommendation } from '../../domain/recommendation'
import { postOrder } from '../../infrastructure/api/orderApiService'
import { useRecommendationStore } from '../store/recommendationStore'

type ReadyOrder = Order & { priority: NonNullable<Order['priority']> }

export function useRecommendation(): {
  recommendation: Recommendation | null
  loading: boolean
  error: string | null
  fetchRecommendation: (order: ReadyOrder) => Promise<void>
} {
  const recommendation = useRecommendationStore((s) => s.recommendation)
  const setRecommendation = useRecommendationStore((s) => s.setRecommendation)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendation = useCallback(async (order: ReadyOrder) => {
    setLoading(true)
    setError(null)
    try {
      const result = await postOrder(order)
      setRecommendation(result)
      navigate('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [setRecommendation, navigate])

  return { recommendation, loading, error, fetchRecommendation }
}
