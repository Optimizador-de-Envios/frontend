import { AppHeader } from '../components/AppHeader'
import { useRecommendation } from '../../application/hooks/useRecommendation'

export function ResultsPage() {
  const { recommendation, loading, error } = useRecommendation()

  if (loading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <span data-testid="loading">Cargando recomendación...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <span data-testid="error">{error}</span>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <span data-testid="no-recommendation">No hay recomendación disponible.</span>
      </div>
    )
  }

  const { providerName, cost, currency, estimatedDays } = recommendation.recommendation

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 gap-10">

        <div className="text-center space-y-3">
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
            Recomendación de Proveedor
          </h1>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto">
            Basado en tu ruta de envío y requisitos de tiempo, hemos identificado la opción más eficiente para tu operación.
          </p>
        </div>

        <div className="w-full max-w-2xl rounded-2xl border border-surface-variant bg-surface-container p-8 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase bg-surface-variant px-3 py-1 rounded-full w-fit">
                Elección Inteligente
              </span>
              <p data-testid="recommendation-provider" className="text-5xl font-extrabold font-headline text-primary tracking-tight">
                {providerName}
              </p>
            </div>
            <span className="material-symbols-outlined text-4xl text-primary mt-1">verified</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">Costo Total</span>
              <p data-testid="recommendation-cost" className="text-3xl font-bold text-primary">
                {cost.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                <span className="text-base font-normal text-on-surface-variant ml-2">{currency}</span>
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">Tiempo Estimado</span>
              <p data-testid="recommendation-days" className="text-3xl font-bold text-primary">
                {estimatedDays}
                <span className="text-base font-normal text-on-surface-variant ml-2">Día(s)</span>
              </p>
            </div>
          </div>

          <button className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-headline font-bold py-5 rounded-md tracking-tight transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2">
            Seleccionar este Proveedor
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>

          <p className="text-xs text-on-surface-variant text-center">
            Incluye impuestos y aranceles estimados para envíos internacionales.
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <p className="text-xs tracking-widest uppercase text-on-surface-variant text-center">
            Otras Alternativas
          </p>
        </div>

      </main>
    </div>
  )
}

