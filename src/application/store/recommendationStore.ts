import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { Recommendation, ShippingOption, OrderConfirmation } from '../../domain/recommendation'

export type ConfirmationStatus = 'idle' | 'loading' | 'success' | 'error'

type RecommendationData = {
  recommendation: Recommendation | null
  selectedOption: ShippingOption | null
  orderConfirmation: OrderConfirmation | null
  setRecommendation: (recommendation: Recommendation) => void
  setSelectedOption: (option: ShippingOption) => void
  setOrderConfirmation: (confirmation: OrderConfirmation) => void
  clearRecommendation: () => void
}

type ConfirmationState = {
  confirmationStatus: ConfirmationStatus
  confirmationError: string | null
  setConfirmationStatus: (status: ConfirmationStatus) => void
  setConfirmationError: (error: string | null) => void
}

type RecommendationState = RecommendationData & ConfirmationState

export const useRecommendationStore = create<RecommendationState>()(
  devtools(
    persist(
      (set) => ({
        recommendation: null,
        selectedOption: null,
        orderConfirmation: null,
        confirmationStatus: 'idle',
        confirmationError: null,
        setRecommendation: (recommendation: Recommendation) =>
          set(() => ({ recommendation }), false, 'setRecommendation'),
        setSelectedOption: (option: ShippingOption) =>
          set(() => ({ selectedOption: option }), false, 'setSelectedOption'),
        setOrderConfirmation: (confirmation: OrderConfirmation) =>
          set(() => ({ orderConfirmation: confirmation }), false, 'setOrderConfirmation'),
        setConfirmationStatus: (status: ConfirmationStatus) =>
          set(() => ({ confirmationStatus: status }), false, 'setConfirmationStatus'),
        setConfirmationError: (error: string | null) =>
          set(() => ({ confirmationError: error }), false, 'setConfirmationError'),
        clearRecommendation: () =>
          set(
            () => ({
              recommendation: null,
              selectedOption: null,
              orderConfirmation: null,
              confirmationStatus: 'idle',
              confirmationError: null,
            }),
            false,
            'clearRecommendation'
          ),
      }),
      {
        name: 'recommendation-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { name: 'RecommendationStore' }
  ),
)
