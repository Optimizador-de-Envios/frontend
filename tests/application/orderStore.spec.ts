import { describe, it, expect, beforeEach } from 'vitest'
import { useOrderStore } from '../../src/application/store/orderStore'
import { SHIPPING_PRIORITY } from '../../src/domain/order'

const validOrder = {
  origin:      { name: 'Bogotá',   lat: 4.711, lng: -74.072 },
  destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
  weight:      1,
  weightUnit:  'KILOGRAMS' as const,
}

describe('useOrderStore (HU-01)', () => {
  beforeEach(() => {
    useOrderStore.getState().clearOrder()
  })

  it('should have null order as initial state', () => {
    expect(useOrderStore.getState().order).toBeNull()
  })

  it('should update order when setOrder is called', () => {
    useOrderStore.getState().setOrder(validOrder)
    expect(useOrderStore.getState().order).toEqual(validOrder)
  })

  it('should reset order to null when clearOrder is called', () => {
    useOrderStore.getState().setOrder(validOrder)
    useOrderStore.getState().clearOrder()
    expect(useOrderStore.getState().order).toBeNull()
  })

  it('should have null priority as initial state and allow setting it', () => {
    // This test is for HU-02 (priority selection)
    expect(useOrderStore.getState().priority).toBeNull()

    useOrderStore.getState().setPriority(SHIPPING_PRIORITY.COST)
    expect(useOrderStore.getState().priority).toBe(SHIPPING_PRIORITY.COST)

    // also ensure TIME can be set
    useOrderStore.getState().setPriority(SHIPPING_PRIORITY.TIME)
    expect(useOrderStore.getState().priority).toBe(SHIPPING_PRIORITY.TIME)

    // clearOrder should reset priority as well
    useOrderStore.getState().clearOrder()
    expect(useOrderStore.getState().priority).toBeNull()
  })
})
