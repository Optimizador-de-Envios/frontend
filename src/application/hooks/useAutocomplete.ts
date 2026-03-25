import { useState, useCallback } from 'react'
import type { Location } from '../../domain/order'
import { autocomplete } from '../../infrastructure/api/openRouteService'

type UseAutocompleteResult = {
  suggestions: Location[]
  loading: boolean
  search: (text: string) => Promise<void>
}

/**
 * Application-layer hook — orchestrates location autocomplete.
 * Equivalent to a @Service in Spring Boot:
 *   owns the async state, delegates the HTTP call to the infra adapter.
 */
export function useAutocomplete(): UseAutocompleteResult {
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [loading, setLoading]         = useState(false)

  const search = useCallback(async (text: string) => {
    if (!text.trim()) {
      setSuggestions([])
      return
    }
    setLoading(true)
    try {
      const results = await autocomplete(text)
      setSuggestions(results)
    } catch (err) {
      // Do not let missing API key or fetch errors crash the UI during dev.
      // Clear suggestions so the component remains usable.
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { suggestions, loading, search }
}
