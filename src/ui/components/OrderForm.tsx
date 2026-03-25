import { useState } from 'react'
import type { Location, WeightUnit } from '../../domain/order'
import { WEIGHT_UNIT } from '../../domain/order'
import { useOrder } from '../../application/hooks/useOrder'
import { LocationInput } from './LocationInput'

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

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
          Peso
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            data-testid="input-weight"
            type="number"
            min={0}
            step="any"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ej: 2.5"
            style={{ flex: 1, padding: '0.5rem' }}
          />
          <select
            data-testid="select-weight-unit"
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
            style={{ padding: '0.5rem' }}
          >
            {Object.keys(WEIGHT_UNIT).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

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
