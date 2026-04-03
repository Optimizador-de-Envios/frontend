import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useConfirmOrder } from '../../src/application/hooks/useConfirmOrder'
import { useRecommendationStore } from '../../src/application/store/recommendationStore'
import type { OrderConfirmation } from '../../src/domain/recommendation'

const validOrder = {
  origin: { name: 'Tunja, BY, Colombia', lng: -73.36778, lat: 5.53528 },
  destination: { name: 'Bogotá, DC, Colombia', lng: -74.08768, lat: 4.635456 },
  weight: 5,
  weightUnit: 'KILOGRAMS' as const,
  priority: 'COST' as const,
}

const selectedOption = {
  providerName: 'Local',
  cost: 30386.59,
  currency: 'COP',
  estimatedDays: 1,
}

const mockConfirmation: OrderConfirmation = {
  id: 'abc-123',
  confirmationToken: 'token-123',
  origin: { name: 'Tunja, BY, Colombia', lat: 5.53528, lng: -73.36778 },
  destination: { name: 'Bogotá, DC, Colombia', lat: 4.635456, lng: -74.08768 },
  weight: 5,
  weightUnit: 'KILOGRAMS',
  priority: 'COST',
  distanceKm: 148.3,
  selectedOption,
}

const mockNavigate = vi.fn()

vi.mock('../../src/infrastructure/api/orderApiService', () => ({
  confirmOrder: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

import { confirmOrder } from '../../src/infrastructure/api/orderApiService'

describe('useConfirmOrder (HU-05)', () => {
  beforeEach(() => {
    useRecommendationStore.getState().clearRecommendation()
    useRecommendationStore.getState().setRecommendation({
      recommendation: {
        providerName: 'Local',
        cost: 30386.59,
        currency: 'COP',
        estimatedDays: 1,
      },
      alternatives: [],
      confirmationToken: 'token-123',
    })
    vi.clearAllMocks()
    mockNavigate.mockReset()
  })

  it('should return "idle" as initial confirmationStatus', () => {
    const { result } = renderHook(() => useConfirmOrder())
    expect(result.current.confirmationStatus).toBe('idle')
  })

  it('should return null as initial confirmationError', () => {
    const { result } = renderHook(() => useConfirmOrder())
    expect(result.current.confirmationError).toBeNull()
  })

  it('should store orderConfirmation in store when confirm succeeds', async () => {
    vi.mocked(confirmOrder).mockResolvedValueOnce(mockConfirmation)
    const { result } = renderHook(() => useConfirmOrder())
    await act(async () => {
      await result.current.confirm(validOrder, selectedOption)
    })
    expect(useRecommendationStore.getState().orderConfirmation).toEqual(mockConfirmation)
  })

  it('should store selectedOption in store when confirm succeeds', async () => {
    vi.mocked(confirmOrder).mockResolvedValueOnce(mockConfirmation)
    const { result } = renderHook(() => useConfirmOrder())
    await act(async () => {
      await result.current.confirm(validOrder, selectedOption)
    })
    expect(useRecommendationStore.getState().selectedOption).toEqual(selectedOption)
  })

  it('should set confirmationStatus to "success" after successful confirm', async () => {
    vi.mocked(confirmOrder).mockResolvedValueOnce(mockConfirmation)
    const { result } = renderHook(() => useConfirmOrder())
    await act(async () => {
      await result.current.confirm(validOrder, selectedOption)
    })
    expect(result.current.confirmationStatus).toBe('success')
  })

  it('should navigate to /confirmation after successful confirm', async () => {
    vi.mocked(confirmOrder).mockResolvedValueOnce(mockConfirmation)
    const { result } = renderHook(() => useConfirmOrder())
    await act(async () => {
      await result.current.confirm(validOrder, selectedOption)
    })
    expect(mockNavigate).toHaveBeenCalledWith('/confirmation')
  })

  it('should set confirmationStatus to "error" when confirm fails', async () => {
    vi.mocked(confirmOrder).mockRejectedValueOnce(new Error('confirmOrder failed: 500'))
    const { result } = renderHook(() => useConfirmOrder())
    await act(async () => {
      await result.current.confirm(validOrder, selectedOption)
    })
    expect(result.current.confirmationStatus).toBe('error')
  })

  it('should store the error message when confirm fails', async () => {
    vi.mocked(confirmOrder).mockRejectedValueOnce(new Error('confirmOrder failed: 500'))
    const { result } = renderHook(() => useConfirmOrder())
    await act(async () => {
      await result.current.confirm(validOrder, selectedOption)
    })
    expect(result.current.confirmationError).toBe('confirmOrder failed: 500')
  })

  it('should NOT navigate when confirm fails', async () => {
    vi.mocked(confirmOrder).mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useConfirmOrder())
    await act(async () => {
      await result.current.confirm(validOrder, selectedOption)
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should NOT store orderConfirmation in store when confirm fails', async () => {
    vi.mocked(confirmOrder).mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useConfirmOrder())
    await act(async () => {
      await result.current.confirm(validOrder, selectedOption)
    })
    expect(useRecommendationStore.getState().orderConfirmation).toBeNull()
  })

  it('should reuse the existing confirmation when the current attempt was already confirmed', async () => {
    const recommendationWithToken = {
      recommendation: {
        providerName: 'Local',
        cost: 30386.59,
        currency: 'COP',
        estimatedDays: 1,
      },
      alternatives: [],
      confirmationToken: 'token-123',
    }

    const confirmationWithToken = {
      ...mockConfirmation,
      confirmationToken: 'token-123',
    }

    useRecommendationStore.getState().setRecommendation(recommendationWithToken as any)
    useRecommendationStore.getState().setOrderConfirmation(confirmationWithToken as any)

    const { result } = renderHook(() => useConfirmOrder())

    await act(async () => {
      await result.current.confirm(validOrder, selectedOption)
    })

    expect(confirmOrder).not.toHaveBeenCalled()
    expect(useRecommendationStore.getState().orderConfirmation).toEqual(confirmationWithToken)
    expect(mockNavigate).toHaveBeenCalledWith('/confirmation')
  })
})
