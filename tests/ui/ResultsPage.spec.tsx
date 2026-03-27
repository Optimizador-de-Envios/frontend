import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsPage } from '../../src/ui/pages/ResultsPage'

const mockRecommendation = {
  recommendation: {
    providerName: 'Local',
    cost: 30386.59,
    currency: 'COP',
    estimatedDays: 1,
  },
  alternatives: [
    { providerName: 'FedEx', cost: 50354.636, currency: 'COP', estimatedDays: 1 },
    { providerName: 'DHL', cost: 34591.06, currency: 'COP', estimatedDays: 1 },
  ],
}

vi.mock('../../src/application/hooks/useRecommendation', () => ({
  useRecommendation: vi.fn(),
}))

import { useRecommendation } from '../../src/application/hooks/useRecommendation'

describe('ResultsPage (HU-03)', () => {
  it('shows recommended provider name', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: mockRecommendation,
      loading: false,
      error: null,
      fetchRecommendation: vi.fn(),
    })
    render(<ResultsPage />)
    expect(screen.getByTestId('recommendation-provider').textContent).toContain('Local')
  })

  it('shows recommended cost', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: mockRecommendation,
      loading: false,
      error: null,
      fetchRecommendation: vi.fn(),
    })
    render(<ResultsPage />)
    const expected = (30386.59).toLocaleString('es-CO', { maximumFractionDigits: 0 })
    expect(screen.getByTestId('recommendation-cost').textContent).toContain(expected)
  })

  it('shows estimated days', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: mockRecommendation,
      loading: false,
      error: null,
      fetchRecommendation: vi.fn(),
    })
    render(<ResultsPage />)
    expect(screen.getByTestId('recommendation-days').textContent).toContain('1')
  })

  it('shows loading indicator when loading is true', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: null,
      loading: true,
      error: null,
      fetchRecommendation: vi.fn(),
    })
    render(<ResultsPage />)
    expect(screen.getByTestId('loading')).toBeDefined()
  })

  it('shows error message when error is not null', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: null,
      loading: false,
      error: 'Network error',
      fetchRecommendation: vi.fn(),
    })
    render(<ResultsPage />)
    expect(screen.getByTestId('error').textContent).toContain('Network error')
  })

  it('shows empty state when recommendation is null and not loading', () => {
    vi.mocked(useRecommendation).mockReturnValue({
      recommendation: null,
      loading: false,
      error: null,
      fetchRecommendation: vi.fn(),
    })
    render(<ResultsPage />)
    expect(screen.getByTestId('no-recommendation')).toBeDefined()
  })
})
