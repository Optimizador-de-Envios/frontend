import { useState, useCallback, useEffect } from 'react'
import type { Location } from '../../domain/order'
import { autocomplete } from '../../infrastructure/api/openRouteService'
import { useDebounce } from './useDebounce'

type UseAutocompleteResult = {
    suggestions: Location[]
    loading: boolean
    search: (text: string) => void
}

/**
 * Application-layer hook — orchestrates location autocomplete with 1 s debounce.
 * Owns the async state and delegates the HTTP call to the infrastructure adapter.
 *
 * Debounce avoids firing an API call on every keystroke.
 */
export function useAutocomplete(): UseAutocompleteResult {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Location[]>([])
    const [loading, setLoading] = useState(false)
    const debouncedQuery = useDebounce(query, 1000)

    const search = useCallback((text: string) => {
        if (!text.trim()) setSuggestions([])
        setQuery(text)
    }, [])

    useEffect(() => {
        if (!debouncedQuery.trim()) return
        setLoading(true)
        autocomplete(debouncedQuery)
            .then(setSuggestions)
            .catch(() => setSuggestions([]))
            .finally(() => setLoading(false))
    }, [debouncedQuery])

    return { suggestions, loading, search }
}
