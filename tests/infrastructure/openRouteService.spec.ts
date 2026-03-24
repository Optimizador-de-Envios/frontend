import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Location } from '../../src/domain/order'
import { autocomplete } from '../../src/infrastructure/api/openRouteService'

const mockResponse = {
  features: [
    {
      properties: {
        label: 'Bogotá, Colombia',
      },
      geometry: { coordinates: [-74.072, 4.711] },
    },
    {
      properties: {
        label: 'Medellín, Colombia',
      },
      geometry: { coordinates: [-75.581, 6.244] },
    },
  ],
}

describe('OpenRouteService adapter', () => {
  let fetchSpy: any

  beforeEach(() => {
    fetchSpy = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(mockResponse) }))
    // @ts-ignore
    globalThis.fetch = fetchSpy
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls OpenRouteService autocomplete with boundary.country=CO', async () => {
    const q = 'Bog'
    await autocomplete(q, 'API_KEY')
    expect(fetchSpy).toHaveBeenCalled()
    const calledUrl = fetchSpy.mock.calls[0][0] as string
    expect(calledUrl).toContain('boundary.country=CO')
    expect(calledUrl).toContain(`text=${encodeURIComponent(q)}`)
  })

  it('maps response to Location[] correctly', async () => {
    const results = await autocomplete('any', 'API_KEY')
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(2)
    const [bogo, med] = results as Location[]
    expect(bogo.name).toBe('Bogotá, Colombia')
    expect(bogo.lat).toBeCloseTo(4.711)
    expect(bogo.lng).toBeCloseTo(-74.072)
  })
})
