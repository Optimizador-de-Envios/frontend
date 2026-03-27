import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { Recommendation, ShippingOption } from '../../domain/recommendation'

type RecommendationState = {
  recommendation: Recommendation | null
  selectedOption: ShippingOption | null
  setRecommendation: (recommendation: Recommendation) => void
  setSelectedOption: (option: ShippingOption) => void
  clearRecommendation: () => void
}

export const useRecommendationStore = create<RecommendationState>()(
  devtools(
    persist(
      (set) => ({
        recommendation: null,
        selectedOption: null,
        setRecommendation: (recommendation: Recommendation) =>
          set(() => ({ recommendation }), false, 'setRecommendation'),
        setSelectedOption: (option: ShippingOption) =>
          set(() => ({ selectedOption: option }), false, 'setSelectedOption'),
        clearRecommendation: () =>
          set(() => ({ recommendation: null, selectedOption: null }), false, 'clearRecommendation'),
      }),
      {
        name: 'recommendation-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { name: 'RecommendationStore' }
  ),
)
