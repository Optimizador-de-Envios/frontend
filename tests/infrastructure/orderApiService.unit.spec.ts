import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { buildOrderPayload, buildConfirmPayload, confirmOrder } from '../../src/infrastructure/api/orderApiService'
import type { OrderConfirmation } from '../../src/domain/recommendation'

const validOrder = {
  origin: { name: 'Tunja, BY, Colombia', lng: -73.36778, lat: 5.53528 },
  destination: { name: 'Bogotá, DC, Colombia', lng: -74.08768, lat: 4.635456 },
  weight: 10,
  weightUnit: 'KILOGRAMS' as const,
  priority: 'COST' as const,
}

const mockRandomUUID = vi.fn(() => 'uuid-123')

describe('buildOrderPayload (HU-03)', () => {
  it('wraps the order inside an "order" key', () => {
    const payload = buildOrderPayload(validOrder, 'uuid-123')
    expect(payload).toHaveProperty('order')
  })

  it('includes origin with name, lat and lng', () => {
    const payload = buildOrderPayload(validOrder, 'uuid-123')
    expect(payload.order.origin).toEqual({
      name: 'Tunja, BY, Colombia',
      lng: -73.36778,
      lat: 5.53528,
    })
  })

  it('includes destination with name, lat and lng', () => {
    const payload = buildOrderPayload(validOrder, 'uuid-123')
    expect(payload.order.destination).toEqual({
      name: 'Bogotá, DC, Colombia',
      lng: -74.08768,
      lat: 4.635456,
    })
  })

  it('includes weight and weightUnit', () => {
    const payload = buildOrderPayload(validOrder, 'uuid-123')
    expect(payload.order.weight).toBe(10)
    expect(payload.order.weightUnit).toBe('KILOGRAMS')
  })

  it('includes priority', () => {
    const payload = buildOrderPayload(validOrder, 'uuid-123')
    expect(payload.order.priority).toBe('COST')
  })

  it('builds correct payload for TIME priority', () => {
    const order = { ...validOrder, priority: 'TIME' as const }
    const payload = buildOrderPayload(order, 'uuid-123')
    expect(payload.order.priority).toBe('TIME')
  })

  it('includes confirmationToken when provided', () => {
    const payload = buildOrderPayload(validOrder, 'uuid-123')
    expect(payload.confirmationToken).toBe('uuid-123')
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
    const payload = buildConfirmPayload(validOrder, selectedOption, 'uuid-123')
    expect(payload).toHaveProperty('order')
    expect(payload.order.origin).toEqual(validOrder.origin)
    expect(payload.order.destination).toEqual(validOrder.destination)
    expect(payload.order.weight).toBe(validOrder.weight)
    expect(payload.order.weightUnit).toBe(validOrder.weightUnit)
    expect(payload.order.priority).toBe(validOrder.priority)
  })

  it('includes a "selectedOption" key with the selected provider data', () => {
    const payload = buildConfirmPayload(validOrder, selectedOption, 'uuid-123')
    expect(payload).toHaveProperty('selectedOption')
    expect(payload.selectedOption).toEqual(selectedOption)
  })

  it('reflects "providerName" in selectedOption', () => {
    const payload = buildConfirmPayload(validOrder, selectedOption, 'uuid-123')
    expect(payload.selectedOption.providerName).toBe('Local')
  })

  it('reflects "cost" and "currency" in selectedOption', () => {
    const payload = buildConfirmPayload(validOrder, selectedOption, 'uuid-123')
    expect(payload.selectedOption.cost).toBe(30386.59)
    expect(payload.selectedOption.currency).toBe('COP')
  })

  it('reflects "estimatedDays" in selectedOption', () => {
    const payload = buildConfirmPayload(validOrder, selectedOption, 'uuid-123')
    expect(payload.selectedOption.estimatedDays).toBe(1)
  })
})

const mockConfirmation: OrderConfirmation = {
  id: 'abc-123',
  confirmationToken: 'uuid-123',
  origin: { name: 'Tunja, BY, Colombia', lat: 5.53528, lng: -73.36778 },
  destination: { name: 'Bogotá, DC, Colombia', lat: 4.635456, lng: -74.08768 },
  weight: 10,
  weightUnit: 'KILOGRAMS',
  priority: 'COST',
  distanceKm: 148.3,
  selectedOption,
}

describe('confirmOrder (HU-05)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls fetch with POST method to /api/v1/pedido/confirmar', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockConfirmation), { status: 200 })
    )
    await confirmOrder(validOrder, selectedOption, 'uuid-123')
    expect(fetch).toHaveBeenCalledOnce()
    const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/api/v1/pedido/confirmar')
    expect(options.method).toBe('POST')
  })

  it('sends Content-Type: application/json header', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockConfirmation), { status: 200 })
    )
    await confirmOrder(validOrder, selectedOption, 'uuid-123')
    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })

  it('sends the correct JSON body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockConfirmation), { status: 200 })
    )
    await confirmOrder(validOrder, selectedOption, 'uuid-123')
    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(options.body as string)
    expect(body.selectedOption.providerName).toBe('Local')
    expect(body.order.priority).toBe('COST')
    expect(body.confirmationToken).toBe('uuid-123')
  })

  it('returns the OrderConfirmation from the API response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockConfirmation), { status: 200 })
    )
    const result = await confirmOrder(validOrder, selectedOption, 'uuid-123')
    expect(result.id).toBe('abc-123')
    expect(result.distanceKm).toBe(148.3)
    expect(result.selectedOption.providerName).toBe('Local')
  })

  it('throws an error when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }))
    await expect(confirmOrder(validOrder, selectedOption, 'uuid-123')).rejects.toThrow('confirmOrder failed: 500')
  })
})

describe('postOrder confirmationToken contract (F0)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('crypto', { randomUUID: mockRandomUUID } as Crypto)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends a generated confirmationToken in the quote request body', async () => {
    const { postOrder } = await import('../../src/infrastructure/api/orderApiService')
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ recommendation: mockConfirmation.selectedOption, alternatives: [] }), { status: 200 })
    )

    await postOrder(validOrder)

    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(options.body as string)

    expect(body.confirmationToken).toBe('uuid-123')
    expect(mockRandomUUID).toHaveBeenCalledOnce()
  })

  it('returns the generated confirmationToken together with the API response', async () => {
    const { postOrder } = await import('../../src/infrastructure/api/orderApiService')
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ recommendation: mockConfirmation.selectedOption, alternatives: [] }), { status: 200 })
    )

    const result = await postOrder(validOrder)

    expect(result.confirmationToken).toBe('uuid-123')
  })
})
