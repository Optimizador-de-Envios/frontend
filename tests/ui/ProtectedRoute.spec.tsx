import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../../src/ui/components/ProtectedRoute'

const mockUseAuth = vi.fn()

vi.mock('../../src/application/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route
          path="/private"
          element={
            <ProtectedRoute>
              <div data-testid="protected-content">Protected</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute (F4)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the protected content when the user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      session: { user: { id: '1', name: 'Juan', email: 'juan@example.com' } },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })

    renderProtectedRoute()

    expect(screen.getByTestId('protected-content')).toBeDefined()
  })

  it('redirects to login when there is no authenticated session', () => {
    mockUseAuth.mockReturnValue({
      session: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    renderProtectedRoute()

    expect(screen.getByTestId('login-page')).toBeDefined()
  })
})