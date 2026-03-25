import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrderPage } from '../../src/ui/pages/OrderPage'

// Mock OrderForm — only tests orchestration, not form internals
// Renders a "success" button to simulate onSuccess being called
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
