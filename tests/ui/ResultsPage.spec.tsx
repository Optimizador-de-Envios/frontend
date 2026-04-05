import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ResultsPage } from '../../src/ui/pages/ResultsPage'

const mockOrder = {
  origin: { name: 'Bogotá', lat: 4.71, lng: -74.07 },
  destination: { name: 'Medellín', lat: 6.25, lng: -75.56 },
  weight: 5,
  weightUnit: 'kg' as const,
  priority: 'fast' as const,
}

const mockRecommendation = {
  recommendation: {
    providerName: 'Local',
    cost: 30386.59,
    currency: 'COP',
    estimatedDays: 1,
  },
  confirmationToken: 'token-123',
  alternatives: [
    { providerName: 'FedEx', cost: 50354.636, currency: 'COP', estimatedDays: 1 },
    { providerName: 'DHL', cost: 34591.06, currency: 'COP', estimatedDays: 1 },
  ],
}

vi.mock('../../src/application/hooks/useRecommendation', () => ({
  useRecommendation: vi.fn(),
}))

vi.mock('../../src/application/hooks/useConfirmOrder', () => ({
  useConfirmOrder: vi.fn(),
}))

vi.mock('../../src/application/store/orderStore', () => ({
  useOrderStore: vi.fn(),
}))

import { useRecommendation } from '../../src/application/hooks/useRecommendation'
import { useConfirmOrder } from '../../src/application/hooks/useConfirmOrder'
import { useOrderStore } from '../../src/application/store/orderStore'

const mockConfirm = vi.fn()

function setupMocks(overrides = {}) {
  vi.mocked(useRecommendation).mockReturnValue({
    recommendation: mockRecommendation,
    loading: false,
    error: null,
    fetchRecommendation: vi.fn(),
    ...overrides,
  })
  vi.mocked(useConfirmOrder).mockReturnValue({
    confirmationStatus: 'idle',
    confirmationError: null,
    currentAttemptConfirmed: false,
    canConfirm: true,
    confirm: mockConfirm,
  })
  vi.mocked(useOrderStore).mockImplementation(
    (selector: (state: any) => any) =>
      selector({ order: mockOrder, setOrder: vi.fn(), setPriority: vi.fn(), clearOrder: vi.fn() })
  )
}

function renderResultsPage() {
  return render(
    <MemoryRouter>
      <ResultsPage />
    </MemoryRouter>
  )
}

describe('ResultsPage (HU-03)', () => {
  it('shows recommended provider name', () => {
    setupMocks()
    renderResultsPage()
    expect(screen.getByTestId('recommendation-provider').textContent).toContain('Local')
  })

  it('shows recommended cost', () => {
    setupMocks()
    renderResultsPage()
    const expected = (30386.59).toLocaleString('es-CO', { maximumFractionDigits: 0 })
    expect(screen.getByTestId('recommendation-cost').textContent).toContain(expected)
  })

  it('shows estimated days', () => {
    setupMocks()
    renderResultsPage()
    expect(screen.getByTestId('recommendation-days').textContent).toContain('1')
  })

  it('shows loading indicator when loading is true', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: null,
      loading: true,
      error: null,
      fetchRecommendation: vi.fn(),
    })
    vi.mocked(useConfirmOrder).mockReturnValue({
      confirmationStatus: 'idle',
      confirmationError: null,
      currentAttemptConfirmed: false,
      canConfirm: true,
      confirm: mockConfirm,
    })
    renderResultsPage()
    expect(screen.getByTestId('loading')).toBeDefined()
  })

  it('shows error message when error is not null', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: null,
      loading: false,
      error: 'Network error',
      fetchRecommendation: vi.fn(),
    })
    vi.mocked(useConfirmOrder).mockReturnValue({
      confirmationStatus: 'idle',
      confirmationError: null,
      currentAttemptConfirmed: false,
      canConfirm: true,
      confirm: mockConfirm,
    })
    renderResultsPage()
    expect(screen.getByTestId('error').textContent).toContain('Network error')
  })

  it('shows empty state when recommendation is null and not loading', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: null,
      loading: false,
      error: null,
      fetchRecommendation: vi.fn(),
    })
    vi.mocked(useConfirmOrder).mockReturnValue({
      confirmationStatus: 'idle',
      confirmationError: null,
      currentAttemptConfirmed: false,
      canConfirm: true,
      confirm: mockConfirm,
    })
    renderResultsPage()
    expect(screen.getByTestId('no-recommendation')).toBeDefined()
  })
})

