import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppHeader } from '../../src/ui/components/AppHeader'

const mockUseAuth = vi.fn()

vi.mock('../../src/application/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('AppHeader (F4)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows public actions when there is no session', () => {
    mockUseAuth.mockReturnValue({
      session: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeDefined()
    expect(screen.getByRole('link', { name: /registrarme/i })).toBeDefined()
  })

  it('shows authenticated actions when a session exists', () => {
    const logout = vi.fn()
    mockUseAuth.mockReturnValue({
      session: { user: { id: '1', name: 'Juan Perez', email: 'juan@example.com' } },
      isAuthenticated: true,
      login: vi.fn(),
      logout,
    })

    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    )

    expect(screen.getByText(/juan perez/i)).toBeDefined()
    expect(screen.getByRole('link', { name: /historial/i })).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }))
    expect(logout).toHaveBeenCalledOnce()
  })
})