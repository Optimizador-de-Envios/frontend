import type { WeightUnit } from '../../domain/order'
import { WEIGHT_UNIT } from '../../domain/order'

type Props = {
  weight: string
  unit: WeightUnit
  onWeightChange: (value: string) => void
  onUnitChange: (unit: WeightUnit) => void
}

/**
 * Dumb UI component — number input + unit selector for the weight field.
 * Extracted from OrderForm to satisfy SRP.
 */
export function WeightInput({ weight, unit, onWeightChange, onUnitChange }: Props) {
  return (
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
          onChange={(e) => onWeightChange(e.target.value)}
          placeholder="Ej: 2.5"
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <select
          data-testid="select-weight-unit"
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as WeightUnit)}
          style={{ padding: '0.5rem' }}
        >
          {Object.keys(WEIGHT_UNIT).map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
