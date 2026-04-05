import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { login, register } from '../../src/infrastructure/api/authApiService'

describe('authApiService (F3)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts credentials to the login endpoint and returns the parsed session payload', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({
      accessToken: 'jwt-123',
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: {
        id: '1',
        name: 'Juan Perez',
        email: 'juan@example.com',
      },
    }), { status: 200 }))

    const result = await login({ email: 'juan@example.com', password: 'SecurePass123' })

    expect(fetch).toHaveBeenCalledOnce()
    const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/api/users/login')
    expect(options.method).toBe('POST')
    expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body as string)).toEqual({
      email: 'juan@example.com',
      password: 'SecurePass123',
    })
    expect(result.accessToken).toBe('jwt-123')
  })

  it('posts registration payload to the register endpoint and returns the created user', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({
      id: '1',
      name: 'Juan Perez',
      email: 'juan@example.com',
      createdAt: '2026-04-03T18:30:00Z',
    }), { status: 201 }))

    const result = await register({
      name: 'Juan Perez',
      email: 'juan@example.com',
      password: 'SecurePass123',
    })

    expect(fetch).toHaveBeenCalledOnce()
    const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/api/users/register')
    expect(options.method).toBe('POST')
    expect(result.createdAt).toBe('2026-04-03T18:30:00Z')
  })

  it('throws a user-friendly auth message when the login response is unauthorized', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }))

    await expect(login({ email: 'juan@example.com', password: 'bad' })).rejects.toThrow(
      'No tienes una sesión válida. Inicia sesión nuevamente.'
    )
  })

  it('throws validation details when the login response is 400', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          message: 'La solicitud contiene datos inválidos',
          errors: ['email: debe ser un correo válido'],
        }),
        { status: 400 }
      )
    )

    await expect(login({ email: 'juan@example.com', password: 'bad' })).rejects.toThrow(
      'La solicitud contiene datos inválidos: email: debe ser un correo válido'
    )
  })
})