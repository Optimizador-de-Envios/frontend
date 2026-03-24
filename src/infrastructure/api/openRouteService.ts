import type { Location } from '../../domain/order'

// Adapter for OpenRouteService geocode/autocomplete
export async function autocomplete(text: string, apiKey?: string): Promise<Location[]> {
  const base = 'https://api.openrouteservice.org/geocode/autocomplete'

  // Resolve API key: param -> NODE env -> VITE env (client dev)
  // Avoid direct `process` identifier to keep this module browser-friendly
  const nodeEnvKey = typeof globalThis !== 'undefined' && (globalThis as any).process
    ? (globalThis as any).process.env?.OPENROUTESERVICE_API_KEY
    : undefined

  let viteKey: string | undefined
  try {
    // @ts-ignore import.meta may not be available in some runtimes
    viteKey = (import.meta as any)?.env?.VITE_OPENROUTESERVICE_API_KEY
  } catch (e) {
    viteKey = undefined
  }

  const api_key = apiKey || nodeEnvKey || viteKey
  if (!api_key) {
    throw new Error('OpenRouteService API key not found. Provide apiKey, set OPENROUTESERVICE_API_KEY or VITE_OPENROUTESERVICE_API_KEY')
  }

  const params = new URLSearchParams({
    text: text,
    'boundary.country': 'CO',
    api_key,
  })

  const url = `${base}?${params.toString()}`

  const resp = await fetch(url)
  const json = await resp.json()

  if (!json || !Array.isArray(json.features)) return []

  return json.features.map((f: any) => {
    const label = f.properties?.label ?? ''
    const coords = f.geometry?.coordinates ?? []
    const lng = Number(coords[0]) ?? 0
    const lat = Number(coords[1]) ?? 0
    return { name: label, lat, lng } as Location
  })
}

export default { autocomplete }
