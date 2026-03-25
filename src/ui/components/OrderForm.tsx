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
export function OrderForm() {
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
    } else {
      setErrors(result.errors)
    }
  }

  if (submitted) {
    return (
      <div data-testid="order-success" style={{ color: 'green', fontWeight: 600 }}>
        ¡Pedido registrado correctamente! Puedes continuar con el cálculo del envío.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: '480px' }}>
      <h2>Registrar Pedido</h2>

      <LocationInput
        label="Origen"
        testId="input-origin"
        value={origin}
        onChange={setOrigin}
      />

      <LocationInput
        label="Destino"
        testId="input-destination"
        value={destination}
        onChange={setDestination}
      />

      <WeightInput
        weight={weight}
        unit={weightUnit}
        onWeightChange={setWeight}
        onUnitChange={setWeightUnit}
      />

      {errors.length > 0 && (
        <ul
          data-testid="form-errors"
          style={{ color: 'red', paddingLeft: '1.25rem', marginBottom: '1rem' }}
        >
          {errors.map((err) => <li key={err}>{err}</li>)}
        </ul>
      )}

      <button type="submit" style={{ padding: '0.6rem 1.5rem', fontWeight: 600 }}>
        Calcular envío
      </button>
    </form>
  )
}
