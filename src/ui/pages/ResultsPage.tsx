import { useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { useRecommendation } from '../../application/hooks/useRecommendation'
import { useConfirmOrder } from '../../application/hooks/useConfirmOrder'
import { useOrderStore } from '../../application/store/orderStore'
import type { ShippingOption } from '../../domain/recommendation'
import type { ReadyOrder } from '../../domain/order'

export function ResultsPage() {
  const { recommendation, loading, error } = useRecommendation()
  const { confirm, currentAttemptConfirmed = false, canConfirm = true, confirmationStatus } = useConfirmOrder()
  const order = useOrderStore((state) => state.order)
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null)

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

  const isSelected = (option: ShippingOption) =>
    selectedOption?.providerName === option.providerName

  function handleConfirm() {
    if (selectedOption && order && canConfirm) {
      confirm(order as ReadyOrder, selectedOption)
    }
  }

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

        {/* Recommended option card */}
        <div
          data-testid={`option-card-${providerName}`}
          className={`w-full max-w-2xl rounded-2xl border bg-surface-container p-8 flex flex-col gap-6 transition-all ${isSelected(recommendation.recommendation) ? 'border-primary ring-2 ring-primary' : 'border-surface-variant'}`}
        >
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

          <button
            data-testid={`select-button-${providerName}`}
            onClick={() => setSelectedOption(recommendation.recommendation)}
            className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-headline font-bold py-4 rounded-md tracking-tight transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
          >
            Seleccionar
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </button>

          <p className="text-xs text-on-surface-variant text-center">
            Incluye impuestos y aranceles estimados para envíos internacionales.
          </p>
        </div>

        {currentAttemptConfirmed ? (
          <div
            role="alert"
            data-testid="attempt-confirmed-message"
            className="w-full max-w-2xl rounded-2xl border border-error/30 bg-error-container/10 px-6 py-5 shadow-[0_0_0_1px_rgba(255,82,82,0.15)] backdrop-blur-sm animate-pulse"
          >
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-error mt-0.5">warning</span>
              <div className="flex flex-col gap-1">
                <p className="font-headline text-lg font-bold tracking-tight text-error">
                  Intento ya confirmado
                </p>
                <p className="text-sm text-on-surface-variant">
                  Este intento ya fue confirmado. Si necesitas una nueva cotización, genera un pedido distinto.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Alternatives */}
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <p className="text-xs tracking-widest uppercase text-on-surface-variant text-center">
            Otras Alternativas
          </p>
          {recommendation.alternatives.length === 0 ? (
            <p data-testid="no-alternatives" className="text-center text-on-surface-variant text-sm">
              No hay alternativas disponibles para esta ruta.
            </p>
          ) : (
            recommendation.alternatives.map((option) => (
              <div
                key={option.providerName}
                data-testid={`option-card-${option.providerName}`}
                className={`rounded-2xl border bg-surface-container p-6 flex items-center justify-between gap-4 transition-all ${isSelected(option) ? 'border-primary ring-2 ring-primary' : 'border-surface-variant'}`}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-extrabold font-headline text-primary">{option.providerName}</p>
                  <p className="text-sm text-on-surface-variant">
                    {option.cost.toLocaleString('es-CO', { maximumFractionDigits: 0 })} {option.currency} · {option.estimatedDays} día(s)
                  </p>
                </div>
                <button
                  data-testid={`select-button-${option.providerName}`}
                  onClick={() => setSelectedOption(option)}
                  className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-headline font-bold py-2 px-6 rounded-md tracking-tight transition-all active:scale-[0.98] shadow flex items-center gap-2"
                >
                  Seleccionar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Global confirm button */}
        <div className="w-full max-w-2xl">
          <button
            data-testid="confirm-button"
            disabled={selectedOption === null || confirmationStatus === 'loading' || currentAttemptConfirmed || !canConfirm}
            onClick={handleConfirm}
            className="w-full bg-primary disabled:bg-surface-variant disabled:text-on-surface-variant hover:bg-primary-fixed-dim text-on-primary font-headline font-bold py-5 rounded-md tracking-tight transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
          >
            Confirmar selección
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>

      </main>
    </div>
  )
}

