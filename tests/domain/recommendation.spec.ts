import { describe, expect, it } from 'vitest'
import { isAttemptConfirmed } from '../../src/domain/recommendation'

describe('isAttemptConfirmed (F0)', () => {
  const recommendation = {
    recommendation: {
      providerName: 'Local',
      cost: 30386.59,
      currency: 'COP',
      estimatedDays: 1,
    },
    alternatives: [],
    confirmationToken: 'token-123',
  }

  const confirmation = {
    id: 'abc-123',
    confirmationToken: 'token-123',
    origin: { name: 'Tunja, BY, Colombia', lat: 5.53528, lng: -73.36778 },
    destination: { name: 'Bogotá, DC, Colombia', lat: 4.635456, lng: -74.08768 },
    weight: 5,
    weightUnit: 'KILOGRAMS',
    priority: 'COST',
    distanceKm: 148.3,
    selectedOption: {
      providerName: 'Local',
      cost: 30386.59,
      currency: 'COP',
      estimatedDays: 1,
    },
  }

  it('returns false when there is no confirmation for the attempt', () => {
    expect(isAttemptConfirmed(recommendation as any, null)).toBe(false)
  })

  it('returns true when the confirmation token matches the current attempt', () => {
    expect(isAttemptConfirmed(recommendation as any, confirmation as any)).toBe(true)
  })

  it('returns false when the confirmation belongs to another attempt', () => {
    expect(
      isAttemptConfirmed(
        recommendation as any,
        { ...confirmation, confirmationToken: 'token-999' } as any
      )
    ).toBe(false)
  })
})