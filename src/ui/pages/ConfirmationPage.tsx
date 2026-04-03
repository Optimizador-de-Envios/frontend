import { AppHeader } from '../components/AppHeader'
import { useRecommendationStore } from '../../application/store/recommendationStore'
import { ShipmentRouteMap } from '../components/ShipmentRouteMap'

export function ConfirmationPage() {
  const orderConfirmation = useRecommendationStore((state) => state.orderConfirmation)
  const confirmationStatus = useRecommendationStore((state) => state.confirmationStatus)
  const confirmationError = useRecommendationStore((state) => state.confirmationError)

  if (confirmationStatus === 'error') {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 gap-6">
          <span className="material-symbols-outlined text-6xl text-error">error</span>
          <div data-testid="confirmation-error" className="text-center space-y-3">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-error">
              Error al confirmar
            </h1>
            <p data-testid="confirmation-error-message" className="text-on-surface-variant text-sm max-w-md mx-auto">
              {confirmationError}
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (!orderConfirmation) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <span data-testid="no-confirmation">No hay confirmación disponible.</span>
      </div>
    )
  }

  const { id, origin, destination, distanceKm, selectedOption } = orderConfirmation
  const { providerName, cost, currency, estimatedDays } = selectedOption

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 gap-10">

        <div data-testid="confirmation-success" className="text-center space-y-3">
          <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
            Envío confirmado
          </h1>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto">
            Tu pedido fue registrado exitosamente. Aquí tienes el resumen.
          </p>
        </div>

        {/* Order details */}
        <div className="w-full max-w-2xl rounded-2xl border border-surface-variant bg-surface-container p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-widest uppercase text-on-surface-variant">ID de pedido</span>
            <p data-testid="confirmation-id" className="text-2xl font-bold font-headline text-primary">
              {id}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">Origen</span>
              <p data-testid="confirmation-origin" className="text-lg font-semibold text-on-surface">
                {origin.name}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">Destino</span>
              <p data-testid="confirmation-destination" className="text-lg font-semibold text-on-surface">
                {destination.name}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-widest uppercase text-on-surface-variant">Distancia total</span>
            <p data-testid="confirmation-distance" className="text-2xl font-bold text-primary">
              {distanceKm}
              <span className="text-base font-normal text-on-surface-variant ml-2">km</span>
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <ShipmentRouteMap
            origin={origin}
            destination={destination}
            sectionTestId="shipment-route-section"
            mapTestId="shipment-route-map"
            title="Ruta final del envío"
          />
        </div>

        {/* Provider details */}
        <div className="w-full max-w-2xl rounded-2xl border border-surface-variant bg-surface-container p-8 flex flex-col gap-6">
          <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase bg-surface-variant px-3 py-1 rounded-full w-fit">
            Proveedor seleccionado
          </span>

          <p data-testid="confirmation-provider" className="text-4xl font-extrabold font-headline text-primary tracking-tight">
            {providerName}
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">Costo Total</span>
              <p data-testid="confirmation-cost" className="text-3xl font-bold text-primary">
                {cost.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                <span className="text-base font-normal text-on-surface-variant ml-2">{currency}</span>
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">Tiempo Estimado</span>
              <p data-testid="confirmation-days" className="text-3xl font-bold text-primary">
                {estimatedDays}
                <span className="text-base font-normal text-on-surface-variant ml-2">Día(s)</span>
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
