import { describe, expect, it } from 'vitest'
import {
  normalizeUserOrderSummaries,
  normalizeUserOrderSummary,
} from '../../src/domain/userOrderSummary'

describe('user order summary domain (F1)', () => {
  const rawOrder = {
    id: 'a2fbf767-f7e3-4f9d-a8d4-7051119816c2',
    origin: { name: 'Tunja, BY, Colombia', lat: 5.53528, lng: -73.36778 },
    destination: { name: 'Bogota, DC, Colombia', lat: 4.635456, lng: -74.08768 },
    weight: 10,
    weightUnit: 'KILOGRAMS',
    priority: 'COST',
    distanceKm: 148.3,
    selectedOption: {
      providerName: 'Local',
      cost: 30386.59,
      currency: 'COP',
      estimatedDays: 1,
    },
    createdAt: '2026-04-03T18:35:00Z',
    confirmationToken: 'token-ignored-by-history',
  }

  it('normalizes a shipment-service history item into a consistent domain summary', () => {
    expect(normalizeUserOrderSummary(rawOrder as never)).toEqual({
      id: 'a2fbf767-f7e3-4f9d-a8d4-7051119816c2',
      origin: { name: 'Tunja, BY, Colombia', lat: 5.53528, lng: -73.36778 },
      destination: { name: 'Bogota, DC, Colombia', lat: 4.635456, lng: -74.08768 },
      weight: 10,
      weightUnit: 'KILOGRAMS',
      priority: 'COST',
      distanceKm: 148.3,
      selectedOption: {
        providerName: 'Local',
        cost: 30386.59,
        currency: 'COP',
        estimatedDays: 1,
      },
      createdAt: '2026-04-03T18:35:00Z',
    })
  })

  it('normalizes a collection of history items', () => {
    expect(normalizeUserOrderSummaries([rawOrder as never])).toEqual([
      {
        id: 'a2fbf767-f7e3-4f9d-a8d4-7051119816c2',
        origin: { name: 'Tunja, BY, Colombia', lat: 5.53528, lng: -73.36778 },
        destination: { name: 'Bogota, DC, Colombia', lat: 4.635456, lng: -74.08768 },
        weight: 10,
        weightUnit: 'KILOGRAMS',
        priority: 'COST',
        distanceKm: 148.3,
        selectedOption: {
          providerName: 'Local',
          cost: 30386.59,
          currency: 'COP',
          estimatedDays: 1,
        },
        createdAt: '2026-04-03T18:35:00Z',
      },
    ])
  })
})