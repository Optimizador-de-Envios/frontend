import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from '../../src/ui/pages/LoginPage'

const mockLogin = vi.fn()
const mockUseLocation = vi.fn()
const mockUseLogin = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    useLocation: () => mockUseLocation(),
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  }
})

vi.mock('../../src/application/hooks/useLogin', () => ({
  useLogin: (redirectTo?: string) => {
    mockUseLogin(redirectTo)
    return {
    status: 'idle',
    error: null,
    login: mockLogin,
    redirectTo,
    }
  },
}))

vi.mock('../../src/ui/components/LoginForm', () => ({
  LoginForm: ({ onSubmit }: { onSubmit: (payload: { email: string; password: string }) => void }) => (
    <button data-testid="login-form" onClick={() => onSubmit({ email: 'juan@example.com', password: 'SecurePass123' })}>
      LoginForm
    </button>
  ),
}))

describe('LoginPage (F5)', () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({ state: null })
    mockUseLogin.mockReset()
  })

  function renderLoginPage() {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
  }

  it('renders the login form and calls the hook submit handler', () => {
    renderLoginPage()

    fireEvent.click(screen.getByTestId('login-form'))

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'juan@example.com',
      password: 'SecurePass123',
    })
  })

  it('offers a navigation link to register', () => {
    renderLoginPage()

    expect(screen.getByRole('link', { name: /crear cuenta/i })).toBeDefined()
  })

  it('renders the public header actions', () => {
    renderLoginPage()

    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeDefined()
    expect(screen.getByRole('link', { name: /registrarme/i })).toBeDefined()
  })

  it('passes the original protected route to the login hook when available', () => {
    mockUseLocation.mockReturnValue({ state: { from: { pathname: '/results' } } })

    renderLoginPage()

    expect(mockUseLogin).toHaveBeenCalledWith('/results')
  })
})