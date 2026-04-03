import type { Location } from '../../domain/order'
import { toLeafletCoordinates } from '../../domain/route'
import type { RoutePath } from '../../domain/route'

const ORS_AUTOCOMPLETE_BASE = 'https://api.openrouteservice.org/geocode/autocomplete'
const ORS_DIRECTIONS_BASE = 'https://api.openrouteservice.org/v2/directions/driving-car'

/**
 * Resolves the ORS API key from (in order):
 *   1. explicit param (passed by caller)
 *   2. Node.js environment (OPENROUTESERVICE_API_KEY)
 *   3. Vite dev environment (VITE_OPENROUTESERVICE_API_KEY)
 *
 * Resolution order: explicit param, Node.js env vars, then Vite env (dev).
 */
export function resolveApiKey(apiKey?: string): string | undefined {
  if (apiKey) return apiKey

  const nodeKey = (globalThis as any).process?.env?.OPENROUTESERVICE_API_KEY as string | undefined
  if (nodeKey) return nodeKey

  // import.meta.env is only available in Vite-bundled code
  const viteKey = (import.meta as any)?.env?.VITE_OPENROUTESERVICE_API_KEY as string | undefined

  // Dev-only: resolved sources (no logging)

  // DEV fallback: allow reading a debug-exposed window value if Vite env isn't injected.
  if (!viteKey && typeof window !== 'undefined' && (window as any).__VITE_OPENROUTESERVICE_API_KEY) {
    return (window as any).__VITE_OPENROUTESERVICE_API_KEY as string
  }

  return viteKey
}

/**
 * Builds the autocomplete request URL.
 * Pure function — deterministic, no side effects, unit-testable.
 */
export function buildAutocompleteUrl(text: string, api_key: string): string {
  const params = new URLSearchParams({
    text,
    'boundary.country': 'CO',
    layers: 'locality',   
    api_key,
  })
  return `${ORS_AUTOCOMPLETE_BASE}?${params.toString()}`
}

/**
 * Maps raw GeoJSON features from the ORS response to domain Location objects.
 * Pure function — isolated, unit-testable without HTTP.
 */
export function mapFeaturesToLocations(features: any[]): Location[] {
  return features.map((f) => {
    const name = f.properties?.label ?? ''
    const coords = f.geometry?.coordinates ?? []
    return {
      name,
      lng: Number(coords[0]) || 0,
      lat: Number(coords[1]) || 0,
    } as Location
  })
}

export function buildDirectionsUrl(origin: Location, destination: Location, api_key: string): string {
  const params = new URLSearchParams({
    api_key,
  })

  return `${ORS_DIRECTIONS_BASE}?start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}&${params.toString()}`
}

export function mapDirectionsToRoutePath(routeResponse: { features?: Array<{ geometry?: { coordinates?: number[][] } }> }): RoutePath {
  const coordinates = routeResponse.features?.[0]?.geometry?.coordinates ?? []
  return toLeafletCoordinates(coordinates)
}

/**
 * Autocomplete adapter — thin orchestrator.
 * Equivalent to an outbound port adapter in hexagonal architecture.
 */
export async function autocomplete(text: string, apiKey?: string): Promise<Location[]> {
  const api_key = resolveApiKey(apiKey)
  if (!api_key) {
    throw new Error(
      'OpenRouteService API key not found. ' +
      'Provide apiKey param, or set OPENROUTESERVICE_API_KEY / VITE_OPENROUTESERVICE_API_KEY.'
    )
  }

  const url = buildAutocompleteUrl(text, api_key)
  // Dev-only: final request URL (no logging)
  const resp = await fetch(url)
  const json = await resp.json()

  if (!json || !Array.isArray(json.features)) return []
  return mapFeaturesToLocations(json.features)
}

export async function fetchRoute(origin: Location, destination: Location, apiKey?: string): Promise<RoutePath> {
  const api_key = resolveApiKey(apiKey)
  if (!api_key) {
    throw new Error(
      'OpenRouteService API key not found. ' +
      'Provide apiKey param, or set OPENROUTESERVICE_API_KEY / VITE_OPENROUTESERVICE_API_KEY.'
    )
  }

  const url = buildDirectionsUrl(origin, destination, api_key)
  const resp = await fetch(url)
  const json = await resp.json()

  return mapDirectionsToRoutePath(json)
}

export default { autocomplete, fetchRoute }
