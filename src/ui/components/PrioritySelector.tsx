import { useState } from 'react'
import type { ShippingPriority } from '../../domain/order'
import { SHIPPING_PRIORITY } from '../../domain/order'

type Option = {
  key: ShippingPriority
  icon: string
  title: string
  description: string
}

const OPTIONS: Option[] = [
  {
    key: SHIPPING_PRIORITY.COST,
    icon: 'payments',
    title: 'Prioridad Costo',
    description:
      'Optimiza para obtener la recomendación con menor costo de envío. Si eliges esta opción pagarás menos, pero el tiempo de entrega será mayor.',
  },
  {
    key: SHIPPING_PRIORITY.TIME,
    icon: 'schedule',
    title: 'Prioridad Tiempo',
    description:
      'Optimiza para obtener la recomendación con menor tiempo de entrega. Si eliges esta opción pagarás más, pero el tiempo de entrega será menor.',
  },
]

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
          El sistema recomendará proveedores según la prioridad seleccionada.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {OPTIONS.map((opt) => (
          <div
            key={opt.key}
            data-testid={`option-${opt.key.toLowerCase()}`}
            onClick={() => setSelected(opt.key)}
            className={`cursor-pointer rounded-xl border-2 p-6 text-center transition-all ${
              selected === opt.key ? 'border-primary bg-primary/10' : 'border-surface-variant hover:border-primary/50'
            }`}
          >
            <span className="material-symbols-outlined text-4xl text-primary">{opt.icon}</span>
            <h2 className="mt-3 font-headline font-bold text-lg">{opt.title}</h2>
            <p className="mt-1 text-on-surface-variant text-sm">{opt.description}</p>
          </div>
        ))}
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
