import { describe, it, expect } from 'vitest'
import { buildOrderPayload } from '../../src/infrastructure/api/orderApiService'

const validOrder = {
  origin: { name: 'Tunja, BY, Colombia', lng: -73.36778, lat: 5.53528 },
  destination: { name: 'Bogotá, DC, Colombia', lng: -74.08768, lat: 4.635456 },
  weight: 10,
  weightUnit: 'KILOGRAMS' as const,
  priority: 'COST' as const,
}

describe('buildOrderPayload (HU-03)', () => {
  it('wraps the order inside an "order" key', () => {
    const payload = buildOrderPayload(validOrder)
    expect(payload).toHaveProperty('order')
  })

  it('includes origin with name, lat and lng', () => {
    const payload = buildOrderPayload(validOrder)
    expect(payload.order.origin).toEqual({
      name: 'Tunja, BY, Colombia',
      lng: -73.36778,
      lat: 5.53528,
    })
  })

  it('includes destination with name, lat and lng', () => {
    const payload = buildOrderPayload(validOrder)
    expect(payload.order.destination).toEqual({
      name: 'Bogotá, DC, Colombia',
      lng: -74.08768,
      lat: 4.635456,
    })
  })

  it('includes weight and weightUnit', () => {
    const payload = buildOrderPayload(validOrder)
    expect(payload.order.weight).toBe(10)
    expect(payload.order.weightUnit).toBe('KILOGRAMS')
  })

  it('includes priority', () => {
    const payload = buildOrderPayload(validOrder)
    expect(payload.order.priority).toBe('COST')
  })

  it('builds correct payload for TIME priority', () => {
    const order = { ...validOrder, priority: 'TIME' as const }
    const payload = buildOrderPayload(order)
    expect(payload.order.priority).toBe('TIME')
  })
})
