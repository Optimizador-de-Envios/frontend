import { useState } from 'react'
import { OrderForm } from '../components/OrderForm'
import { PrioritySelector } from '../components/PrioritySelector.tsx'
import { AppHeader } from '../components/AppHeader'
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
      <AppHeader />
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        {step === 'form' && <OrderForm onSuccess={() => setStep('priority')} />}
        {step === 'priority' && <PrioritySelector onConfirm={handleConfirm} />}
      </main>
    </div>
  )
}
