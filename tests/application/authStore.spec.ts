import { describe, expect, it, beforeEach } from 'vitest'
import { useAuthStore } from '../../src/application/store/authStore'
import { createAuthSession } from '../../src/domain/auth'

describe('useAuthStore (F2)', () => {
  const session = createAuthSession(
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

  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().logout()
  })

  it('starts with no session', () => {
    expect(useAuthStore.getState().session).toBeNull()
  })

  it('stores a session when login is called', () => {
    useAuthStore.getState().login(session)

    expect(useAuthStore.getState().session).toEqual(session)
  })

  it('persists the session to localStorage after login', () => {
    useAuthStore.getState().login(session)

    const raw = localStorage.getItem('auth-storage')
    expect(raw).not.toBeNull()

    const parsed = JSON.parse(raw!)
    expect(parsed.state.session).toEqual(session)
  })

  it('clears the session on logout', () => {
    useAuthStore.getState().login(session)
    useAuthStore.getState().logout()

    expect(useAuthStore.getState().session).toBeNull()
  })

  it('persists a null session after logout', () => {
    useAuthStore.getState().login(session)
    useAuthStore.getState().logout()

    const raw = localStorage.getItem('auth-storage')
    expect(raw).not.toBeNull()

    const parsed = JSON.parse(raw!)
    expect(parsed.state.session).toBeNull()
  })
})