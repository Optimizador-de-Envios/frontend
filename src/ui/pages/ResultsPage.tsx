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
      <header className="bg-[#0e0e10]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-center items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <span className="text-xl font-bold tracking-tighter text-primary uppercase font-headline">
            Optimizador de Envios
          </span>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-bold">Recomendación Principal</h2>
          <p data-testid="recommendation-provider">{providerName}</p>
          <p data-testid="recommendation-cost">{cost} {currency}</p>
          <p data-testid="recommendation-days">{estimatedDays} día(s)</p>
        </div>
      </main>
    </div>
  )
}
