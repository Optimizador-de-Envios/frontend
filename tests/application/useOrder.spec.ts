import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOrder } from '../../src/application/hooks/useOrder'
import { useOrderStore } from '../../src/application/store/orderStore'
import { SHIPPING_PRIORITY } from '../../src/domain/order'

const validOrder = {
  origin:      { name: 'Bogotá',   lat: 4.711, lng: -74.072 },
  destination: { name: 'Medellín', lat: 6.244, lng: -75.581 },
  weight:      1,
  weightUnit:  'KILOGRAMS' as const,
}

const invalidOrder = {
  origin:      undefined,
  destination: undefined,
  weight:      undefined,
  weightUnit:  undefined,
}

describe('useOrder hook (HU-01)', () => {
  beforeEach(() => {
    useOrderStore.getState().clearOrder()
  })

  it('should return null order initially', () => {
    const { result } = renderHook(() => useOrder())
    expect(result.current.order).toBeNull()
  })

  it('should set order in store when submitOrder is called with valid data', () => {
    const { result } = renderHook(() => useOrder())
    act(() => { result.current.submitOrder(validOrder) })
    expect(result.current.order).toEqual(validOrder)
  })

  it('should return valid:true when order data is correct', () => {
    const { result } = renderHook(() => useOrder())
    let validation: any
    act(() => { validation = result.current.submitOrder(validOrder) })
    expect(validation.valid).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })

  it('should NOT set order when submitOrder is called with invalid data', () => {
    const { result } = renderHook(() => useOrder())
    act(() => { result.current.submitOrder(invalidOrder) })
    expect(result.current.order).toBeNull()
  })

  it('should return valid:false and errors when order data is invalid', () => {
    const { result } = renderHook(() => useOrder())
    let validation: any
    act(() => { validation = result.current.submitOrder(invalidOrder) })
    expect(validation.valid).toBe(false)
    expect(validation.errors.length).toBeGreaterThan(0)
  })

  it('should clear order from store when clearOrder is called', () => {
    const { result } = renderHook(() => useOrder())
    act(() => { result.current.submitOrder(validOrder) })
    act(() => { result.current.clearOrder() })
    expect(result.current.order).toBeNull()
  })
})

describe('useOrder hook (HU-02)', () => {
  beforeEach(() => {
    useOrderStore.getState().clearOrder()
  })

  it('should have null priority initially', () => {
    const { result } = renderHook(() => useOrder())
    expect(result.current.priority).toBeNull()
  })

  it('should set priority inside order when setPriority is called', () => {
    const { result } = renderHook(() => useOrder())
    act(() => { result.current.submitOrder(validOrder) })
    act(() => { result.current.setPriority(SHIPPING_PRIORITY.COST) })
    expect(result.current.priority).toBe(SHIPPING_PRIORITY.COST)
    expect(result.current.order?.priority).toBe(SHIPPING_PRIORITY.COST)
  })

  it('should clear priority when clearOrder is called', () => {
    const { result } = renderHook(() => useOrder())
    act(() => { result.current.submitOrder(validOrder) })
    act(() => { result.current.setPriority(SHIPPING_PRIORITY.TIME) })
    act(() => { result.current.clearOrder() })
    expect(result.current.priority).toBeNull()
  })
})
