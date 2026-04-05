import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi } from '../../infrastructure/api/authApiService'
import { createAuthSession } from '../../domain/auth'
import { useAuthStore } from '../store/authStore'

type LoginCredentials = {
  email: string
  password: string
}

type LoginStatus = 'idle' | 'loading' | 'success' | 'error'

export function useLogin(redirectTo = '/'): {
  status: LoginStatus
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
} {
  const loginSession = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const [status, setStatus] = useState<LoginStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setStatus('loading')
    setError(null)

    try {
      const response = await loginApi(credentials)
      loginSession(createAuthSession(response))
      setStatus('success')
      navigate(redirectTo)
    } catch (caughtError) {
      setStatus('error')
      setError(caughtError instanceof Error ? caughtError.message : 'Unknown error')
    }
  }, [loginSession, navigate, redirectTo])

  return { status, error, login }
}