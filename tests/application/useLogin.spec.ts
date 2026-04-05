import { describe, expect, it, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useLogin } from '../../src/application/hooks/useLogin'
import { useAuthStore } from '../../src/application/store/authStore'

const mockNavigate = vi.fn()

vi.mock('../../src/infrastructure/api/authApiService', () => ({
  login: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

import { login as loginApi } from '../../src/infrastructure/api/authApiService'

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve
    reject = promiseReject
  })

  return { promise, resolve, reject }
}

describe('useLogin (F2)', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().logout()
    vi.clearAllMocks()
    mockNavigate.mockReset()
  })

  it('starts idle with no error and no session', () => {
    const { result } = renderHook(() => useLogin())

    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
    expect(useAuthStore.getState().session).toBeNull()
  })

  it('sets loading while the login request is pending', async () => {
    const deferred = createDeferred<any>()
    vi.mocked(loginApi).mockReturnValueOnce(deferred.promise)

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      void result.current.login({ email: 'juan@example.com', password: 'SecurePass123' })
    })

    expect(result.current.status).toBe('loading')

    deferred.resolve({
      accessToken: 'jwt-123',
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: {
        id: 'c6f5dd0d-55d7-4e52-a1cf-7cf7c26f4d82',
        name: 'Juan Perez',
        email: 'juan@example.com',
      },
    })

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })
  })

  it('stores the session and navigates to the protected flow on success', async () => {
    vi.mocked(loginApi).mockResolvedValueOnce({
      accessToken: 'jwt-123',
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: {
        id: 'c6f5dd0d-55d7-4e52-a1cf-7cf7c26f4d82',
        name: 'Juan Perez',
        email: 'juan@example.com',
      },
    })

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login({ email: 'juan@example.com', password: 'SecurePass123' })
    })

    expect(useAuthStore.getState().session?.accessToken).toBe('jwt-123')
    expect(result.current.status).toBe('success')
    expect(result.current.error).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('sets an error and keeps the session empty when login fails', async () => {
    vi.mocked(loginApi).mockRejectedValueOnce(new Error('Credenciales invalidas'))

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login({ email: 'juan@example.com', password: 'bad-password' })
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('Credenciales invalidas')
    expect(useAuthStore.getState().session).toBeNull()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})