import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegisterForm } from '../../src/ui/components/RegisterForm'

describe('RegisterForm (F4)', () => {
  it('renders the expected fields and submit action', () => {
    render(<RegisterForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/nombre/i)).toBeDefined()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeDefined()
    expect(screen.getByLabelText(/contraseña/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /registrarme/i })).toBeDefined()
  })

  it('submits registration data when the form is filled', () => {
    const onSubmit = vi.fn()
    render(<RegisterForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan Perez' } })
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@example.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'SecurePass123' } })
    fireEvent.click(screen.getByRole('button', { name: /registrarme/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Juan Perez',
      email: 'juan@example.com',
      password: 'SecurePass123',
    })
  })

  it('shows the error message when provided', () => {
    render(<RegisterForm onSubmit={vi.fn()} error="email ya registrado" />)

    expect(screen.getByRole('alert').textContent).toContain('email ya registrado')
  })

  it('disables submit while loading', () => {
    render(<RegisterForm onSubmit={vi.fn()} loading />)

    expect(screen.getByRole('button', { name: /registrarme/i })).toBeDisabled()
  })
})