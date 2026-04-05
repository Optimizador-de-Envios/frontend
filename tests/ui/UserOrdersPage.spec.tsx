import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserOrdersPage } from '../../src/ui/pages/UserOrdersPage'

const refreshOrders = vi.fn()

vi.mock('../../src/application/hooks/useUserOrders', () => ({
  useUserOrders: () => ({
    orders: [],
    loading: false,
    error: null,
    refreshOrders,
  }),
}))

vi.mock('../../src/ui/components/AppHeader', () => ({
  AppHeader: () => <div data-testid="app-header">Header</div>,
}))

describe('UserOrdersPage (F5)', () => {
  it('renders the history title and loads orders on mount', () => {
    render(<UserOrdersPage />)

    expect(screen.getByText(/historial de pedidos/i)).toBeDefined()
    expect(refreshOrders).toHaveBeenCalledOnce()
  })

  it('shows empty state when there are no orders', () => {
    render(<UserOrdersPage />)

    expect(screen.getByText(/no existen pedidos/i)).toBeDefined()
  })
})