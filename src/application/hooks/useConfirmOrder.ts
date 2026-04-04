import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmOrder } from '../../infrastructure/api/orderApiService'
import type { ReadyOrder } from '../../domain/order'
import type { ShippingOption } from '../../domain/recommendation'
import { isAttemptConfirmed } from '../../domain/recommendation'
import { useRecommendationStore } from '../store/recommendationStore'
import type { ConfirmationStatus } from '../store/recommendationStore'

export function useConfirmOrder(): {
  confirmationStatus: ConfirmationStatus
  confirmationError: string | null
  currentAttemptConfirmed: boolean
  canConfirm: boolean
  confirm: (order: ReadyOrder, option: ShippingOption) => Promise<void>
} {
  const recommendation = useRecommendationStore((s) => s.recommendation)
  const orderConfirmation = useRecommendationStore((s) => s.orderConfirmation)
  const confirmationStatus = useRecommendationStore((s) => s.confirmationStatus)
  const confirmationError = useRecommendationStore((s) => s.confirmationError)
  const setSelectedOption = useRecommendationStore((s) => s.setSelectedOption)
  const setOrderConfirmation = useRecommendationStore((s) => s.setOrderConfirmation)
  const setConfirmationStatus = useRecommendationStore((s) => s.setConfirmationStatus)
  const setConfirmationError = useRecommendationStore((s) => s.setConfirmationError)
  const navigate = useNavigate()

  const currentAttemptConfirmed = isAttemptConfirmed(recommendation, orderConfirmation)
  const canConfirm = confirmationStatus !== 'loading' && !currentAttemptConfirmed

  const confirm = useCallback(async (order: ReadyOrder, option: ShippingOption) => {
    if (isAttemptConfirmed(recommendation, orderConfirmation) && orderConfirmation) {
      setSelectedOption(option)
      setConfirmationStatus('success')
      setConfirmationError(null)
      navigate('/confirmation')
      return
    }

    if (!recommendation) {
      setConfirmationStatus('error')
      setConfirmationError('Missing recommendation for current attempt')
      return
    }

    setConfirmationStatus('loading')
    setConfirmationError(null)
    try {
      const result = await confirmOrder(order, option, recommendation.confirmationToken)
      setSelectedOption(option)
      setOrderConfirmation(result)
      setConfirmationStatus('success')
      navigate('/confirmation')
    } catch (err) {
      setConfirmationStatus('error')
      setConfirmationError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [recommendation, orderConfirmation, setSelectedOption, setOrderConfirmation, setConfirmationStatus, setConfirmationError, navigate])

  return { confirmationStatus, confirmationError, currentAttemptConfirmed, canConfirm, confirm }
}
