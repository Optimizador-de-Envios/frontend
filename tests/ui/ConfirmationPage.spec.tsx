import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConfirmationPage } from '../../src/ui/pages/ConfirmationPage'

const mockConfirmation = {
  id: 'ORD-001',
  origin: { name: 'Bogotá', lat: 4.71, lng: -74.07 },
  destination: { name: 'Medellín', lat: 6.25, lng: -75.56 },
  weight: 5,
  weightUnit: 'kg',
  priority: 'fast',
  distanceKm: 415.3,
  selectedOption: {
    providerName: 'FedEx',
    cost: 50354.636,
    currency: 'COP',
    estimatedDays: 1,
  },
}

vi.mock('../../src/application/store/recommendationStore', () => ({
  useRecommendationStore: vi.fn(),
}))

vi.mock('../../src/ui/components/ShipmentRouteMap', () => ({
  ShipmentRouteMap: ({ sectionTestId }: { sectionTestId: string }) => (
    <div data-testid={sectionTestId}>ShipmentRouteMap</div>
  ),
}))

import { useRecommendationStore } from '../../src/application/store/recommendationStore'

function setupSuccess() {
  vi.mocked(useRecommendationStore).mockImplementation(
    (selector: (state: any) => any) =>
      selector({
        orderConfirmation: mockConfirmation,
        confirmationStatus: 'success',
        confirmationError: null,
      })
  )
}

describe('ConfirmationPage — success state', () => {
  it('shows the confirmation id', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-id').textContent).toContain('ORD-001')
  })

  it('shows origin name', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-origin').textContent).toContain('Bogotá')
  })

  it('shows destination name', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-destination').textContent).toContain('Medellín')
  })

  it('shows distance in km', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-distance').textContent).toContain('415.3')
  })

  it('shows selected provider name', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-provider').textContent).toContain('FedEx')
  })

  it('shows selected provider cost', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    const expected = (50354.636).toLocaleString('es-CO', { maximumFractionDigits: 0 })
    expect(screen.getByTestId('confirmation-cost').textContent).toContain(expected)
  })

  it('shows selected provider estimated days', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-days').textContent).toContain('1')
  })

  it('shows success banner when confirmationStatus is success', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-success')).toBeDefined()
  })

  it('shows the shipment route map as the final route result', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    expect(screen.getByTestId('shipment-route-section')).toBeDefined()
  })

  it('does not show error banner when status is success', () => {
    setupSuccess()
    render(<ConfirmationPage />)
    expect(screen.queryByTestId('confirmation-error')).toBeNull()
  })
})

describe('ConfirmationPage — error state', () => {
  it('shows error banner when confirmationStatus is error', () => {
    vi.mocked(useRecommendationStore).mockImplementation(
      (selector: (state: any) => any) =>
        selector({
          orderConfirmation: null,
          confirmationStatus: 'error',
          confirmationError: 'Error al confirmar el pedido',
        })
    )
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-error')).toBeDefined()
  })

  it('shows the confirmationError message', () => {
    vi.mocked(useRecommendationStore).mockImplementation(
      (selector: (state: any) => any) =>
        selector({
          orderConfirmation: null,
          confirmationStatus: 'error',
          confirmationError: 'Error al confirmar el pedido',
        })
    )
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-error-message').textContent).toContain(
      'Error al confirmar el pedido'
    )
  })

  it('does not show success banner when status is error', () => {
    vi.mocked(useRecommendationStore).mockImplementation(
      (selector: (state: any) => any) =>
        selector({
          orderConfirmation: null,
          confirmationStatus: 'error',
          confirmationError: 'Error al confirmar el pedido',
        })
    )
    render(<ConfirmationPage />)
    expect(screen.queryByTestId('confirmation-success')).toBeNull()
  })
})

describe('ConfirmationPage — empty state', () => {
  it('shows fallback when orderConfirmation is null and status is idle', () => {
    vi.mocked(useRecommendationStore).mockImplementation(
      (selector: (state: any) => any) =>
        selector({
          orderConfirmation: null,
          confirmationStatus: 'idle',
          confirmationError: null,
        })
    )
    render(<ConfirmationPage />)
    expect(screen.getByTestId('no-confirmation')).toBeDefined()
  })
})