describe('ResultsPage (HU-05) — selection and confirmation', () => {
  it('renders the recommended option as a card', () => {
    setupMocks()
    renderResultsPage()
    expect(screen.getByTestId('option-card-Local')).toBeDefined()
  })

  it('renders all alternative options as cards', () => {
    setupMocks()
    renderResultsPage()
    expect(screen.getByTestId('option-card-FedEx')).toBeDefined()
    expect(screen.getByTestId('option-card-DHL')).toBeDefined()
  })

  it('each card has a "Seleccionar" button', () => {
    setupMocks()
    renderResultsPage()
    expect(screen.getByTestId('select-button-Local')).toBeDefined()
    expect(screen.getByTestId('select-button-FedEx')).toBeDefined()
    expect(screen.getByTestId('select-button-DHL')).toBeDefined()
  })

  it('confirm button is disabled when no option is selected', () => {
    setupMocks()
    renderResultsPage()
    const btn = screen.getByTestId('confirm-button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('confirm button is enabled after clicking a select button', () => {
    setupMocks()
    renderResultsPage()
    fireEvent.click(screen.getByTestId('select-button-Local'))
    const btn = screen.getByTestId('confirm-button') as HTMLButtonElement
    expect(btn.disabled).toBe(false)
  })

  it('confirm button is enabled after clicking an alternative select button', () => {
    setupMocks()
    renderResultsPage()
    fireEvent.click(screen.getByTestId('select-button-DHL'))
    const btn = screen.getByTestId('confirm-button') as HTMLButtonElement
    expect(btn.disabled).toBe(false)
  })

  it('calls confirm with the selected option when confirm button is clicked', () => {
    setupMocks()
    renderResultsPage()
    fireEvent.click(screen.getByTestId('select-button-FedEx'))
    fireEvent.click(screen.getByTestId('confirm-button'))
    expect(mockConfirm).toHaveBeenCalledOnce()
    expect(mockConfirm).toHaveBeenCalledWith(
      expect.anything(),
      { providerName: 'FedEx', cost: 50354.636, currency: 'COP', estimatedDays: 1 }
    )
  })

  it('shows no-alternatives message when alternatives array is empty', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: { ...mockRecommendation, alternatives: [] },
      loading: false,
      error: null,
      fetchRecommendation: vi.fn(),
    })
    vi.mocked(useConfirmOrder).mockReturnValue({
      confirmationStatus: 'idle',
      confirmationError: null,
      currentAttemptConfirmed: false,
      canConfirm: true,
      confirm: mockConfirm,
    })
    renderResultsPage()
    expect(screen.getByTestId('no-alternatives')).toBeDefined()
  })

  it('keeps the confirm button disabled when the current attempt was already confirmed', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: mockRecommendation,
      loading: false,
      error: null,
      fetchRecommendation: vi.fn(),
    })

    vi.mocked(useConfirmOrder).mockReturnValue({
      confirmationStatus: 'success',
      confirmationError: null,
      confirm: mockConfirm,
      currentAttemptConfirmed: true,
      canConfirm: false,
    } as any)

    renderResultsPage()

    fireEvent.click(screen.getByTestId('select-button-Local'))

    const btn = screen.getByTestId('confirm-button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('shows an alert-style message when the current attempt was already confirmed', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: mockRecommendation,
      loading: false,
      error: null,
      fetchRecommendation: vi.fn(),
    })

    vi.mocked(useConfirmOrder).mockReturnValue({
      confirmationStatus: 'success',
      confirmationError: null,
      confirm: mockConfirm,
      currentAttemptConfirmed: true,
      canConfirm: false,
    } as any)

    renderResultsPage()

    expect(screen.getByRole('alert')).toBeDefined()
    expect(screen.getByTestId('attempt-confirmed-message').textContent).toContain('ya fue confirmado')
  })
})
