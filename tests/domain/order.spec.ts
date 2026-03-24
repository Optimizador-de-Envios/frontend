import { describe, it, expect } from 'vitest'
import { validateOrder } from '../../src/domain/order'

describe('validateOrder (HU-01)', () => {
  it('should validate a correct order', () => {
    const order = {
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 1,
    }

    const result = validateOrder(order as any)
    expect(result.valid).toBe(true)
  })

  it('should fail when fields are missing', () => {
    const order = { origin: undefined, destination: undefined, weight: undefined }
    const result = validateOrder(order as any)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should fail when weight is out of allowed range', () => {
    const order = {
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 100,
    }

    const result = validateOrder(order as any)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => /weight/i.test(e))).toBe(true)
  })
})
