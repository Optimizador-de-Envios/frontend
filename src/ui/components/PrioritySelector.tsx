import { useState } from 'react'
import type { ShippingPriority } from '../../domain/order'
import { SHIPPING_PRIORITY } from '../../domain/order'

type Props = {
  onConfirm: (priority: ShippingPriority) => void
}

export function PrioritySelector({ onConfirm }: Props) {
  const [selected, setSelected] = useState<ShippingPriority | null>(null)

  return (
    <div className="w-full max-w-xl space-y-10">
      <header className="space-y-2 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
          Selección de Prioridad
        </h1>
        <p className="text-on-surface-variant text-sm mx-auto max-w-md">
          Elige cómo deseas optimizar el envío: por costo o por tiempo de entrega.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <div
          data-testid="option-cost"
          onClick={() => setSelected(SHIPPING_PRIORITY.COST)}
          className={`cursor-pointer rounded-xl border-2 p-6 text-center transition-all ${
            selected === SHIPPING_PRIORITY.COST
              ? 'border-primary bg-primary/10'
              : 'border-surface-variant hover:border-primary/50'
          }`}
        >
          <span className="material-symbols-outlined text-4xl text-primary">payments</span>
          <h2 className="mt-3 font-headline font-bold text-lg">Prioridad Costo</h2>
          <p className="mt-1 text-on-surface-variant text-sm">
            Optimiza la ruta para minimizar el costo del envío.
          </p>
        </div>

        <div
          data-testid="option-time"
          onClick={() => setSelected(SHIPPING_PRIORITY.TIME)}
          className={`cursor-pointer rounded-xl border-2 p-6 text-center transition-all ${
            selected === SHIPPING_PRIORITY.TIME
              ? 'border-primary bg-primary/10'
              : 'border-surface-variant hover:border-primary/50'
          }`}
        >
          <span className="material-symbols-outlined text-4xl text-primary">schedule</span>
          <h2 className="mt-3 font-headline font-bold text-lg">Prioridad Tiempo</h2>
          <p className="mt-1 text-on-surface-variant text-sm">
            Optimiza la ruta para minimizar el tiempo de entrega.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <button
          disabled={selected === null}
          onClick={() => selected !== null && onConfirm(selected)}
          className="w-full bg-primary hover:bg-primary-fixed-dim disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-headline font-bold py-5 rounded-md tracking-tight transition-all active:scale-[0.98] shadow-lg"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
