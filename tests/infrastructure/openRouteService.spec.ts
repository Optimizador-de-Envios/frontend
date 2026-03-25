import { describe, it, expect } from 'vitest'
import { Location } from '../../src/domain/order'
import { autocomplete } from '../../src/infrastructure/api/openRouteService'

// Integration test — only runs when explicitly enabled to avoid consuming API tokens.
// Usage: RUN_OPENROUTE_INTEGRATION=true npm run test:integration
const API_KEY = process.env.OPENROUTESERVICE_API_KEY || process.env.VITE_OPENROUTESERVICE_API_KEY
const RUN_INTEGRATION = process.env.RUN_OPENROUTE_INTEGRATION === 'true'

const describeIntegration = API_KEY && RUN_INTEGRATION ? describe : describe.skip

describeIntegration('OpenRouteService adapter (integration)', () => {
  it('calls OpenRouteService and returns Location[] including lat/lng', async () => {
    const q = 'Bogotá'
    const results = await autocomplete(q, API_KEY!)
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)
    const first = results[0] as Location
    expect(first).toHaveProperty('name')
    expect(typeof first.lat).toBe('number')
    expect(typeof first.lng).toBe('number')
  })
})
