import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Recommendation } from '../../domain/recommendation'

type RecommendationState = {
  recommendation: Recommendation | null
  setRecommendation: (recommendation: Recommendation) => void
  clearRecommendation: () => void
}

export const useRecommendationStore = create<RecommendationState>()(
  devtools((set) => ({
    recommendation: null,
    setRecommendation: (recommendation: Recommendation) =>
      set(() => ({ recommendation }), false, 'setRecommendation'),
    clearRecommendation: () =>
      set(() => ({ recommendation: null }), false, 'clearRecommendation'),
  }), { name: 'RecommendationStore' }),
)
