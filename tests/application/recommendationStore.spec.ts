import { describe, it, expect, beforeEach } from 'vitest'
import { useRecommendationStore } from '../../src/application/store/recommendationStore'
import type { ShippingOption } from '../../src/domain/recommendation'

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

describe('useRecommendationStore selectedOption (HU-05)', () => {
  const mockOption: ShippingOption = {
    providerName: 'FedEx',
    cost: 50354.636,
    currency: 'COP',
    estimatedDays: 1,
  }

  beforeEach(() => {
    useRecommendationStore.getState().clearRecommendation()
  })

  it('should have null selectedOption as initial state', () => {
    expect(useRecommendationStore.getState().selectedOption).toBeNull()
  })

  it('should store selectedOption when setSelectedOption is called', () => {
    useRecommendationStore.getState().setSelectedOption(mockOption)
    expect(useRecommendationStore.getState().selectedOption).toEqual(mockOption)
  })

  it('should reset selectedOption when clearRecommendation is called', () => {
    useRecommendationStore.getState().setSelectedOption(mockOption)
    useRecommendationStore.getState().clearRecommendation()
    expect(useRecommendationStore.getState().selectedOption).toBeNull()
  })
})

describe('useRecommendationStore persistence (sessionStorage)', () => {
  const mockOption: ShippingOption = mockRecommendation.recommendation

  beforeEach(() => {
    sessionStorage.clear()
    useRecommendationStore.getState().clearRecommendation()
  })

  it('should persist recommendation to sessionStorage after setRecommendation', () => {
    useRecommendationStore.getState().setRecommendation(mockRecommendation)
    const raw = sessionStorage.getItem('recommendation-storage')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed.state.recommendation).toMatchObject(mockRecommendation)
  })

  it('should persist selectedOption to sessionStorage after setSelectedOption', () => {
    useRecommendationStore.getState().setSelectedOption(mockOption)
    const raw = sessionStorage.getItem('recommendation-storage')
    const parsed = JSON.parse(raw!)
    expect(parsed.state.selectedOption).toMatchObject(mockOption)
  })

  it('should persist null after clearRecommendation', () => {
    useRecommendationStore.getState().setRecommendation(mockRecommendation)
    useRecommendationStore.getState().clearRecommendation()
    const raw = sessionStorage.getItem('recommendation-storage')
    const parsed = JSON.parse(raw!)
    expect(parsed.state.recommendation).toBeNull()
    expect(parsed.state.selectedOption).toBeNull()
  })
})

describe('useRecommendationStore confirmationStatus (HU-05)', () => {
  beforeEach(() => {
    useRecommendationStore.getState().clearRecommendation()
  })

  it('should have "idle" as initial confirmationStatus', () => {
    expect(useRecommendationStore.getState().confirmationStatus).toBe('idle')
  })

  it('should have null as initial confirmationError', () => {
    expect(useRecommendationStore.getState().confirmationError).toBeNull()
  })

  it('should update confirmationStatus when setConfirmationStatus is called', () => {
    useRecommendationStore.getState().setConfirmationStatus('loading')
    expect(useRecommendationStore.getState().confirmationStatus).toBe('loading')
  })

  it('should update to "success" status', () => {
    useRecommendationStore.getState().setConfirmationStatus('success')
    expect(useRecommendationStore.getState().confirmationStatus).toBe('success')
  })

  it('should update to "error" status', () => {
    useRecommendationStore.getState().setConfirmationStatus('error')
    expect(useRecommendationStore.getState().confirmationStatus).toBe('error')
  })

  it('should store confirmationError when setConfirmationError is called', () => {
    useRecommendationStore.getState().setConfirmationError('confirmOrder failed: 500')
    expect(useRecommendationStore.getState().confirmationError).toBe('confirmOrder failed: 500')
  })

  it('should reset confirmationStatus to "idle" when clearRecommendation is called', () => {
    useRecommendationStore.getState().setConfirmationStatus('success')
    useRecommendationStore.getState().clearRecommendation()
    expect(useRecommendationStore.getState().confirmationStatus).toBe('idle')
  })

  it('should reset confirmationError to null when clearRecommendation is called', () => {
    useRecommendationStore.getState().setConfirmationError('some error')
    useRecommendationStore.getState().clearRecommendation()
    expect(useRecommendationStore.getState().confirmationError).toBeNull()
  })
})
