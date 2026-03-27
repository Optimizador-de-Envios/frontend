import { describe, it, expect, beforeEach } from 'vitest'
import { useRecommendationStore } from '../../src/application/store/recommendationStore'

const mockRecommendation = {
  recommendation: {
    providerName: 'Local',
    cost: 30386.59,
    currency: 'COP',
    estimatedDays: 1,
  },
  alternatives: [
    { providerName: 'FedEx', cost: 50354.636, currency: 'COP', estimatedDays: 1 },
    { providerName: 'DHL', cost: 34591.06, currency: 'COP', estimatedDays: 1 },
  ],
}

describe('useRecommendationStore (HU-03)', () => {
  beforeEach(() => {
    useRecommendationStore.getState().clearRecommendation()
  })

  it('should have null recommendation as initial state', () => {
    expect(useRecommendationStore.getState().recommendation).toBeNull()
  })

  it('should store the recommendation when setRecommendation is called', () => {
    useRecommendationStore.getState().setRecommendation(mockRecommendation)
    expect(useRecommendationStore.getState().recommendation).toEqual(mockRecommendation)
  })

  it('should store the main recommended option', () => {
    useRecommendationStore.getState().setRecommendation(mockRecommendation)
    expect(useRecommendationStore.getState().recommendation?.recommendation.providerName).toBe('Local')
  })

  it('should store the alternative options', () => {
    useRecommendationStore.getState().setRecommendation(mockRecommendation)
    expect(useRecommendationStore.getState().recommendation?.alternatives).toHaveLength(2)
  })

  it('should reset recommendation to null when clearRecommendation is called', () => {
    useRecommendationStore.getState().setRecommendation(mockRecommendation)
    useRecommendationStore.getState().clearRecommendation()
    expect(useRecommendationStore.getState().recommendation).toBeNull()
  })
})
