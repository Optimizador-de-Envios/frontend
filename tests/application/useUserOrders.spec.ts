import { describe, expect, it, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useUserOrders } from '../../src/application/hooks/useUserOrders'
import { useAuthStore } from '../../src/application/store/authStore'

vi.mock('../../src/infrastructure/api/userOrdersApiService', () => ({
  getUserOrders: vi.fn(),
}))

import { getUserOrders } from '../../src/infrastructure/api/userOrdersApiService'

describe('useUserOrders (F2)', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().logout()
    vi.clearAllMocks()
  })

  it('starts empty and idle', () => {
    const { result } = renderHook(() => useUserOrders())

    expect(result.current.orders).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('loads orders using the current session token', async () => {
    useAuthStore.getState().login({
      user: { id: '1', name: 'Juan', email: 'juan@example.com' },
      accessToken: 'jwt-123',
      tokenType: 'Bearer',
      expiresAt: '2026-04-06T00:00:00.000Z',
    })

    vi.mocked(getUserOrders).mockResolvedValueOnce([
      {
        id: 'order-1',
        origin: { name: 'Tunja', lat: 5.5, lng: -73.3 },
        destination: { name: 'Bogota', lat: 4.6, lng: -74.0 },
        weight: 10,
        weightUnit: 'KILOGRAMS',
        priority: 'COST',
        distanceKm: 148.3,
        selectedOption: { providerName: 'Local', cost: 30000, currency: 'COP', estimatedDays: 1 },
        createdAt: '2026-04-03T18:35:00Z',
      },
    ])

    const { result } = renderHook(() => useUserOrders())

    await act(async () => {
      await result.current.refreshOrders()
    })

    expect(getUserOrders).toHaveBeenCalledWith('jwt-123')
    expect(result.current.orders).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('exposes an error when loading fails', async () => {
    useAuthStore.getState().login({
      user: { id: '1', name: 'Juan', email: 'juan@example.com' },
      accessToken: 'jwt-123',
      tokenType: 'Bearer',
      expiresAt: '2026-04-06T00:00:00.000Z',
    })

    vi.mocked(getUserOrders).mockRejectedValueOnce(new Error('Historial no disponible'))

    const { result } = renderHook(() => useUserOrders())

    await act(async () => {
      await result.current.refreshOrders()
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Historial no disponible')
    })
  })
})