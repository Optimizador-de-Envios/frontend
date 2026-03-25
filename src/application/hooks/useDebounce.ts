import { useState, useEffect } from 'react'

/**
 * Generic debounce hook — delays updating the returned value until
 * `delay` ms have passed without a new `value` coming in.
 *
 * Spring analogy → a utility function debouncing events before processing.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
