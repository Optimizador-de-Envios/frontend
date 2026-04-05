import { useCallback, useEffect } from 'react'
import { isAuthSessionActive } from '../../domain/auth'
import { useAuthStore } from '../store/authStore'
import { useOrderStore } from '../store/orderStore'
import { useRecommendationStore } from '../store/recommendationStore'
import { logoutSessionService } from '../services/sessionService'

export function useAuth() {
  const session = useAuthStore((state) => state.session)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const clearOrder = useOrderStore((state) => state.clearOrder)
  const clearRecommendation = useRecommendationStore((state) => state.clearRecommendation)
  const isAuthenticated = isAuthSessionActive(session)

  const logoutAll = useCallback(
    () => logoutSessionService(logout, clearOrder, clearRecommendation),
    [logout, clearOrder, clearRecommendation]
  )

  useEffect(() => {
    if (session && !isAuthSessionActive(session)) {
      logoutAll()
    }
  }, [session, logoutAll])

  return {
    session: isAuthenticated ? session : null,
    isAuthenticated,
    login,
    logout: logoutAll,
  }
}