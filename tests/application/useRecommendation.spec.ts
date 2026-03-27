import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecommendation } from '../../src/application/hooks/useRecommendation'
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

const validOrder = {
  origin: { name: 'Tunja, BY, Colombia', lng: -73.36778, lat: 5.53528 },
  destination: { name: 'Bogotá, DC, Colombia', lng: -74.08768, lat: 4.635456 },
  weight: 10,
  weightUnit: 'KILOGRAMS' as const,
  priority: 'COST' as const,
}

vi.mock('../../src/infrastructure/api/orderApiService', () => ({
  postOrder: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

import { postOrder } from '../../src/infrastructure/api/orderApiService'

describe('useRecommendation (HU-03)', () => {
  beforeEach(() => {
    useRecommendationStore.getState().clearRecommendation()
    vi.clearAllMocks()
  })

  it('should return null recommendation initially', () => {
    const { result } = renderHook(() => useRecommendation())
    expect(result.current.recommendation).toBeNull()
  })

  it('should return loading false initially', () => {
    const { result } = renderHook(() => useRecommendation())
    expect(result.current.loading).toBe(false)
  })

  it('should return null error initially', () => {
    const { result } = renderHook(() => useRecommendation())
    expect(result.current.error).toBeNull()
  })

  it('should store recommendation in store after successful fetchRecommendation', async () => {
    vi.mocked(postOrder).mockResolvedValueOnce(mockRecommendation)
    const { result } = renderHook(() => useRecommendation())
    await act(async () => {
      await result.current.fetchRecommendation(validOrder)
    })
    expect(result.current.recommendation).toEqual(mockRecommendation)
  })

  it('should set error when postOrder fails', async () => {
    vi.mocked(postOrder).mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useRecommendation())
    await act(async () => {
      await result.current.fetchRecommendation(validOrder)
    })
    expect(result.current.error).toBe('Network error')
    expect(result.current.recommendation).toBeNull()
  })

  it('should navigate to /results after successful fetchRecommendation', async () => {
    const mockNavigate = vi.fn()
    vi.mocked(postOrder).mockResolvedValueOnce(mockRecommendation)

    vi.doMock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }))

    const { result } = renderHook(() => useRecommendation())
    await act(async () => {
      await result.current.fetchRecommendation(validOrder)
    })
    expect(mockNavigate).toHaveBeenCalledWith('/results')
  })
})
