import { describe, expect, it, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../../src/application/hooks/useAuth'
import { useAuthStore } from '../../src/application/store/authStore'
import { useOrderStore } from '../../src/application/store/orderStore'
import { useRecommendationStore } from '../../src/application/store/recommendationStore'
import { createAuthSession } from '../../src/domain/auth'

describe('useAuth (F2)', () => {
  const activeSession = createAuthSession(
    {
      accessToken: 'jwt-123',
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: {
        id: 'c6f5dd0d-55d7-4e52-a1cf-7cf7c26f4d82',
        name: 'Juan Perez',
        email: 'juan@example.com',
      },
    },
    new Date('2026-04-03T18:30:00Z')
  )

  const expiredSession = createAuthSession(
    {
      accessToken: 'jwt-999',
      tokenType: 'Bearer',
      expiresIn: 60,
      user: {
        id: '1',
        name: 'Expired User',
        email: 'expired@example.com',
      },
    },
    new Date('2026-04-03T00:00:00Z')
  )

  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().logout()
    useOrderStore.getState().clearOrder()
    useRecommendationStore.getState().clearRecommendation()
    vi.useRealTimers()
  })

  it('returns an unauthenticated state when there is no session', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.session).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('returns an authenticated state when the session is active', () => {
    useAuthStore.getState().login(activeSession)

    const { result } = renderHook(() => useAuth())

    expect(result.current.session).toEqual(activeSession)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('clears an expired session when the hook evaluates it', async () => {
    useAuthStore.getState().login(expiredSession)

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(false)

    await waitFor(() => {
      expect(useAuthStore.getState().session).toBeNull()
    })
  })

  it('clears auth and flow state when logout is called', () => {
    useAuthStore.getState().login(activeSession)
    useOrderStore.getState().setOrder({
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 1,
      weightUnit: 'KILOGRAMS',
    })
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

    const { result } = renderHook(() => useAuth())

    result.current.logout()

    expect(useAuthStore.getState().session).toBeNull()
    expect(useOrderStore.getState().order).toBeNull()
    expect(useRecommendationStore.getState().recommendation).toBeNull()
    expect(useRecommendationStore.getState().orderConfirmation).toBeNull()
  })
})