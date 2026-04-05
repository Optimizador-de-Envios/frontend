import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '../../src/ui/components/LoginForm'

describe('LoginForm (F4)', () => {
  it('renders the expected fields and submit action', () => {
    render(<LoginForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/correo electrónico/i)).toBeDefined()
    expect(screen.getByLabelText(/contraseña/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeDefined()
  })

  it('submits credentials when the form is filled', () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@example.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'SecurePass123' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'juan@example.com',
      password: 'SecurePass123',
    })
  })

  it('shows the error message when provided', () => {
    render(<LoginForm onSubmit={vi.fn()} error="Credenciales inválidas" />)

    expect(screen.getByRole('alert').textContent).toContain('Credenciales inválidas')
  })

  it('disables submit while loading', () => {
    render(<LoginForm onSubmit={vi.fn()} loading />)

    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeDisabled()
  })
})