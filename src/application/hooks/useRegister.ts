import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as registerApi } from '../../infrastructure/api/authApiService'

type RegisterPayload = {
  name: string
  email: string
  password: string
}

type RegisterStatus = 'idle' | 'loading' | 'success' | 'error'

export function useRegister(): {
  status: RegisterStatus
  error: string | null
  register: (payload: RegisterPayload) => Promise<void>
} {
  const navigate = useNavigate()
  const [status, setStatus] = useState<RegisterStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(async (payload: RegisterPayload) => {
    setStatus('loading')
    setError(null)

    try {
      await registerApi(payload)
      setStatus('success')
      navigate('/login')
    } catch (caughtError) {
      setStatus('error')
      setError(caughtError instanceof Error ? caughtError.message : 'Unknown error')
    }
  }, [navigate])

  return { status, error, register }
}