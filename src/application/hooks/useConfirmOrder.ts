import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmOrder } from '../../infrastructure/api/orderApiService'
import type { ReadyOrder } from '../../infrastructure/api/orderApiService'
import type { ShippingOption } from '../../domain/recommendation'
import { useRecommendationStore } from '../store/recommendationStore'
import type { ConfirmationStatus } from '../store/recommendationStore'

export function useConfirmOrder(): {
  confirmationStatus: ConfirmationStatus
  confirmationError: string | null
  confirm: (order: ReadyOrder, option: ShippingOption) => Promise<void>
} {
  const confirmationStatus = useRecommendationStore((s) => s.confirmationStatus)
  const confirmationError = useRecommendationStore((s) => s.confirmationError)
  const setSelectedOption = useRecommendationStore((s) => s.setSelectedOption)
  const setOrderConfirmation = useRecommendationStore((s) => s.setOrderConfirmation)
  const setConfirmationStatus = useRecommendationStore((s) => s.setConfirmationStatus)
  const setConfirmationError = useRecommendationStore((s) => s.setConfirmationError)
  const navigate = useNavigate()

  const confirm = useCallback(async (order: ReadyOrder, option: ShippingOption) => {
    setConfirmationStatus('loading')
    setConfirmationError(null)
    try {
      const result = await confirmOrder(order, option)
      setSelectedOption(option)
      setOrderConfirmation(result)
      setConfirmationStatus('success')
      navigate('/confirmation')
    } catch (err) {
      setConfirmationStatus('error')
      setConfirmationError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [setSelectedOption, setOrderConfirmation, setConfirmationStatus, setConfirmationError, navigate])

  return { confirmationStatus, confirmationError, confirm }
}
