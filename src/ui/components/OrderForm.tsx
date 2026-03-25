import { useState } from 'react'
import type { Location, WeightUnit } from '../../domain/order'
import { useOrder } from '../../application/hooks/useOrder'
import { LocationInput } from './LocationInput'
import { WeightInput } from './WeightInput'

/**
 * Smart form component for HU-01.
 * Owns local form state; delegates submission to useOrder (application layer).
 * Never calls any service or API directly — only through hooks.
 */
type Props = {
  onSuccess?: () => void
}

export function OrderForm({ onSuccess }: Props = {}) {
  const { submitOrder } = useOrder()

  const [origin,      setOrigin]      = useState<Location | null>(null)
  const [destination, setDestination] = useState<Location | null>(null)
  const [weight,      setWeight]      = useState<string>('')
  const [weightUnit,  setWeightUnit]  = useState<WeightUnit>('KILOGRAMS')
  const [errors,      setErrors]      = useState<string[]>([])
  const [submitted,   setSubmitted]   = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = submitOrder({
      origin:      origin ?? undefined,
      destination: destination ?? undefined,
      weight:      weight !== '' ? Number(weight) : undefined,
      weightUnit,
    })

    if (result.valid) {
      setErrors([])
      setSubmitted(true)
      onSuccess?.()
    } else {
      setErrors(result.errors)
    }
  }

  const originError      = errors.find(e => e.toLowerCase().includes('origin'))
  const destinationError = errors.find(e => e.toLowerCase().includes('destination'))
  const weightError      = errors.find(e => e.toLowerCase().includes('weight'))

  if (submitted) {
    return (
      <div data-testid="order-success" className="text-primary font-headline font-semibold text-center text-lg">
        ¡Pedido registrado correctamente! Puedes continuar con el cálculo del envío.
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl space-y-10">
      <header className="space-y-2 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Registrar Pedido
        </h1>
        <p className="text-on-surface-variant text-sm mx-auto max-w-md">
          Ingrese los detalles logísticos para calcular la tarifa óptima y la ruta más eficiente para su entrega.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        <LocationInput
          label="Origen"
          testId="input-origin"
          value={origin}
          onChange={setOrigin}
          icon="location_on"
          error={originError}
        />

        <LocationInput
          label="Destino"
          testId="input-destination"
          value={destination}
          onChange={setDestination}
          icon="near_me"
          error={destinationError}
        />

        <WeightInput
          weight={weight}
          unit={weightUnit}
          onWeightChange={setWeight}
          onUnitChange={setWeightUnit}
          error={weightError}
        />

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-headline font-bold py-5 rounded-md tracking-tight transition-all active:scale-[0.98] shadow-lg"
          >
            Calcular envío
          </button>
        </div>
      </form>
    </div>
  )
}
