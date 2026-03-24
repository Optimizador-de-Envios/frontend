import { describe, it, expect } from 'vitest'
import { Location } from '../../src/domain/order'
import { autocomplete } from '../../src/infrastructure/api/openRouteService'

describe('OpenRouteService adapter (integration)', () => {
  // Support both Node env var and Vite-style env var (from .env.local)
  const API_KEY = process.env.OPENROUTESERVICE_API_KEY || process.env.VITE_OPENROUTESERVICE_API_KEY
  if (!API_KEY) {
    throw new Error('OPENROUTESERVICE_API_KEY or VITE_OPENROUTESERVICE_API_KEY is required to run this test. Set it in your environment or in .env.local')
  }

  it('calls OpenRouteService and returns Location[] including lat/lng', async () => {
    const q = 'Bogotá'
    const results = await autocomplete(q, API_KEY)
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)
    const first = results[0] as Location
    expect(first).toHaveProperty('name')
    expect(typeof first.lat).toBe('number')
    expect(typeof first.lng).toBe('number')
  })
})
