import { useState } from 'react'
import { OrderForm } from '../components/OrderForm'
import { PrioritySelector } from '../components/PrioritySelector.tsx'
import { useOrder } from '../../application/hooks/useOrder'
import { useRecommendation } from '../../application/hooks/useRecommendation'
import type { ShippingPriority } from '../../domain/order'

export function OrderPage() {
  const [step, setStep] = useState<'form' | 'priority'>('form')
  const { order, setPriority } = useOrder()
  const { fetchRecommendation } = useRecommendation()

  function handleConfirm(p: ShippingPriority) {
    setPriority(p)
    if (order) {
      fetchRecommendation({ ...order, priority: p })
    }
  }

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
        {step === 'form' && <OrderForm onSuccess={() => setStep('priority')} />}
        {step === 'priority' && <PrioritySelector onConfirm={handleConfirm} />}
      </main>
    </div>
  )
}
