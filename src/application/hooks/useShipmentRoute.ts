import { useEffect, useState } from 'react'
import type { Location } from '../../domain/order'
import type { RoutePath } from '../../domain/route'
import { hasRouteEndpoints } from '../../domain/route'
import { fetchRoute } from '../../infrastructure/api/openRouteService'

type UseShipmentRouteResult = {
  routePath: RoutePath
  loading: boolean
  error: string | null
  hasSufficientData: boolean
}

export function useShipmentRoute(origin?: Location, destination?: Location): UseShipmentRouteResult {
  const [routePath, setRoutePath] = useState<RoutePath>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasSufficientData = hasRouteEndpoints(origin, destination)

  useEffect(() => {
    if (!hasSufficientData || !origin || !destination) {
      setRoutePath([])
      setError(null)
      setLoading(false)
      return
    }

    let active = true

    setLoading(true)
    setError(null)

    fetchRoute(origin, destination)
      .then((path) => {
        if (!active) return
        setRoutePath(path)
      })
      .catch((err: unknown) => {
        if (!active) return
        setRoutePath([])
        setError(err instanceof Error ? err.message : 'No fue posible calcular la ruta')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [destination?.lat, destination?.lng, hasSufficientData, origin?.lat, origin?.lng])

  return { routePath, loading, error, hasSufficientData }
}