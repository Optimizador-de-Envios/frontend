import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import type { AuthSession } from '../../domain/auth'

type AuthState = {
  session: AuthSession | null
  login: (session: AuthSession) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        session: null,
        login: (session: AuthSession) => set(() => ({ session }), false, 'login'),
        logout: () => set(() => ({ session: null }), false, 'logout'),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: 'AuthStore' }
  )
)