import { describe, it, expect } from 'vitest'
import { validateOrder, toKilograms } from '../../src/domain/order'

describe('validateOrder (HU-01)', () => {
  it('should validate a correct order with KILOGRAMS', () => {
    const order = {
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 1,
      weightUnit: 'KILOGRAMS' as const,
    }
    const result = validateOrder(order)
    expect(result.valid).toBe(true)
  })

  it('should fail when all fields are missing', () => {
    const order = { origin: undefined, destination: undefined, weight: undefined, weightUnit: undefined }
    const result = validateOrder(order)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should fail when weight in KG exceeds maximum (70 Kg)', () => {
    const order = {
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 100,
      weightUnit: 'KILOGRAMS' as const,
    }
    const result = validateOrder(order)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => /weight/i.test(e))).toBe(true)
  })

  it('should validate a correct order when weight is in GRAMS', () => {
    const order = {
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 1000,
      weightUnit: 'GRAMS' as const,
    }
    const result = validateOrder(order)
    expect(result.valid).toBe(true)
  })

  it('should validate a correct order when weight is in POUNDS', () => {
    const order = {
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 2.2,
      weightUnit: 'POUNDS' as const,
    }
    const result = validateOrder(order)
    expect(result.valid).toBe(true)
  })

  it('should fail when weight in POUNDS exceeds max allowed (70 Kg)', () => {
    const order = {
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 200,
      weightUnit: 'POUNDS' as const,
    }
    const result = validateOrder(order)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => /weight/i.test(e))).toBe(true)
  })

  it('should fail when weight in GRAMS is below minimum (0.001 Kg = 1g)', () => {
    const order = {
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 0.5,
      weightUnit: 'GRAMS' as const,
    }
    const result = validateOrder(order)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => /weight/i.test(e))).toBe(true)
  })

  it('should fail when weightUnit is missing', () => {
    const order = {
      origin: { name: 'Bogotá', lat: 4.711, lng: -74.072 },
      destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
      weight: 1,
      weightUnit: undefined,
    }
    const result = validateOrder(order)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => /weightUnit/i.test(e))).toBe(true)
  })
})

describe('toKilograms', () => {
  it('should return same value for KILOGRAMS', () => {
    expect(toKilograms(5, 'KILOGRAMS')).toBe(5)
  })

  it('should convert GRAMS to KILOGRAMS', () => {
    expect(toKilograms(1000, 'GRAMS')).toBe(1)
  })

  it('should convert POUNDS to KILOGRAMS', () => {
    expect(toKilograms(1, 'POUNDS')).toBeCloseTo(0.453592)
  })
})
