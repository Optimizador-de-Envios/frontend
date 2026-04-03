import { describe, expect, it } from 'vitest'

describe('route domain (HU-06)', () => {
  it('converts OpenRouteService coordinates from [lng, lat] to [lat, lng]', async () => {
    const routeDomain = await import('../../src/domain/route')

    expect(routeDomain.toLeafletCoordinates([
      [-74.07, 4.71],
      [-75.56, 6.25],
    ])).toEqual([
      [4.71, -74.07],
      [6.25, -75.56],
    ])
  })

  it('returns false when there is not enough data to render a route', async () => {
    const routeDomain = await import('../../src/domain/route')

    expect(routeDomain.hasRouteEndpoints(undefined, { name: 'Medellin', lat: 6.25, lng: -75.56 })).toBe(false)
    expect(routeDomain.hasRouteEndpoints(
      { name: 'Bogota', lat: 4.71, lng: -74.07 },
      { name: 'Medellin', lat: 6.25, lng: -75.56 },
    )).toBe(true)
  })
})