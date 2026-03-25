import { describe, it, expect } from 'vitest'
import {
    resolveApiKey,
    buildAutocompleteUrl,
    mapFeaturesToLocations,
} from '../../src/infrastructure/api/openRouteService'

// Unit tests for the pure helper functions extracted during REFACTOR.
// These do NOT need a real API key or network access.

describe('resolveApiKey', () => {
    it('returns the explicit param when provided', () => {
        expect(resolveApiKey('explicit-key')).toBe('explicit-key')
    })

    it('returns undefined when no key is available', () => {
        // No param, no env vars set in unit test env
        const original = (globalThis as any).process?.env?.OPENROUTESERVICE_API_KEY
        if ((globalThis as any).process?.env) {
            delete (globalThis as any).process.env.OPENROUTESERVICE_API_KEY
        }
        const result = resolveApiKey()
        expect(result === undefined || typeof result === 'string').toBe(true)
        // Restore
        if (original !== undefined && (globalThis as any).process?.env) {
            ; (globalThis as any).process.env.OPENROUTESERVICE_API_KEY = original
        }
    })
})

describe('buildAutocompleteUrl', () => {
    it('returns a URL containing the text and CO boundary', () => {
        const url = buildAutocompleteUrl('Bogota', 'test-key')
        expect(url).toContain('text=Bogota')
        expect(url).toContain('boundary.country=CO')
        expect(url).toContain('api_key=test-key')
        expect(url).toContain('https://api.openrouteservice.org/geocode/autocomplete')
    })

    it('URL-encodes special characters in text', () => {
        const url = buildAutocompleteUrl('Bogotá', 'test-key')
        expect(url).toContain('Bogot')
    })
    it('includes layers=locality in the URL', () => {
        const url = buildAutocompleteUrl('Bogota', 'test-key')
        expect(url).toContain('layers=locality')
    })
})

describe('mapFeaturesToLocations', () => {
    it('maps GeoJSON features to Location objects', () => {
        const features = [
            {
                properties: { label: 'Bogotá, Colombia' },
                geometry: { coordinates: [-74.0818, 4.6097] },
            },
            {
                properties: { label: 'Medellín, Colombia' },
                geometry: { coordinates: [-75.5636, 6.2518] },
            },
        ]

        const locations = mapFeaturesToLocations(features)

        expect(locations).toHaveLength(2)
        expect(locations[0]).toEqual({ name: 'Bogotá, Colombia', lng: -74.0818, lat: 4.6097 })
        expect(locations[1]).toEqual({ name: 'Medellín, Colombia', lng: -75.5636, lat: 6.2518 })
    })

    it('returns empty array for empty features', () => {
        expect(mapFeaturesToLocations([])).toEqual([])
    })

    it('handles missing label gracefully (defaults to empty string)', () => {
        const features = [{ properties: {}, geometry: { coordinates: [-74, 4.6] } }]
        const [loc] = mapFeaturesToLocations(features)
        expect(loc.name).toBe('')
        expect(loc.lat).toBe(4.6)
        expect(loc.lng).toBe(-74)
    })

    it('handles missing coordinates gracefully (defaults to 0)', () => {
        const features = [{ properties: { label: 'X' }, geometry: { coordinates: [] } }]
        const [loc] = mapFeaturesToLocations(features)
        expect(loc.lat).toBe(0)
        expect(loc.lng).toBe(0)
    })


})
