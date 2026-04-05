import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegisterPage } from '../../src/ui/pages/RegisterPage'

const mockRegister = vi.fn()

vi.mock('../../src/application/hooks/useRegister', () => ({
  useRegister: () => ({
    status: 'idle',
    error: null,
    register: mockRegister,
  }),
}))

vi.mock('../../src/ui/components/RegisterForm', () => ({
  RegisterForm: ({ onSubmit }: { onSubmit: (payload: { name: string; email: string; password: string }) => void }) => (
    <button
      data-testid="register-form"
      onClick={() => onSubmit({ name: 'Juan Perez', email: 'juan@example.com', password: 'SecurePass123' })}
    >
      RegisterForm
    </button>
  ),
}))

describe('RegisterPage (F5)', () => {
  it('renders the register form and calls the hook submit handler', () => {
    render(<RegisterPage />)

    fireEvent.click(screen.getByTestId('register-form'))

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Juan Perez',
      email: 'juan@example.com',
      password: 'SecurePass123',
    })
  })

  it('offers a navigation link to login', () => {
    render(<RegisterPage />)

    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeDefined()
  })
})