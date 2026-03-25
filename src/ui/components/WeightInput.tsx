import type { WeightUnit } from '../../domain/order'
import { WEIGHT_UNIT } from '../../domain/order'

type Props = {
  weight: string
  unit: WeightUnit
  onWeightChange: (value: string) => void
  onUnitChange: (unit: WeightUnit) => void
  error?: string
}

/**
 * Dumb UI component — number input + unit selector for the weight field.
 * Extracted from OrderForm to satisfy SRP.
 */
export function WeightInput({ weight, unit, onWeightChange, onUnitChange, error }: Props) {
  return (
    <div className="space-y-3">
      <label className="block font-headline text-xs font-bold uppercase tracking-widest text-primary-fixed-dim">
        Peso (Kilograms)
      </label>

      <div className="flex gap-3 items-center">
        <input
          data-testid="input-weight"
          type="number"
          min={0}
          step="any"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          placeholder="0.000"
          className="flex-1 bg-surface-container-high border border-error-dim/40 rounded-md px-4 py-4 text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary/50 transition-all"
        />

        <div>
          <select
            data-testid="select-weight-unit"
            value={unit}
            onChange={(e) => onUnitChange(e.target.value as WeightUnit)}
            className="h-10 rounded-md bg-surface-container-high border border-outline px-3 py-2 text-on-surface"
            aria-label="Unidad de peso"
          >
            {Object.keys(WEIGHT_UNIT).map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-error text-[11px] font-medium flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm select-none">error</span>
          {error}
        </p>
      )}
    </div>
  )
}
