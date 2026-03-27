import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { buildOrderPayload, buildConfirmPayload, confirmOrder } from '../../src/infrastructure/api/orderApiService'

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

const selectedOption = {
  providerName: 'Local',
  cost: 30386.59,
  currency: 'COP',
  estimatedDays: 1,
}

describe('buildConfirmPayload (HU-05)', () => {
  it('includes an "order" key with the order data', () => {
    const payload = buildConfirmPayload(validOrder, selectedOption)
    expect(payload).toHaveProperty('order')
    expect(payload.order.origin).toEqual(validOrder.origin)
    expect(payload.order.destination).toEqual(validOrder.destination)
    expect(payload.order.weight).toBe(validOrder.weight)
    expect(payload.order.weightUnit).toBe(validOrder.weightUnit)
    expect(payload.order.priority).toBe(validOrder.priority)
  })

  it('includes a "selectedOption" key with the selected provider data', () => {
    const payload = buildConfirmPayload(validOrder, selectedOption)
    expect(payload).toHaveProperty('selectedOption')
    expect(payload.selectedOption).toEqual(selectedOption)
  })

  it('reflects "providerName" in selectedOption', () => {
    const payload = buildConfirmPayload(validOrder, selectedOption)
    expect(payload.selectedOption.providerName).toBe('Local')
  })

  it('reflects "cost" and "currency" in selectedOption', () => {
    const payload = buildConfirmPayload(validOrder, selectedOption)
    expect(payload.selectedOption.cost).toBe(30386.59)
    expect(payload.selectedOption.currency).toBe('COP')
  })

  it('reflects "estimatedDays" in selectedOption', () => {
    const payload = buildConfirmPayload(validOrder, selectedOption)
    expect(payload.selectedOption.estimatedDays).toBe(1)
  })
})

describe('confirmOrder (HU-05)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls fetch with POST method to /api/v1/pedido/confirmar', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }))
    await confirmOrder(validOrder, selectedOption)
    expect(fetch).toHaveBeenCalledOnce()
    const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/api/v1/pedido/confirmar')
    expect(options.method).toBe('POST')
  })

  it('sends Content-Type: application/json header', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }))
    await confirmOrder(validOrder, selectedOption)
    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })

  it('sends the correct JSON body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }))
    await confirmOrder(validOrder, selectedOption)
    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(options.body as string)
    expect(body.selectedOption.providerName).toBe('Local')
    expect(body.order.priority).toBe('COST')
  })

  it('throws an error when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }))
    await expect(confirmOrder(validOrder, selectedOption)).rejects.toThrow('confirmOrder failed: 500')
  })
})
