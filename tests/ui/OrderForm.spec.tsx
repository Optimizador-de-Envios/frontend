import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OrderForm } from '../../src/ui/components/OrderForm'

// Mock useOrder — form must not depend on full store wiring in unit tests
vi.mock('../../src/application/hooks/useOrder', () => ({
  useOrder: vi.fn(() => ({
    order: null,
    priority: null,
    submitOrder: vi.fn(() => ({ valid: false, errors: [] })),
    clearOrder: vi.fn(),
    setPriority: vi.fn(),
  })),
}))

// Mock useAutocomplete — LocationInput must not trigger real fetches
vi.mock('../../src/application/hooks/useAutocomplete', () => ({
  useAutocomplete: vi.fn(() => ({
    suggestions: [],
    loading: false,
    search: vi.fn(),
  })),
}))

import { useOrder } from '../../src/application/hooks/useOrder'

const mockSubmitOrder = vi.fn()
const mockClearOrder  = vi.fn()

describe('OrderForm (HU-01)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useOrder).mockReturnValue({
      order: null,
      priority: null,
      submitOrder: mockSubmitOrder,
      clearOrder: mockClearOrder,
      setPriority: vi.fn(),
    })
  })

  it('renders origin, destination and weight fields', () => {
    render(<OrderForm />)
    expect(screen.getByTestId('input-origin')).toBeDefined()
    expect(screen.getByTestId('input-destination')).toBeDefined()
    expect(screen.getByTestId('input-weight')).toBeDefined()
  })

  it('renders a submit button labeled Calcular envío', () => {
    render(<OrderForm />)
    expect(screen.getByRole('button', { name: /calcular/i })).toBeDefined()
  })

  it('calls submitOrder when the form is submitted', () => {
    mockSubmitOrder.mockReturnValue({ valid: false, errors: [] })
    render(<OrderForm />)
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }))
    expect(mockSubmitOrder).toHaveBeenCalledTimes(1)
  })

  it('shows validation error messages returned by submitOrder', async () => {
    mockSubmitOrder.mockReturnValue({
      valid: false,
      errors: [
        'origin is required and must include name, lat and lng',
        'weight is required',
      ],
    })

    render(<OrderForm />)
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }))

    await waitFor(() => {
      expect(screen.getByText(/origin is required/i)).toBeDefined()
      expect(screen.getByText(/weight is required/i)).toBeDefined()
    })
  })

  it('shows success message when submitOrder returns valid=true', async () => {
    mockSubmitOrder.mockReturnValue({ valid: true, errors: [] })

    render(<OrderForm />)
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }))

    await waitFor(() => {
      expect(screen.getByTestId('order-success')).toBeDefined()
    })
  })
})
