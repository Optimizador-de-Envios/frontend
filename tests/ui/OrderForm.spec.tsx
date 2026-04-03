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
import { useAutocomplete } from '../../src/application/hooks/useAutocomplete'

const mockSubmitOrder = vi.fn()
const mockClearOrder  = vi.fn()
const mockSearch = vi.fn()
let autocompleteCallIndex = 0

const mockOrigin = { name: 'Bogotá, Colombia', lat: 4.6097, lng: -74.0818 }
const mockDestination = { name: 'Medellín, Colombia', lat: 6.2518, lng: -75.5636 }

describe('OrderForm (HU-01)', () => {
  beforeEach(() => {
    autocompleteCallIndex = 0
    vi.clearAllMocks()
    vi.mocked(useOrder).mockReturnValue({
      order: null,
      priority: null,
      submitOrder: mockSubmitOrder,
      clearOrder: mockClearOrder,
      setPriority: vi.fn(),
    })
    vi.mocked(useAutocomplete).mockImplementation(() => {
      autocompleteCallIndex += 1

      return autocompleteCallIndex % 2 === 1
        ? {
            suggestions: [mockOrigin],
            loading: false,
            search: mockSearch,
          }
        : {
            suggestions: [mockDestination],
            loading: false,
            search: mockSearch,
          }
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

describe('OrderForm (HU-06)', () => {
  beforeEach(() => {
    autocompleteCallIndex = 0
    vi.clearAllMocks()
    vi.mocked(useOrder).mockReturnValue({
      order: null,
      priority: null,
      submitOrder: mockSubmitOrder,
      clearOrder: mockClearOrder,
      setPriority: vi.fn(),
    })
  })

  it('shows a route preview as soon as origin and destination are selected with coordinates', async () => {
    vi.mocked(useAutocomplete).mockImplementation(() => {
      autocompleteCallIndex += 1

      return autocompleteCallIndex % 2 === 1
        ? {
            suggestions: [mockOrigin],
            loading: false,
            search: mockSearch,
          }
        : {
            suggestions: [mockDestination],
            loading: false,
            search: mockSearch,
          }
    })

    render(<OrderForm />)

    fireEvent.focus(screen.getByTestId('input-origin'))
    fireEvent.click(screen.getByText('Bogotá, Colombia'))

    fireEvent.focus(screen.getByTestId('input-destination'))
    fireEvent.click(screen.getByText('Medellín, Colombia'))

    await waitFor(() => {
      expect(screen.getByTestId('shipment-route-preview')).toBeDefined()
    })
  })

  it('does not show the route preview when only one endpoint has been selected', () => {
    vi.mocked(useAutocomplete).mockImplementation(() => {
      autocompleteCallIndex += 1

      return autocompleteCallIndex % 2 === 1
        ? {
            suggestions: [mockOrigin],
            loading: false,
            search: mockSearch,
          }
        : {
            suggestions: [],
            loading: false,
            search: mockSearch,
          }
    })

    render(<OrderForm />)

    fireEvent.focus(screen.getByTestId('input-origin'))
    fireEvent.click(screen.getByText('Bogotá, Colombia'))

    expect(screen.queryByTestId('shipment-route-preview')).toBeNull()
  })
})
