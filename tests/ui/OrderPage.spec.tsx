import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrderPage } from '../../src/ui/pages/OrderPage'

const mockFetchRecommendation = vi.fn()
const mockSetPriority = vi.fn()

vi.mock('../../src/application/hooks/useOrder', () => ({
  useOrder: () => ({
    order: {
      origin: { name: 'Tunja', lat: 5.53528, lng: -73.36778 },
      destination: { name: 'Bogotá', lat: 4.635456, lng: -74.08768 },
      weight: 10,
      weightUnit: 'KILOGRAMS',
      priority: undefined,
    },
    priority: null,
    submitOrder: vi.fn(),
    clearOrder: vi.fn(),
    setPriority: mockSetPriority,
  }),
}))

vi.mock('../../src/application/hooks/useRecommendation', () => ({
  useRecommendation: () => ({
    recommendation: null,
    loading: false,
    error: null,
    fetchRecommendation: mockFetchRecommendation,
  }),
}))

// Mock OrderForm — only tests orchestration, not form internals
vi.mock('../../src/ui/components/OrderForm', () => ({
  OrderForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <div>
      <span data-testid="order-form">OrderForm</span>
      <button data-testid="btn-success" onClick={onSuccess}>
        Simular éxito
      </button>
    </div>
  ),
}))

// Mock PrioritySelector — only tests that OrderPage renders it at the right step
vi.mock('../../src/ui/components/PrioritySelector', () => ({
  PrioritySelector: ({ onConfirm }: { onConfirm: (p: string) => void }) => (
    <div data-testid="priority-selector">
      <button onClick={() => onConfirm('COST')}>Confirmar</button>
    </div>
  ),
}))

describe('OrderPage (HU-02)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows OrderForm initially', () => {
    render(<OrderPage />)
    expect(screen.getByTestId('order-form')).toBeDefined()
  })

  it('hides OrderForm and shows PrioritySelector after form success', () => {
    render(<OrderPage />)
    fireEvent.click(screen.getByTestId('btn-success'))
    expect(screen.queryByTestId('order-form')).toBeNull()
    expect(screen.getByTestId('priority-selector')).toBeDefined()
  })
})

describe('OrderPage (HU-03)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls fetchRecommendation with order and priority when PrioritySelector confirms', () => {
    render(<OrderPage />)
    fireEvent.click(screen.getByTestId('btn-success'))
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(mockFetchRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 'COST' })
    )
  })

  it('calls setPriority with selected priority when PrioritySelector confirms', () => {
    render(<OrderPage />)
    fireEvent.click(screen.getByTestId('btn-success'))
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(mockSetPriority).toHaveBeenCalledWith('COST')
  })
})
