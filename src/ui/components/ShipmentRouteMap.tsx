import { useEffect, useRef } from 'react'
import type { Location } from '../../domain/order'
import { useShipmentRoute } from '../../application/hooks/useShipmentRoute'

type Props = {
  origin?: Location
  destination?: Location
  sectionTestId: string
  mapTestId: string
  emptyStateTestId?: string
  title: string
}

export function ShipmentRouteMap({
  origin,
  destination,
  sectionTestId,
  mapTestId,
  emptyStateTestId = 'no-route-data',
  title,
}: Props) {
  const { routePath, loading, error, hasSufficientData } = useShipmentRoute(origin, destination)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const overlayRef = useRef<any>(null)

  useEffect(() => {
    if (!hasSufficientData || routePath.length === 0 || !origin || !destination || !containerRef.current) {
      return
    }

    let active = true

    void import('leaflet').then((leaflet) => {
      if (!active || !containerRef.current) return

      if (!mapRef.current) {
        mapRef.current = leaflet.map(containerRef.current).setView([origin.lat, origin.lng], 13)
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
        }).addTo(mapRef.current)
        overlayRef.current = leaflet.layerGroup().addTo(mapRef.current)
      }

      overlayRef.current.clearLayers()

      const originMarker = leaflet.marker([origin.lat, origin.lng], {
        icon: leaflet.divIcon({
          className: 'shipment-route-marker',
          html: '<span style="display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:9999px;background:#1d4ed8;color:#fff;font-weight:700;">O</span>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      })

      const destinationMarker = leaflet.marker([destination.lat, destination.lng], {
        icon: leaflet.divIcon({
          className: 'shipment-route-marker',
          html: '<span style="display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:9999px;background:#dc2626;color:#fff;font-weight:700;">D</span>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      })

      originMarker.addTo(overlayRef.current)
      destinationMarker.addTo(overlayRef.current)

      const polyline = leaflet.polyline(routePath, {
        color: '#dc2626',
        weight: 5,
      }).addTo(overlayRef.current)

      mapRef.current.fitBounds(polyline.getBounds())
    })

    return () => {
      active = false
    }
  }, [destination, hasSufficientData, origin, routePath])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        overlayRef.current = null
      }
    }
  }, [])

  return (
    <section data-testid={sectionTestId} className="w-full rounded-2xl border border-surface-variant bg-surface-container p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-primary">{title}</h2>
        <p className="text-sm text-on-surface-variant">
          Visualiza el recorrido estimado entre el origen y el destino seleccionados.
        </p>
      </div>

      {!hasSufficientData ? (
        <p data-testid={emptyStateTestId} className="text-sm text-on-surface-variant">
          No hay datos suficientes para visualizar el recorrido.
        </p>
      ) : error && routePath.length === 0 ? (
        <p data-testid={emptyStateTestId} className="text-sm text-on-surface-variant">
          No hay datos suficientes para visualizar el recorrido.
        </p>
      ) : (
        <>
          <div data-testid={mapTestId} ref={containerRef} className="h-72 w-full rounded-xl overflow-hidden border border-surface-variant bg-surface" />
          {loading && routePath.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Calculando ruta...</p>
          ) : null}
        </>
      )}
    </section>
  )
}