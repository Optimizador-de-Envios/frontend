import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { getUserOrders } from '../../src/infrastructure/api/userOrdersApiService'

const mockOrders = [
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
    confirmationToken: 'token-ignored',
  },
]

describe('userOrdersApiService (F3)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the authorization header and reads the history response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(mockOrders), { status: 200 }))

    const orders = await getUserOrders('jwt-123')

    expect(fetch).toHaveBeenCalledOnce()
    const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/api/v1/pedido/mis-pedidos')
    expect(options.headers).toMatchObject({
      Authorization: 'Bearer jwt-123',
    })
    expect(orders).toHaveLength(1)
    expect(Object.prototype.hasOwnProperty.call(orders[0], 'confirmationToken')).toBe(false)
    expect(orders[0].selectedOption.providerName).toBe('Local')
  })

  it('throws when the response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }))

    await expect(getUserOrders('jwt-123')).rejects.toThrow(
      'No tienes una sesión válida. Inicia sesión nuevamente.'
    )
  })
})