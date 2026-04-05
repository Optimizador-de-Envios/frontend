import { describe, expect, it } from 'vitest'
import {
  createAuthSession,
  isAuthSessionActive,
  isAuthUser,
} from '../../src/domain/auth'

describe('auth domain (F1)', () => {
  const authUser = {
    id: 'c6f5dd0d-55d7-4e52-a1cf-7cf7c26f4d82',
    name: 'Juan Perez',
    email: 'juan@example.com',
  }

  it('builds an auth session with an expiry derived from issued time and expiresIn', () => {
    const session = createAuthSession(
      {
        accessToken: 'jwt-123',
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: authUser,
      },
      new Date('2026-04-03T18:30:00Z')
    )

    expect(session.user).toEqual(authUser)
    expect(session.accessToken).toBe('jwt-123')
    expect(session.tokenType).toBe('Bearer')
    expect(session.expiresAt).toBe('2026-04-04T18:30:00.000Z')
  })

  it('treats a session as active before its expiry instant', () => {
    const session = createAuthSession(
      {
        accessToken: 'jwt-123',
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: authUser,
      },
      new Date('2026-04-03T18:30:00Z')
    )

    expect(isAuthSessionActive(session, new Date('2026-04-04T18:29:59Z'))).toBe(true)
  })

  it('treats a session as inactive once the expiry instant has passed', () => {
    const session = createAuthSession(
      {
        accessToken: 'jwt-123',
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: authUser,
      },
      new Date('2026-04-03T18:30:00Z')
    )

    expect(isAuthSessionActive(session, new Date('2026-04-04T18:30:01Z'))).toBe(false)
  })

  it('recognizes a minimal auth user shape', () => {
    expect(isAuthUser(authUser)).toBe(true)
    expect(isAuthUser({ id: '1', name: 'Juan' })).toBe(false)
  })
})