import { describe, expect, it, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRegister } from '../../src/application/hooks/useRegister'
import { useAuthStore } from '../../src/application/store/authStore'

const mockNavigate = vi.fn()

vi.mock('../../src/infrastructure/api/authApiService', () => ({
  register: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

import { register as registerApi } from '../../src/infrastructure/api/authApiService'

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve
    reject = promiseReject
  })

  return { promise, resolve, reject }
}

describe('useRegister (F2)', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().logout()
    vi.clearAllMocks()
    mockNavigate.mockReset()
  })

  it('starts idle with no error', () => {
    const { result } = renderHook(() => useRegister())

    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
    expect(useAuthStore.getState().session).toBeNull()
  })

  it('sets loading while the register request is pending', async () => {
    const deferred = createDeferred<any>()
    vi.mocked(registerApi).mockReturnValueOnce(deferred.promise)

    const { result } = renderHook(() => useRegister())

    await act(async () => {
      void result.current.register({ name: 'Juan Perez', email: 'juan@example.com', password: 'SecurePass123' })
    })

    expect(result.current.status).toBe('loading')

    deferred.resolve({
      id: 'c6f5dd0d-55d7-4e52-a1cf-7cf7c26f4d82',
      name: 'Juan Perez',
      email: 'juan@example.com',
      createdAt: '2026-04-03T18:30:00Z',
    })

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })
  })

  it('navigates to login after a successful registration', async () => {
    vi.mocked(registerApi).mockResolvedValueOnce({
      id: 'c6f5dd0d-55d7-4e52-a1cf-7cf7c26f4d82',
      name: 'Juan Perez',
      email: 'juan@example.com',
      createdAt: '2026-04-03T18:30:00Z',
    })

    const { result } = renderHook(() => useRegister())

    await act(async () => {
      await result.current.register({ name: 'Juan Perez', email: 'juan@example.com', password: 'SecurePass123' })
    })

    expect(result.current.status).toBe('success')
    expect(result.current.error).toBeNull()
    expect(useAuthStore.getState().session).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('sets an error and keeps the session empty when the email is already registered', async () => {
    vi.mocked(registerApi).mockRejectedValueOnce(new Error('email ya registrado'))

    const { result } = renderHook(() => useRegister())

    await act(async () => {
      await result.current.register({ name: 'Juan Perez', email: 'juan@example.com', password: 'SecurePass123' })
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBe('email ya registrado')
    expect(useAuthStore.getState().session).toBeNull()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})