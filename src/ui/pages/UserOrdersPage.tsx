import { useEffect } from 'react'
import { AppHeader } from '../components/AppHeader'
import { useUserOrders } from '../../application/hooks/useUserOrders'

export function UserOrdersPage() {
  const { orders, loading, error, refreshOrders } = useUserOrders()

  useEffect(() => {
    void refreshOrders()
  }, [refreshOrders])

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow px-6 py-12">
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <header className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface-variant">
              Cuenta autenticada
            </p>
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-primary">
              Historial de pedidos
            </h1>
            <p className="text-sm text-on-surface-variant">
              Revisa los envíos confirmados desde tu sesión actual.
            </p>
          </header>

          {loading ? (
            <p data-testid="orders-loading" className="text-center text-on-surface-variant">
              Cargando historial...
            </p>
          ) : null}

          {error ? (
            <p role="alert" data-testid="orders-error" className="text-center text-error">
              {error}
            </p>
          ) : null}

          {!loading && !error && orders.length === 0 ? (
            <p data-testid="orders-empty" className="rounded-2xl border border-surface-variant bg-surface-container px-6 py-8 text-center text-on-surface-variant">
              No existen pedidos registrados para este usuario.
            </p>
          ) : null}

          {!loading && !error && orders.length > 0 ? (
            <div className="grid gap-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-surface-variant bg-surface-container p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface-variant">
                        Pedido
                      </p>
                      <h2 className="font-headline text-2xl font-bold text-primary">
                        {order.selectedOption.providerName}
                      </h2>
                      <p className="text-sm text-on-surface-variant">
                        {order.origin.name} → {order.destination.name}
                      </p>
                    </div>

                    <div className="grid gap-2 text-sm text-on-surface-variant md:text-right">
                      <p><span className="font-semibold text-on-surface">Peso:</span> {order.weight} {order.weightUnit}</p>
                      <p><span className="font-semibold text-on-surface">Prioridad:</span> {order.priority}</p>
                      <p><span className="font-semibold text-on-surface">Distancia:</span> {order.distanceKm} km</p>
                      <p><span className="font-semibold text-on-surface">Creado:</span> {new Date(order.createdAt).toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}